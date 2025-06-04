from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from deepface import DeepFace
from PIL import Image
import numpy as np
import io

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173","emotion-detection-rosy.vercel.app","https://emotion-detection-git-main-mohiths-projects-03eb589d.vercel.app/"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/analyze/")
async def analyze_image(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert("RGB")
        image_np = np.array(image)

        analysis = DeepFace.analyze(
            img_path=image_np,
            actions=["emotion", "age", "gender", "race"],
            enforce_detection=False
        )[0]

        return {
            "emotion": analysis["dominant_emotion"],
            "age": analysis["age"],
            "gender": analysis["dominant_gender"],
            "race": analysis["dominant_race"]
        }

    except Exception as e:
        return {"error": str(e)}
