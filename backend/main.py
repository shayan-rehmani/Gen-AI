from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from typing import Optional
from dotenv import load_dotenv

import os
import io
import tempfile
import traceback
import requests
import replicate

# =========================
# LOAD ENV
# =========================

load_dotenv()

# Increase Replicate timeout
os.environ["REPLICATE_HTTP_TIMEOUT"] = "300"

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

        print("\n====================")
        print("Prompt:", prompt)

        # IMAGE EDITING MODE
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

            print("Using image editing mode")

            with open(temp_path, "rb") as img:

                output = replicate.run(
                    "openai/gpt-image-2",
                    input={
                        "prompt": prompt,
                        "input_images": [img]
                    }
                )

        # TEXT TO IMAGE MODE
        else:

            print("No image uploaded")

            output = replicate.run(
                "openai/gpt-image-2",
                input={
                    "prompt": prompt
                }
            )

        print("Generation successful")

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

        print("\n========== ERROR ==========")
        traceback.print_exc()
        print("===========================\n")

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
        media_type="application/octet-stream",
        headers={
            "Content-Disposition":
            "attachment; filename=sketchai-image.webp"
        }
    )