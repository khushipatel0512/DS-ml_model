from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib

app = FastAPI()

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# load model
model = joblib.load("logisticmodel.pkl")

class datascience (BaseModel):
    StudyHours: float

# api end point 

@app.get("/")
def test():
    return{"msg": "uvicorn is running"}   

# model student hr 
# round 10.8=11
# ceil 10.9=10//11
#abs  23.5 24 

@app.post("/predict")
def datainsert(ds: datascience):
    pred = model.predict([[ds.StudyHours]])
    result = "Pass" if int(pred[0]) == 1 else "Fail"

    return {
        "StudyHours": ds.StudyHours,
        "result": result
    }