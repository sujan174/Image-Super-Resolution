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

