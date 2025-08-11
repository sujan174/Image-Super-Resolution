# 🖼️ AI Image Upscaler 🚀  
*A sleek, modern web application that enhances low-resolution images using powerful AI models.*

![License](https://img.shields.io/badge/license-MIT-blue.svg)  
![Node.js](https://img.shields.io/badge/Node.js-18.x-green.svg)  
![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)  
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-brightgreen.svg)  

---

## ✨ Features  
- **Secure User Authentication** – Full login/signup system using **JWT** and cookies.  
- **Multiple AI Models** – Choose between **EDSR**, **Real-ESRGAN**, and **SwinIR** for upscaling.  
- **Variable Scaling** – Upscale images by **2x**, **3x**, or **4x**.  
- **Interactive Result Viewer** – "Before & After" slider to compare original and upscaled images.  
- **User Feedback System** – Collect user ratings on the quality of upscaled images.  
- **Production-Ready Backend** – Built with **Node.js** and **Express**, with robust error handling and logging.  
- **Sleek, Modern UI** – Fully responsive **dark-themed** interface built with **Tailwind CSS**.  
- **Resolution Limiter** – Prevents extremely large images from overloading the server.  

---

## 🛠️ Tech Stack  

**Frontend:**  
- EJS (Embedded JavaScript Templates)  
- Tailwind CSS  

**Backend:**  
- Node.js  
- Express.js  
- MongoDB + Mongoose  
- JWT (JSON Web Tokens) for authentication  
- bcrypt for password hashing  
- Multer for file uploads  
- Sharp for image processing  

**AI / Python:**  
- Python 3  
- PyTorch  
- Transformers (Hugging Face)  
- Pillow (PIL)  

---

## 📂 Project Structure  
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
└── package.json

yaml
Copy
Edit

---

## 🚀 Getting Started  

### **Prerequisites**  
- Node.js and npm  
- Python 3 and pip  
- MongoDB installed and running  

---

### **1. Clone the repository**  
```bash
git clone https://github.com/your-username/ai-image-upscaler.git
cd ai-image-upscaler
2. Install backend dependencies
bash
Copy
Edit
npm install
3. Install Python dependencies
bash
Copy
Edit
pip install -r requirements.txt
Note: Create a requirements.txt file with packages such as torch, transformers, Pillow, etc.

4. Set up environment variables
Create a .env file in the root of the project:

env
Copy
Edit
JWT_SECRET="your_super_secret_jwt_key"
MONGO_URI="mongodb://127.0.0.1:27017/upscaler"
5. Run the server
bash
Copy
Edit
node index.js
The app will be live at http://localhost:8000
