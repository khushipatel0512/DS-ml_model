#code - Api 
# fastapi - rest api ,
#uvicorn - server - 8000,
# basemodel - structure and validation 
# @ - annotation - set of instruction 
# "/" - routes 

from fastapi import FastAPI
from pydantic import BaseModel
import joblib

app=FastAPI() # inilaization 
# load model
model=joblib.load("linearmodel.pkl")

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
def datainsert(ds:datascience):
    marks = model.predict([[ds.StudyHours]])
    return{"predictmarks": round(float(marks[0]),2)}






# ci/cd 
# cont intergration and continues deployment github - process 
# github action - small scale data  we can use as per the given data 
# jenkins - for large scale   we can creeate by own 

