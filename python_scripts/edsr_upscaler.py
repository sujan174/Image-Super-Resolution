# EDSR (Enhanced Deep Residual Networks) image upscaling implementation
import torch
import gc
import traceback
import numpy as np
from PIL import Image
from datetime import datetime
from typing import Optional
from super_image import EdsrModel, ImageLoader


class ImageUpscaler:

    def __init__(
        self,
        model_type: str,
        scale: int,
        model_name: str = None,
        log_file_path: Optional[str] = None
    ):
        self.model = None
        self.scale = scale
        self.log_file_path = log_file_path
        # Automatically use GPU if available for faster processing
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        self._log(f"Using device: {self.device}")

        if model_type.upper() != 'EDSR':
            raise ValueError("This wrapper is specifically for EDSR models.")
        if not model_name:
            raise ValueError("A 'model_name' from Hugging Face Hub is required for EDSR.")

        self._load_model(model_name)

    def _log(self, message: str):
        if self.log_file_path:
            timestamp = datetime.now().isoformat()
            try:
                with open(self.log_file_path, 'a') as f:
                    f.write(f"{timestamp} - [Python:EDSR] {message}\n")
            except IOError as e:
                print(f"Failed to write to log file: {e}", file=sys.stderr)

    def _load_model(self, model_name: str):
        self._log(f"Loading EDSR model: '{model_name}' for {self.scale}x upscaling...")
        try:
            self.model = EdsrModel.from_pretrained(model_name, scale=self.scale)
            self.model.to(self.device)
            self.model.eval()
            self._log("Model loaded successfully.")
        except Exception:
            self._log(f"FATAL ERROR loading model '{model_name}'.")
            self._log(traceback.format_exc())
            raise

    # Process input image through EDSR model to produce upscaled output
    def upscale_image(self, image_path: str) -> Optional[Image.Image]:
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

            # Convert tensor output back to PIL Image format
            output_tensor = preds.data.squeeze().float().cpu().clamp_(0, 1)
            output_numpy = np.transpose(output_tensor.numpy(), (1, 2, 0))
            output_image = Image.fromarray((output_numpy * 255.0).round().astype(np.uint8))

            return output_image

        except Exception:
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
        except Exception:
            self._log("Error during model cleanup.")
            self._log(traceback.format_exc())
