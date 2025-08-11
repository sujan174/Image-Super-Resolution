<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI Image Upscaler README</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            background-color: #0d1117;
            color: #c9d1d9;
            line-height: 1.6;
            padding: 2rem;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            border: 1px solid #30363d;
            border-radius: 8px;
            padding: 2rem 3rem;
            background-color: #161b22;
        }
        h1, h3 {
            border-bottom: 1px solid #30363d;
            padding-bottom: 0.5rem;
            margin-top: 2rem;
            margin-bottom: 1rem;
            font-weight: 600;
        }
        h1 {
            font-size: 2.5rem;
        }
        h3 {
            font-size: 1.5rem;
        }
        img {
            max-width: 100%;
            border-radius: 6px;
        }
        ul {
            list-style-type: disc;
            padding-left: 20px;
        }
        li {
            margin-bottom: 0.5rem;
        }
        code {
            background-color: #2d333b;
            padding: 0.2em 0.4em;
            margin: 0;
            font-size: 85%;
            border-radius: 6px;
            font-family: monospace;
        }
        pre {
            background-color: #1c2128;
            padding: 1rem;
            border-radius: 6px;
            overflow-x: auto;
            border: 1px solid #30363d;
        }
        pre code {
            padding: 0;
            background-color: transparent;
        }
        a {
            color: #58a6ff;
            text-decoration: none;
        }
        a:hover {
            text-decoration: underline;
        }
        strong {
            font-weight: 600;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>AI Image Upscaler 🚀</h1>
        <p>
            <img src="https://placehold.co/1200x400/1a202c/9f7aea?text=AI%20Image%20Upscaler&font=inter" alt="AI Image Upscaler Banner">
        </p>
        <p>A sleek, modern web application that enhances low-resolution images using powerful AI models. This project features a secure user authentication system, a beautiful dark-themed UI, and a robust backend that interfaces with Python scripts to perform the image upscaling.</p>

        <h3>✨ Features</h3>
        <ul>
            <li><strong>Secure User Authentication</strong>: Full login/signup system using JWT and cookies.</li>
            <li><strong>Multiple AI Models</strong>: Choose between EDSR, Real-ESRGAN, and SwinIR for upscaling.</li>
            <li><strong>Variable Scaling</strong>: Upscale images by 2x, 3x, or 4x.</li>
            <li><strong>Interactive Result Viewer</strong>: A "Before & After" slider to compare the original and upscaled images.</li>
            <li><strong>User Feedback System</strong>: Collect user ratings on the quality of the upscaled images.</li>
            <li><strong>Production-Ready Backend</strong>: Built with Node.js and Express, featuring robust error handling and logging.</li>
            <li><strong>Sleek, Modern UI</strong>: A fully responsive dark-themed interface built with Tailwind CSS.</li>
            <li><strong>Resolution Limiter</strong>: Protects the server by rejecting images that are too large.</li>
        </ul>

        <h3>🛠️ Tech Stack</h3>
        <p><strong>Frontend:</strong></p>
        <ul>
            <li>EJS (Embedded JavaScript templates)</li>
            <li>Tailwind CSS</li>
        </ul>
        <p><strong>Backend:</strong></p>
        <ul>
            <li>Node.js</li>
            <li>Express.js</li>
            <li>MongoDB with Mongoose</li>
            <li>JWT (JSON Web Tokens) for authentication</li>
            <li>bcrypt for password hashing</li>
            <li>Multer for file uploads</li>
            <li>Sharp for image processing</li>
        </ul>
        <p><strong>AI / Python:</strong></p>
        <ul>
            <li>Python 3</li>
            <li>PyTorch</li>
            <li>Transformers (Hugging Face)</li>
            <li>Pillow (PIL)</li>
        </ul>

        <h3>📂 Project Structure</h3>
        <p>The project is organized into a clean, modular structure to separate concerns and improve maintainability.</p>
        <pre><code>/
├── controllers/      # Core logic for handling requests
├── middleware/       # Express middleware (auth, logging)
├── models/           # Mongoose schemas for the database
├── public/           # Static assets (images, stylesheets)
├── python_scripts/   # AI upscaling scripts and models
├── routes/           # Express route definitions
├── views/            # EJS template files
├── .env              # Environment variables (not committed)
├── index.js          # Main server entry point
└── package.json</code></pre>

        <h3>🚀 Getting Started</h3>
        <p>Follow these steps to get the project running on your local machine.</p>
        <p><strong>Prerequisites:</strong></p>
        <ul>
            <li>Node.js and npm</li>
            <li>Python 3 and pip</li>
            <li>MongoDB installed and running</li>
        </ul>
        <p><strong>1. Clone the repository:</strong></p>
        <pre><code>git clone https://github.com/your-username/ai-image-upscaler.git
cd ai-image-upscaler</code></pre>
        <p><strong>2. Install backend dependencies:</strong></p>
        <pre><code>npm install</code></pre>
        <p><strong>3. Install Python dependencies:</strong></p>
        <pre><code>pip install -r requirements.txt</code></pre>
        <p><em>(Note: You will need to create a <code>requirements.txt</code> file with all the necessary Python packages like <code>torch</code>, <code>transformers</code>, <code>Pillow</code>, etc.)</em></p>
        <p><strong>4. Set up environment variables:</strong></p>
        <p>Create a <code>.env</code> file in the root of the project and add the following:</p>
        <pre><code>JWT_SECRET="your_super_secret_jwt_key"
MONGO_URI="mongodb://127.0.0.1:27017/upscaler"</code></pre>
        <p><strong>5. Run the server:</strong></p>
        <pre><code>node index.js</code></pre>
        <p>The application should now be running at <a href="http://localhost:8000">http://localhost:8000</a>.</p>

        <h3>📄 License</h3>
        <p>This project is licensed under the MIT License. See the <code>LICENSE</code> file for details.</p>
    </div>
</body>
</html>
