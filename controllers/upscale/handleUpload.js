const path = require('path');
const fs = require('fs'); 
const sharp = require('sharp'); 
const { spawn } = require('child_process');
const userModel = require("../../models/user");

const IMAGES_DIR = path.join(__dirname, '../../public/images/');
const LOG_FILE_PATH = path.join(__dirname, '../../log.txt');

async function handleUpload(req, res) {
    if (!req.file) {
        return res.redirect(`/upload?error=${encodeURIComponent("No file was selected.")}`);
    }

    try {
        const image = sharp(req.file.path);
        const metadata = await image.metadata();
        const MAX_PIXELS = 20000000; 

        if ((metadata.width * metadata.height) > MAX_PIXELS) {
            fs.unlinkSync(req.file.path); 
            const errorMsg = `Image resolution (${metadata.width}x${metadata.height}) is too high.`;
            return res.redirect(`/upload?error=${encodeURIComponent(errorMsg)}`);
        }
        
        const { modelType, scale } = req.body;
        const pythonScriptPath = path.join(__dirname, '..', '..', 'python_scripts', 'main.py');
        const outputFilename = `upscaled-${req.file.filename}`;
        const outputPath = path.join(IMAGES_DIR, outputFilename);
        
        const args = [pythonScriptPath, req.file.path, outputPath, modelType, scale, LOG_FILE_PATH];
        
        const pythonProcess = spawn('python3', args);

        pythonProcess.on('error', (err) => {
            console.error("[Node Log] FAILED TO START PYTHON SCRIPT:", err.message);
            if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
            res.redirect(`/upload?error=${encodeURIComponent("Server error: Could not run script.")}`);
        });

        pythonProcess.stderr.on('data', (data) => {
            console.error(`[Python stderr] ${data}`);
        });

        pythonProcess.on('close', async (code) => {
            console.log(`[Node Log] Python script finished with exit code ${code}`);
            
            if (code !== 0) {
                if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
                return res.redirect(`/upload?error=${encodeURIComponent("An error occurred during image processing.")}`);
            }
            try {
                await userModel.findByIdAndUpdate(req.user.id, {
                    $push: {
                        imageHistory: {
                            originalPath: req.file.filename, 
                            upscaledPath: outputFilename,
                            modelUsed: modelType,
                            scaleFactor: scale
                        }
                    }
                });
            } catch (dbError) {
                console.error("Error saving image to user history:", dbError);
            }

            const upscaledImage = sharp(outputPath);
            const upscaledMetadata = await upscaledImage.metadata();
            
            const queryParams = new URLSearchParams({
                imageUrl: `/images/${outputFilename}`, 
                originalImageUrl: `/images/${req.file.filename}`, 
                model: modelType,
                scale: scale,
                originalDimensions: `${metadata.width}x${metadata.height}`,
                upscaledDimensions: `${upscaledMetadata.width}x${upscaledMetadata.height}`
            }).toString();
            
            res.redirect(`/upload/result?${queryParams}`);
        });

    } catch (error) {
        console.error("[Node Log] Error in /upload route:", error);
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        res.redirect(`/upload?error=${encodeURIComponent("An error occurred processing your image.")}`);
    }
}

module.exports = handleUpload;
