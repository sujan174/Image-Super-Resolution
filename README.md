# AI Image Upscaler 
*A sleek, modern web application that enhances low-resolution images using powerful AI models.*

![NodeJS](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)  
![ExpressJS](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)  
![PyTorch](https://img.shields.io/badge/PyTorch-EE4C2C?style=for-the-badge&logo=pytorch&logoColor=white)  


---

## Features  
- **Secure User Authentication** – Full login/signup system using **JWT** and cookies.  
- **Multiple AI Models** – Choose between **EDSR**, **Real-ESRGAN**, and **SwinIR** for upscaling.  
- **Variable Scaling** – Upscale images by **2x**, **3x**, or **4x**.  
- **Interactive Result Viewer** – Compare **Before & After** with a smooth slider.  
- **User Feedback System** – Collect ratings on the quality of upscaled images.  
- **Resolution Limiter** – Protects server resources by rejecting overly large images.  
- **Variable Scaling: Upscale** images by 2x, 3x, or 4x.
- **Interactive Result Viewer** A "Before & After" slider to compare the original and upscaled images.
- **User Gallery** A personal gallery for each user to view their history of upscaled images.
- **User Feedback System** Collect user ratings on the quality of the upscaled images.
- **Advanced Admin Dashboard**
- Analytics View: Charts showing total users, total upscales, model usage, and user feedback (liked vs. disliked).
  -   User Management: A complete list of all users with the ability to view their detailed history.
  -   Feedback Viewer: Pages to view all liked or disliked images, with the ability to download them in bulk as a zip file.
---

## Tech Stack  

**Frontend:**  
- EJS (Embedded JavaScript Templates)  
- Tailwind CSS  
- Chart.js

**Backend:**  
- Node.js  
- Express.js  
- MongoDB + Mongoose  
- JWT (JSON Web Tokens) for authentication  
- bcrypt for password hashing  
- Multer for file uploads  
- Sharp for image processing 
- Archiver for creating zip files 

**AI / Python:**  
- Python 3  
- PyTorch  
- Transformers (Hugging Face)  
- Pillow (PIL)  

---

## Project Structure  
```bash
/
├── controllers/ # Core logic for handling requests
├── middleware/ # Express middleware (auth, logging)
├── models/ # Mongoose schemas for the database
├── public/ # Static assets (images, stylesheets)
├── python_scripts/ # AI upscaling scripts and models
├── routes/ # Express route definitions
├── views/ # EJS template files
├── .env # Environment variables (not committed)
├── index.js # Main server entry point
├── package.json
└── requirements.txt
```

---

## Getting Started  

### **Prerequisites**  
- Node.js & npm  
- Python 3 & pip  
- MongoDB installed and running  

---

### **1. Clone the repository**  
```bash
git clone https://github.com/your-username/Super-Resolution-EDSR-REALESRGAN-SwinIR-.git
cd ai-image-upscaler
```

2. Install backend dependencies
```bash
npm install
```
3. Install Python dependencies
```bash
pip install -r requirements.txt
```
4. Set up environment variables
Create a .env file in the root directory:
```bash
JWT_SECRET="your_super_secret_jwt_key"
```
6. Run the server
```bash
node index.js
```
The app will be available at: http://localhost:8000

## Image Upscaling Models

This project supports **multiple state-of-the-art AI super-resolution models** — **EDSR**, **Real-ESRGAN**, and **SwinIR** — each offering different trade-offs between speed, quality, and computational requirements.  

---

### 1. EDSR (Enhanced Deep Super-Resolution Network)
**Paper:** [Enhanced Deep Residual Networks for Single Image Super-Resolution](https://arxiv.org/abs/1707.02921)  
**Best for:** High-quality results on clean, non-noisy images.  

**Key Features:**
- Deep residual blocks without batch normalization for better accuracy.
- Highly effective for **photographic images** where sharpness is critical.
- Produces **less noise** than many GAN-based methods.

**Advantages:**
- High PSNR and SSIM (great for fidelity to the original image).
- Minimal artifacts.

**Limitations:**
- Slower than lighter models. (EDSR-base is beign used in this project)
- Does not handle heavy noise well.

---

### 2. Real-ESRGAN
**Paper:** [Real-ESRGAN: Training Real-World Blind Super-Resolution with Pure Synthetic Data](https://arxiv.org/abs/2107.10833)  
**Best for:** Upscaling real-world images with noise, JPEG artifacts, or compression damage.  

**Key Features:**
- Improves on ESRGAN by adding **realistic degradations** to training data.
- Handles **noise, blur, and compression artifacts**.
- Suitable for **old photos**, **low-quality camera shots**, and **screenshots**.
- Supports **general-purpose image restoration**.

**Advantages:**
- Great for **restoration + upscaling** in one step.
- Better results for low-quality or damaged images.

**Limitations:**
- Slightly softer results on very clean images.
- Can be slower on very large inputs.

---

### 3. SwinIR (Swin Transformer for Image Restoration)
**Paper:** [SwinIR: Image Restoration Using Swin Transformer](https://arxiv.org/abs/2108.10257)  
**Best for:** Top-tier quality across a wide range of restoration tasks, especially high-resolution images.  

**Key Features:**
- Based on **Swin Transformer** architecture for powerful context modeling.
- Works well for **super-resolution, denoising, and JPEG artifact removal**.
- Captures **long-range dependencies** for better detail synthesis.

**Advantages:**
- State-of-the-art benchmark results.
- Handles clean and degraded images effectively.
- Preserves textures and details better than most CNN-based methods.

**Limitations:**
- Requires more VRAM and compute.
- Slower inference compared to lighter models.

---

### Model Selection Guide

| Model         | Best For                             | Speed        | Detail Preservation |
|---------------|--------------------------------------|--------------|---------------------|
| **EDSR**      | Clean, high-quality images           | Medium       | ★★★☆☆               |
| **Real-ESRGAN**| Noisy, compressed, low-quality imgs | Medium-Slow  | ★★★★☆               | 
| **SwinIR**    | High-res, mixed degradation          | Slow         | ★★★★★+              |


