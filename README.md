# AI Image Upscaler

A sleek, modern web application that enhances low-resolution images using powerful AI models.

<div align="left">

![NodeJS](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)  
![ExpressJS](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)  
![PyTorch](https://img.shields.io/badge/PyTorch-EE4C2C?style=for-the-badge&logo=pytorch&logoColor=white)  
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)

</div>

---

## ✨ Features

- **Secure User Authentication** — JWT and cookie-based login/signup with Google OAuth integration
- **Multiple AI Models** — Choose between EDSR, Real-ESRGAN, and SwinIR for optimal upscaling results
- **Flexible Scaling Options** — Upscale images by 2x, 3x, or 4x resolution
- **Interactive Comparison Viewer** — Before & after slider for instant quality assessment
- **Personal Gallery** — View and manage your complete upscaling history
- **User Feedback System** — Rate and collect insights on upscaling quality
- **Resource Protection** — Built-in resolution limiter to safeguard server infrastructure
- **Advanced Admin Dashboard** — Comprehensive analytics and user management tools
  - Analytics with charts for users, upscales, model usage, and feedback trends
  - Complete user management and detailed history viewing
  - Bulk download of liked/disliked images for model improvement

---

## 🛠️ Tech Stack

**Frontend**
- EJS (Embedded JavaScript Templates)
- Tailwind CSS
- Chart.js

**Backend**
- Node.js & Express.js
- MongoDB + Mongoose
- JWT authentication
- bcrypt password hashing
- Multer file uploads
- Sharp image processing
- Archiver for ZIP file creation

**AI & Python**
- Python 3
- PyTorch
- Hugging Face Transformers
- Pillow (PIL)

---

## 📁 Project Structure

```
ai-image-upscaler/
├── controllers/          # Request handling logic
├── middleware/           # Authentication & logging middleware
├── models/              # Mongoose database schemas
├── public/              # Static assets (CSS, images, JS)
├── python_scripts/      # AI upscaling models and scripts
├── routes/              # Express route definitions
├── views/               # EJS template files
├── .env                 # Environment variables (not committed)
├── index.js             # Server entry point
├── package.json
└── requirements.txt
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js & npm
- Python 3 & pip
- MongoDB (local or cloud)

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/your-username/ai-image-upscaler.git
cd ai-image-upscaler
```

**2. Install backend dependencies**

```bash
npm install
```

**3. Install Python dependencies**

```bash
pip install -r requirements.txt
```

**4. Set up MongoDB**

Choose one of the following options:

<details>
<summary><b>Option A: Local MongoDB Installation</b></summary>

**macOS (Homebrew):**
```bash
brew tap mongodb/brew
brew install mongodb-community@7.0
brew services start mongodb-community@7.0
```

**Ubuntu / Debian:**
```bash
sudo apt update
sudo apt install -y mongodb
sudo systemctl enable mongodb
sudo systemctl start mongodb
```

**Windows:**
- Download from [MongoDB Community Server](https://www.mongodb.com/try/download/community)
- Install with default settings and enable as Windows service
- Verify: `mongo --version`
- Start: `net start MongoDB`

**Connection string:** `mongodb://localhost:27017`

</details>

<details>
<summary><b>Option B: MongoDB Atlas (Cloud)</b></summary>

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster and user account
3. Obtain your connection string (format: `mongodb+srv://<username>:<password>@cluster0.mongodb.net/<database>`)
4. Add to `.env` file as `MONGO_URI`

</details>

**Verify MongoDB connection:**

```bash
node -e "require('./index')"
```

**5. Configure environment variables**

Create a `.env` file in the root directory:

```env
JWT_SECRET=your_super_secret_jwt_key
MONGO_URI=mongodb://localhost:27017/ai_image_upscaler
CLIENT_ID=your_google_client_id
CLIENT_SECRET=your_google_client_secret
```

**6. Start the application**

```bash
node index.js
```

The application will be available at: **http://localhost:8000**

---

## 🤖 AI Image Upscaling Models

This project features three state-of-the-art super-resolution models, each optimized for different use cases.

### EDSR (Enhanced Deep Super-Resolution Network)

**Paper:** [Enhanced Deep Residual Networks for Single Image Super-Resolution](https://arxiv.org/abs/1707.02921)

**Ideal For:** Clean, high-quality images requiring maximum fidelity

**Strengths**
- High PSNR and SSIM metrics for image accuracy
- Minimal artifacts and clean output
- Excellent for photographic images

**Limitations**
- Slower inference compared to lighter models
- Struggles with noisy or heavily degraded images

---

### Real-ESRGAN

**Paper:** [Real-ESRGAN: Training Real-World Blind Super-Resolution with Pure Synthetic Data](https://arxiv.org/abs/2107.10833)

**Ideal For:** Real-world images with noise, JPEG artifacts, or compression damage

**Strengths**
- Handles noise, blur, and compression artifacts effectively
- Excellent for old photos and low-quality camera shots
- One-step restoration and upscaling

**Limitations**
- Slightly softer results on pristine images
- Slower on very large inputs

---

### SwinIR (Swin Transformer for Image Restoration)

**Paper:** [SwinIR: Image Restoration Using Swin Transformer](https://arxiv.org/abs/2108.10257)

**Ideal For:** High-resolution images with mixed degradation requiring best-in-class quality

**Strengths**
- State-of-the-art benchmark performance
- Superior texture and detail preservation
- Effective for both clean and degraded images
- Advanced Swin Transformer architecture

**Limitations**
- Highest computational requirements
- Requires more VRAM and processing time

---

## 📊 Model Comparison

| Model | Best Use Case | Speed | Detail Preservation | Noise Handling |
|-------|---------------|-------|---------------------|----------------|
| **EDSR** | Clean, high-quality images | ⚡⚡ Medium | ⭐⭐⭐ Good | ⭐⭐ Fair |
| **Real-ESRGAN** | Degraded, noisy images | ⚡ Slow | ⭐⭐⭐⭐ Excellent | ⭐⭐⭐⭐ Excellent |
| **SwinIR** | High-resolution mixed quality | 🐢 Very Slow | ⭐⭐⭐⭐⭐ Outstanding | ⭐⭐⭐⭐⭐ Outstanding |

---



