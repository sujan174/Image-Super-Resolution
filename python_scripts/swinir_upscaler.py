# Developed by Sujan H
# SwinIR/Swin2SR transformer-based image super-resolution upscaler
import gc
import os
import traceback
from datetime import datetime

import numpy as np
import torch
from PIL import Image
from transformers import Swin2SRForImageSuperResolution, Swin2SRImageProcessor


class ImageUpscaler:

    def __init__(self, model_type: str, scale: int, model_name: str = None,
                 log_file_path: str = None):
        self.model = None
        self.processor = None
        self.scale = scale
        self.log_file_path = log_file_path
        # Automatically select GPU or CPU for model inference
        self.device = torch.device(
            'cuda' if torch.cuda.is_available() else 'cpu'
        )
        self._log(f"Using device: {self.device}")

        if model_type.upper() not in ['SWINIR', 'SWIN2SR']:
            raise ValueError(
                "This wrapper is specifically for SwinIR/Swin2SR models."
            )
        if not model_name:
            model_name = f'caidas/swin2SR-classical-sr-x{scale}-64'

        self._load_model(model_name)

    def _log(self, message):
        if self.log_file_path:
            timestamp = datetime.now().isoformat()
            with open(self.log_file_path, 'a') as f:
                f.write(f"{timestamp} - [Python:SwinIR] {message}\n")

    def _load_model(self, model_name: str):
        self._log(
            f"Loading Swin2SR model: '{model_name}' for "
            f"{self.scale}x upscaling..."
        )
        try:
            self.model = Swin2SRForImageSuperResolution.from_pretrained(
                model_name
            )
            self.processor = Swin2SRImageProcessor.from_pretrained(
                model_name
            )
            self.model.to(self.device)
            self.model.eval()
            self._log("Model loaded successfully.")
        except Exception as e:
            self._log(f"FATAL ERROR loading model '{model_name}'.")
            self._log(traceback.format_exc())
            raise

    # Run image through Swin2SR model and return upscaled result
    def upscale_image(self, image_path: str):
        if not self.model or not self.processor:
            self._log(
                "ERROR: Model or processor is not loaded, cannot upscale."
            )
            return None

        try:
            self._log(f"Opening image: {image_path}")
            image = Image.open(image_path).convert('RGB')
            inputs = self.processor(
                image, return_tensors="pt"
            ).to(self.device)

            self._log("Performing model inference...")
            with torch.no_grad():
                outputs = self.model(**inputs)
            self._log("Inference complete.")

            # Convert model output tensor to image
            output = outputs.reconstruction.data.squeeze().float().cpu()
            output = output.clamp_(0, 1).numpy()
            output = np.moveaxis(output, source=0, destination=-1)
            output_image = Image.fromarray(
                (output * 255.0).round().astype(np.uint8)
            )

            return output_image

        except Exception as e:
            self._log(f"FATAL ERROR processing image at {image_path}.")
            self._log(traceback.format_exc())
            return None

    def close(self):
        self._log("Cleaning up SwinIR model and freeing memory...")
        try:
            if self.model is not None:
                del self.model
                del self.processor
                gc.collect()
                if self.device.type == 'cuda':
                    torch.cuda.empty_cache()
                self.model = None
                self.processor = None
                self._log("Cleanup complete.")
            else:
                self._log("Model was not loaded, no cleanup needed.")
        except Exception as e:
            self._log("Error during model cleanup.")
            self._log(traceback.format_exc())
