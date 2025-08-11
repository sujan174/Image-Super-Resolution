import torch
from PIL import Image
import gc
import numpy as np
from super_image import EdsrModel, ImageLoader
from datetime import datetime
import traceback

class ImageUpscaler:
    def __init__(self, model_type: str, scale: int, model_name: str = None, log_file_path: str = None):
        self.model = None
        self.scale = scale
        self.log_file_path = log_file_path
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        self._log(f"Using device: {self.device}")

        if model_type.upper() != 'EDSR':
            raise ValueError("This wrapper is specifically for EDSR models.")
        if not model_name:
            raise ValueError("A 'model_name' from Hugging Face Hub is required for EDSR.")

        self._load_model(model_name)

    def _log(self, message):
        if self.log_file_path:
            timestamp = datetime.now().isoformat()
            with open(self.log_file_path, 'a') as f:
                f.write(f"{timestamp} - [Python:EDSR] {message}\n")

    def _load_model(self, model_name: str):
        self._log(f"Loading EDSR model: '{model_name}' for {self.scale}x upscaling...")
        try:
            self.model = EdsrModel.from_pretrained(model_name, scale=self.scale)
            self.model.to(self.device)
            self.model.eval()
            self._log("Model loaded successfully.")
        except Exception as e:
            self._log(f"FATAL ERROR loading model '{model_name}'.")
            self._log(traceback.format_exc())
            raise

    def upscale_image(self, image_path: str):
        if not self.model:
            self._log("ERROR: Model is not loaded, cannot upscale.")
            return None
            
        try:
            self._log(f"Opening image: {image_path}")
            image = Image.open(image_path).convert('RGB')
            inputs = ImageLoader.load_image(image).to(self.device)

            self._log("Performing model inference...")
            with torch.no_grad():
                preds = self.model(inputs)
            self._log("Inference complete.")

            output_tensor = preds.data.squeeze().float().cpu().clamp_(0, 1)
            output_numpy = np.transpose(output_tensor.numpy(), (1, 2, 0))
            output_image = Image.fromarray((output_numpy * 255.0).round().astype(np.uint8))
            
            return output_image

        except Exception as e:
            self._log(f"FATAL ERROR processing image at {image_path}.")
            self._log(traceback.format_exc())
            return None

    def close(self):
        self._log("Cleaning up EDSR model and freeing memory...")
        try:
            if self.model is not None:
                del self.model
                gc.collect()
                if self.device.type == 'cuda':
                    torch.cuda.empty_cache()
                self.model = None
                self._log("Cleanup complete.")
            else:
                self._log("Model was not loaded, no cleanup needed.")
        except Exception as e:
            self._log("Error during model cleanup.")
            self._log(traceback.format_exc())
