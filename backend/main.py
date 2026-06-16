from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from typing import Optional
from dotenv import load_dotenv

import replicate
import requests
import tempfile
import io

# =========================
# LOAD ENV
# =========================

load_dotenv()

app = FastAPI()

# =========================
# CORS
# =========================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================
# HOME
# =========================

@app.get("/")
def home():
    return {
        "message": "SketchAI Backend Running"
    }

# =========================
# GENERATE IMAGE
# =========================

@app.post("/generate-image")
async def generate_image(
    prompt: str = Form(...),
    reference_image: Optional[UploadFile] = File(None)
):
    try:

        print("Prompt:", prompt)

        if reference_image:

            print(
                "Image uploaded:",
                reference_image.filename
            )

            image_bytes = await reference_image.read()

            print(
                "Image size:",
                len(image_bytes),
                "bytes"
            )

            suffix = "." + reference_image.filename.split(".")[-1]

            with tempfile.NamedTemporaryFile(
                delete=False,
                suffix=suffix
            ) as temp_file:

                temp_file.write(image_bytes)

                temp_path = temp_file.name

            print(
                "Using image editing mode"
            )

            output = replicate.run(
                "openai/gpt-image-2",
                input={
                    "prompt": prompt,
                    "input_images": [
                        open(temp_path, "rb")
                    ]
                }
            )

        else:

            print(
                "No image uploaded"
            )

            output = replicate.run(
                "openai/gpt-image-2",
                input={
                    "prompt": prompt
                }
            )

        return {
            "success": True,
            "image_url": str(output[0]),
            "reference_image": (
                reference_image.filename
                if reference_image
                else None
            )
        }

    except Exception as e:

        print("ERROR:", e)

        return {
            "success": False,
            "error": str(e)
        }

# =========================
# HEALTH CHECK
# =========================

@app.get("/health")
def health():
    return {
        "status": "ok"
    }

# =========================
# DOWNLOAD IMAGE
# =========================

@app.get("/download-image")
def download_image(url: str):

    response = requests.get(url)

    return StreamingResponse(
        io.BytesIO(response.content),
        media_type="image/png",
        headers={
            "Content-Disposition":
            "attachment; filename=sketchai-image.png"
        }
    )