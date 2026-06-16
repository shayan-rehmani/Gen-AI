from fastapi import FastAPI, UploadFile, File, Form
from typing import Optional

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