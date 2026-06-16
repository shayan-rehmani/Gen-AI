# 🎨 SketchAI

SketchAI is a modern AI-powered image generation and image editing web application built with FastAPI, Replicate AI, HTML, CSS, and JavaScript.

It provides a ChatGPT-style interface where users can:

* Generate images from text prompts
* Edit existing images using AI
* Upload reference images
* Modify clothing colors, backgrounds, styles, and objects
* View generated images in fullscreen
* Download generated images
* Maintain local chat history

---

# ✨ Features

## Text → Image Generation

Generate completely new images using natural language prompts.

Example:

> A futuristic cyberpunk city at sunset with neon lights and flying cars

---

## Image + Prompt → Image Editing

Upload an image and instruct the AI to modify it.

Examples:

> Change my kurti color to red

> Replace the background with a beach

> Turn this photo into anime style

> Add sunglasses to the person

The AI preserves the original image while applying requested changes.

---

## ChatGPT Style Interface

* Modern dark theme
* Chat-based image generation workflow
* User messages appear in chat
* AI-generated images appear as responses
* Press Enter to generate
* Shift + Enter for new line

---

## Drag & Drop Upload

Users can:

* Click upload
* Select an image
* Drag and drop images directly

---

## Image Viewer

Generated images can be:

* Opened in fullscreen
* Zoomed via browser
* Downloaded directly

---

## Chat History

Generated images and prompts are stored locally using LocalStorage.

Users can revisit previous generations from the sidebar.

---

# 🛠 Tech Stack

Frontend:

* HTML5
* CSS3
* Vanilla JavaScript

Backend:

* FastAPI
* Python

AI:

* Replicate API
* OpenAI GPT-Image-2

---

# 📁 Project Structure

```text
SketchAI/

│
├── backend/
│   ├── main.py
│   ├── .env
│   └── requirements.txt
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   ├── script.js
│   └── assets/
│       └── loading.gif
│
└── README.md
```

# 🚀 Installation

## 1. Clone Repository

```bash
git clone https://github.com/shayan-rehmani/SketchAI.git

cd SketchAI
```

## 2. Create Virtual Environment

```bash
python -m venv venv
```

Activate:

Windows:

```bash
venv\Scripts\activate
```

Mac/Linux:

```bash
source venv/bin/activate
```

---

## 3. Install Dependencies

```bash
pip install -r requirements.txt
```

If requirements.txt is missing:

```bash
pip install fastapi
pip install uvicorn
pip install python-dotenv
pip install replicate
pip install requests
pip install python-multipart
```

---

# 🔑 Replicate API Setup

## Create Account

Visit:

https://replicate.com

Create an account.

---

## Generate API Token

Open:

Account → API Tokens

Create a new token.

Example:

```text
r8_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

---

## Create .env File

Inside backend folder:

```text
backend/.env
```

Add:

```env
REPLICATE_API_TOKEN=YOUR_REPLICATE_API_KEY
```

Example:

```env
REPLICATE_API_TOKEN=r8_xxxxxxxxxxxxxxxxx
```

Important:

Never upload your .env file to GitHub.

---

# ▶ Running Backend

Open terminal:

```bash
cd backend
```

Start FastAPI:

```bash
python -m uvicorn main:app --reload
```

Expected:

```text
Application startup complete.
Uvicorn running on http://127.0.0.1:8000
```

---

# ▶ Running Frontend

Open frontend folder.

Recommended:

Use VS Code Live Server.

Right Click:

```text
index.html
```

Select:

```text
Open With Live Server
```

Do NOT open via:

```text
file:///
```

Use:

```text
http://localhost:5500
```

instead.

---

# 📡 API Endpoints

## Home

```http
GET /
```

Response:

```json
{
  "message": "SketchAI Backend Running"
}
```

---

## Generate Image

```http
POST /generate-image
```

Parameters:

| Field           | Type            |
| --------------- | --------------- |
| prompt          | string          |
| reference_image | file (optional) |

Returns:

```json
{
  "success": true,
  "image_url": "..."
}
```

---

## Download Image

```http
GET /download-image
```

Downloads generated image directly to device.

---

## Health Check

```http
GET /health
```

Returns:

```json
{
  "status": "ok"
}
```

---

# 📷 Example Usage

Text Generation:

```text
A realistic futuristic sports car in Tokyo at night
```

Image Editing:

Upload photo:

```text
person.png
```

Prompt:

```text
Change shirt color to blue.
Keep face, pose and background unchanged.
```

---

# ⚠ Important Notes

The quality of edits depends heavily on prompt quality.

For best results:

Use:

```text
Keep the same person,
same face,
same pose,
same background,
only change the shirt color.
```

instead of:

```text
Change shirt color.
```

Detailed prompts produce more accurate edits.

---

# 🔒 Security

Never commit:

```text
.env
```

Add this to .gitignore:

```gitignore
.env
__pycache__/
venv/
.venv/
*.pyc
```

---

# 🧠 Future Improvements

Planned Features:

* User Accounts
* Cloud Chat History
* Image Variations
* Multiple Image Uploads
* Style Presets
* Image Upscaling
* AI Background Removal
* Mobile Responsive UI
* Dark/Light Themes
* Public Gallery

---

# ❤️ Acknowledgements

Built using:

* FastAPI
* Replicate
* OpenAI GPT-Image-2
* HTML
* CSS
* JavaScript

---

# 📄 License

This project is open source.

Feel free to modify, improve, and build upon it.

If you found this project useful, consider starring the repository.
