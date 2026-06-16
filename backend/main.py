from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
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
    prompt: str = Form(...)
):
    try:

        output = replicate.run(
            "openai/gpt-image-2",
            input={
                "prompt": prompt
            }
        )

        return {
            "success": True,
            "image_url": str(output[0])
        }

    except Exception as e:

        return {
            "success": False,
            "error": str(e)
        }
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)