from fastapi import FastAPI, UploadFile, File, Form
from typing import Optional
from dotenv import load_dotenv
import replicate

# Load .env file
load_dotenv()

app = FastAPI()


@app.get("/")
def home():
    return {
        "message": "SketchAI Backend Running"
    }


@app.post("/generate-image")
async def generate_image(
    prompt: str = Form(...),
    reference_image: Optional[UploadFile] = File(None)
):
    return {
        "success": True,
        "prompt": prompt,
        "reference_image": (
            reference_image.filename
            if reference_image
            else None
        )
    }


@app.get("/test-image")
def test_image():

    output = replicate.run(
        "openai/gpt-image-2",
        input={
            "prompt": "A futuristic cyberpunk city at sunset"
        }
    )

    return {
        "image_url": str(output[0])
    }