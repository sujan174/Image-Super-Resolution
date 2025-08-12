import sys
import os
import traceback
from datetime import datetime
from PIL import Image
import signal

LOG_FILE_PATH = None

class TimeoutError(Exception):
    pass

def timeout_handler(signum, frame):
    raise TimeoutError("The process exceeded the time limit.")

def log_to_file(message):
    if LOG_FILE_PATH:
        timestamp = datetime.now().isoformat()
        with open(LOG_FILE_PATH, 'a') as f:
            f.write(f"{timestamp} - [Python] {message}\n")

from edsr_upscaler import ImageUpscaler as EdsrUpscaler
from realesrgan_upscaler import ImageUpscaler as RealEsrganUpscaler
from swinir_upscaler import ImageUpscaler as SwinIrUpscaler

def main():
    global LOG_FILE_PATH
    TIMEOUT_SECONDS = 180

    if hasattr(signal, 'SIGALRM'):
        signal.signal(signal.SIGALRM, timeout_handler)
    else:
        TIMEOUT_SECONDS = 0

    try:
        if len(sys.argv) != 6:
            print(f"Usage: python main.py <input> <output> <model> <scale> <log_path>", file=sys.stderr)
            sys.exit(1)

        input_path = sys.argv[1]
        output_path = sys.argv[2]
        model_type = sys.argv[3]
        requested_scale = int(sys.argv[4])
        LOG_FILE_PATH = sys.argv[5]

        log_to_file(f"--- Starting Upscale Job (Timeout: {TIMEOUT_SECONDS}s) ---")
        log_to_file(f"Input: {input_path}, Output: {output_path}, Model: {model_type}, Scale: {requested_scale}")

        if not os.path.exists(input_path):
            log_to_file(f"ERROR: Input file not found at '{input_path}'")
            sys.exit(1)

        if TIMEOUT_SECONDS > 0:
            signal.alarm(TIMEOUT_SECONDS)
        
        try:
            upscaler_map = {
                'EDSR': EdsrUpscaler,
                'RealESRGAN': RealEsrganUpscaler,
                'SwinIR': SwinIrUpscaler
            }
            UpscalerClass = upscaler_map.get(model_type)

            if not UpscalerClass:
                log_to_file(f"ERROR: Invalid model type '{model_type}'")
                sys.exit(1)
            
            log_to_file(f"Instantiating 4x upscaler for model: {model_type}")
            
            script_dir = os.path.dirname(__file__)
            if model_type == 'RealESRGAN':
                model_identifier = os.path.join(script_dir, '/Users/sujanh/Documents/Running projects/SR/python_scripts/models/RealESRGAN x4plus.pth')
                upscaler = UpscalerClass(model_type=model_type, scale=4, model_path=model_identifier)
            elif model_type == 'EDSR':
                model_identifier = 'eugenesiow/edsr-base'
                upscaler = UpscalerClass(model_type=model_type, scale=4, model_name=model_identifier)
            elif model_type == 'SwinIR':
                model_identifier = 'caidas/swin2SR-classical-sr-x4-64'
                upscaler = UpscalerClass(model_type=model_type, scale=4, model_name=model_identifier)
            
            log_to_file("Upscaler instantiated. Starting image processing...")
            upscaled_4x_image = upscaler.upscale_image(input_path)
            log_to_file("Image processing finished.")

            if upscaled_4x_image:
                final_image = upscaled_4x_image
                if requested_scale < 4:
                    log_to_file(f"Downscaling image to {requested_scale}x.")
                    original_image = Image.open(input_path)
                    target_width = original_image.width * requested_scale
                    target_height = original_image.height * requested_scale
                    final_image = upscaled_4x_image.resize((target_width, target_height), Image.Resampling.LANCZOS)
                    log_to_file(f"Downscaling complete. New size: {final_image.size}")

                log_to_file(f"Saving final image to: {output_path}")
                final_image.save(output_path)
                log_to_file("--- Upscale Job Successful ---")
                print(output_path)
            else:
                log_to_file("ERROR: Upscaling failed to return an image object.")
                sys.exit(1)
        finally:
            if TIMEOUT_SECONDS > 0:
                signal.alarm(0)


    except Exception as e:
        log_to_file(f"FATAL ERROR: An unexpected error occurred. Code took {TIMEOUT_SECONDS}s")
        log_to_file(traceback.format_exc())
        sys.exit(1)

if __name__ == "__main__":
    main()
