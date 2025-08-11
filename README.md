AI Image Upscaler 🚀
A sleek, modern web application that enhances low-resolution images using powerful AI models. This project features a secure user authentication system, a beautiful dark-themed UI, and a robust backend that interfaces with Python scripts to perform the image upscaling.

✨ Features
Secure User Authentication: Full login/signup system using JWT and cookies.

Multiple AI Models: Choose between EDSR, Real-ESRGAN, and SwinIR for upscaling.

Variable Scaling: Upscale images by 2x, 3x, or 4x.

Interactive Result Viewer: A "Before & After" slider to compare the original and upscaled images.

User Feedback System: Collect user ratings on the quality of the upscaled images.

Production-Ready Backend: Built with Node.js and Express, featuring robust error handling and logging.

Sleek, Modern UI: A fully responsive dark-themed interface built with Tailwind CSS.

Resolution Limiter: Protects the server by rejecting images that are too large.

🛠️ Tech Stack
Frontend:

EJS (Embedded JavaScript templates)

Tailwind CSS

Backend:

Node.js

Express.js

MongoDB with Mongoose

JWT (JSON Web Tokens) for authentication

bcrypt for password hashing

Multer for file uploads

Sharp for image processing

AI / Python:

Python 3

PyTorch

Transformers (Hugging Face)

Pillow (PIL)

📂 Project Structure
The project is organized into a clean, modular structure to separate concerns and improve maintainability.

/
├── controllers/      # Core logic for handling requests
├── middleware/       # Express middleware (auth, logging)
├── models/           # Mongoose schemas for the database
├── public/           # Static assets (images, stylesheets)
├── python_scripts/   # AI upscaling scripts and models
├── routes/           # Express route definitions
├── views/            # EJS template files
├── .env              # Environment variables (not committed)
├── index.js          # Main server entry point
└── package.json

🚀 Getting Started
Follow these steps to get the project running on your local machine.

Prerequisites:

Node.js and npm

Python 3 and pip

MongoDB installed and running

1. Clone the repository:

git clone [https://github.com/your-username/ai-image-upscaler.git](https://github.com/your-username/ai-image-upscaler.git)
cd ai-image-upscaler

2. Install backend dependencies:

npm install

3. Install Python dependencies:

pip install -r requirements.txt

(Note: You will need to create a requirements.txt file with all the necessary Python packages like torch, transformers, Pillow, etc.)

4. Set up environment variables:
Create a .env file in the root of the project and add the following:

JWT_SECRET="your_super_secret_jwt_key"
MONGO_URI="mongodb://127.0.0.1:27017/upscaler"

5. Run the server:

node index.js

The application should now be running at http://localhost:8000.

📄 License
This project is licensed under the MIT License. See the LICENSE file for details.
