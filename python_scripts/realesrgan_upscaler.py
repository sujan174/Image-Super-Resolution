# Developed by Sujan H
# Real-ESRGAN upscaling with custom RRDB architecture implementation
import gc
import os
import traceback
from datetime import datetime

import numpy as np
import torch
from PIL import Image
from torch import nn
from torch.nn import functional as F


# Residual Dense Block - building block for the RRDB architecture
class ResidualDenseBlock(nn.Module):

    def __init__(self, num_feat=64, num_grow_ch=32):
        super(ResidualDenseBlock, self).__init__()
        self.conv1 = nn.Conv2d(num_feat, num_grow_ch, 3, 1, 1)
        self.conv2 = nn.Conv2d(
            num_feat + num_grow_ch, num_grow_ch, 3, 1, 1
        )
        self.conv3 = nn.Conv2d(
            num_feat + 2 * num_grow_ch, num_grow_ch, 3, 1, 1
        )
        self.conv4 = nn.Conv2d(
            num_feat + 3 * num_grow_ch, num_grow_ch, 3, 1, 1
        )
        self.conv5 = nn.Conv2d(
            num_feat + 4 * num_grow_ch, num_feat, 3, 1, 1
        )
        self.lrelu = nn.LeakyReLU(negative_slope=0.2, inplace=True)

    def forward(self, x):
        x1 = self.lrelu(self.conv1(x))
        x2 = self.lrelu(self.conv2(torch.cat((x, x1), 1)))
        x3 = self.lrelu(self.conv3(torch.cat((x, x1, x2), 1)))
        x4 = self.lrelu(self.conv4(torch.cat((x, x1, x2, x3), 1)))
        x5 = self.conv5(torch.cat((x, x1, x2, x3, x4), 1))
        return x5 * 0.2 + x


class RRDB(nn.Module):
    
    def __init__(self, num_feat, num_grow_ch=32):
        super(RRDB, self).__init__()
        self.rdb1 = ResidualDenseBlock(num_feat, num_grow_ch)
        self.rdb2 = ResidualDenseBlock(num_feat, num_grow_ch)
        self.rdb3 = ResidualDenseBlock(num_feat, num_grow_ch)

    def forward(self, x):
        out = self.rdb1(x)
        out = self.rdb2(out)
        out = self.rdb3(out)
        return out * 0.2 + x


class RRDBNet(nn.Module):
    
    def __init__(self, num_in_ch, num_out_ch, num_feat, num_block,
                 num_grow_ch):
        super(RRDBNet, self).__init__()
        self.conv_first = nn.Conv2d(num_in_ch, num_feat, 3, 1, 1)
        self.body = nn.Sequential(
            *[RRDB(num_feat, num_grow_ch) for _ in range(num_block)]
        )
        self.conv_body = nn.Conv2d(num_feat, num_feat, 3, 1, 1)
        self.conv_up1 = nn.Conv2d(num_feat, num_feat, 3, 1, 1)
        self.conv_up2 = nn.Conv2d(num_feat, num_feat, 3, 1, 1)
        self.conv_hr = nn.Conv2d(num_feat, num_feat, 3, 1, 1)
        self.conv_last = nn.Conv2d(num_feat, num_out_ch, 3, 1, 1)
        self.lrelu = nn.LeakyReLU(negative_slope=0.2, inplace=True)

    def forward(self, x):
        feat = self.conv_first(x)
        body_feat = self.conv_body(self.body(feat))
        feat = feat + body_feat
        
        feat = self.lrelu(
            self.conv_up1(
                F.interpolate(feat, scale_factor=2, mode='nearest')
            )
        )
        feat = self.lrelu(
            self.conv_up2(
                F.interpolate(feat, scale_factor=2, mode='nearest')
            )
        )
        
        out = self.conv_last(self.lrelu(self.conv_hr(feat)))
        return out


# Main upscaler class that loads and runs the Real-ESRGAN model
class ImageUpscaler:

    def __init__(self, model_type: str, scale: int, model_path: str,
                 log_file_path: str = None):
        self.model = None
        self.scale = scale
        self.log_file_path = log_file_path
        # Use GPU acceleration if available
        self.device = torch.device(
            'cuda' if torch.cuda.is_available() else 'cpu'
        )
        self._log(f"Using device: {self.device}")

        if model_type.upper() != 'REALESRGAN':
            raise ValueError(
                "This wrapper is specifically for RealESRGAN models."
            )
        if scale != 4:
            raise ValueError(
                "This Real-ESRGAN model architecture only supports "
                "4x scaling."
            )
        if not model_path:
            raise ValueError(
                "A 'model_path' to a local .pth file is required."
            )

        self._load_model(model_path)

    def _log(self, message):
        if self.log_file_path:
            timestamp = datetime.now().isoformat()
            with open(self.log_file_path, 'a') as f:
                f.write(f"{timestamp} - [Python:RealESRGAN] {message}\n")

    def _load_model(self, model_path: str):
        self._log(
            f"Loading Real-ESRGAN model from: "
            f"'{os.path.basename(model_path)}'..."
        )
        try:
            self.model = RRDBNet(
                num_in_ch=3,
                num_out_ch=3,
                num_feat=64,
                num_block=23,
                num_grow_ch=32
            )
            
            loadnet = torch.load(model_path, map_location=torch.device('cpu'))
            keyname = 'params_ema' if 'params_ema' in loadnet else 'params'
            
            self.model.load_state_dict(loadnet[keyname], strict=True)
            self.model.eval()
            self.model.to(self.device)
            self._log("Model loaded successfully.")
        except Exception as e:
            self._log(f"FATAL ERROR loading model from '{model_path}'.")
            self._log(traceback.format_exc())
            raise

    def _preprocess(self, img_array: np.ndarray):
        img_tensor = torch.from_numpy(
            np.transpose(img_array, (2, 0, 1))
        ).float() / 255.0
        return img_tensor.unsqueeze(0).to(self.device)

    def _postprocess(self, tensor: torch.Tensor):
        img = tensor.data.squeeze().float().clamp_(0, 1).cpu().numpy()
        img = np.transpose(img, (1, 2, 0))
        return (img * 255.0).round().astype(np.uint8)

    def upscale_image(self, image_path: str):
        if not self.model:
            self._log("ERROR: Model is not loaded, cannot upscale.")
            return None
            
        try:
            self._log(f"Opening image: {image_path}")
            image_array = np.array(Image.open(image_path).convert('RGB'))
            inputs = self._preprocess(image_array)

            self._log("Performing model inference...")
            with torch.no_grad():
                preds = self.model(inputs)
            self._log("Inference complete.")

            output_array = self._postprocess(preds)
            return Image.fromarray(output_array)

        except Exception as e:
            self._log(f"FATAL ERROR processing image at {image_path}.")
            self._log(traceback.format_exc())
            return None

    def close(self):
        self._log("Cleaning up RealESRGAN model and freeing memory...")
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
