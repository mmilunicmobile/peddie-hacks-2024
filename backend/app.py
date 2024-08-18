# Import FastAPI for backend server communication
import fastapi
from fastapi.responses import FileResponse
from pydantic import BaseModel
from enum import Enum
from typing import List
import abjad
import random
import os
from auth import router as auth_router
from routes.route import router as score_router
from PIL import Image, ImageChops

# Create FastAPI app
app = fastapi.FastAPI()

app.include_router(auth_router)
app.include_router(score_router)

class BeatType(Enum):
    QUARTER = ("quarter", 1)
    EIGHTH = ("eighth", 2)
    TRIPLET = ("triplet", 3)
    SIXTEENTH = ("sixteenth", 4)

class Beat():
    beatType: BeatType
    noteValues: List[bool]
    def __init__(self, beatVariant, noteList: List[bool]):
        self.beatType = beatVariant
        self.noteValues = noteList

def generateBeatTypesForMeasureFinite(level: str, setNumber: int) -> List[BeatType]:
    beatTypeList: List[BeatType] = []
    if level == 1:
        for x in range(4):
            beatTypeList.append(BeatType.QUARTER)
    elif level == 2:
        for x in range(4):
            randFloat = random.random()
            if(randFloat <= 0.15):
                beatTypeList.append(BeatType.QUARTER)
            else:
                beatTypeList.append(BeatType.EIGHTH)
    elif level == 3:
        for x in range(4):
            randFloat = random.random()
            if(randFloat <= 0.10):
                beatTypeList.append(BeatType.QUARTER)
            elif(randFloat > 0.10 & randFloat <= 0.20):
                beatTypeList.append(BeatType.EIGHTH)
            else:
                beatTypeList.append(BeatType.SIXTEENTH)
    elif level == 4:
        for x in range(4):
            beatTypeList.append(BeatType.TRIPLET)
    elif level == 5:
        for x in range(4):
            randFloat = random.random()
            if(randFloat <= 0.25):
                beatTypeList.append(BeatType.QUARTER)
            elif(randFloat <= 0.50 & randFloat > 0.25):
                beatTypeList.append(BeatType.EIGHTH)
            elif(randFloat <= 0.75 & randFloat > 0.50):
                beatTypeList.append(BeatType.SIXTEENTH)
            elif(randFloat > 0.75):
                beatTypeList.append(BeatType.TRIPLET)
    return beatTypeList

endlessQuarterFOC = 3.0
endlessEighthFOC = 30.0

def generateBeatTypesForMeasureEndless(sets: str, setNumber: int, time: float) -> List[BeatType]:
    beatTypeList: List[BeatType] = []
    for x in range(4):
        randFloat = random.random()
        if(randFloat <= pow(0.32, (sets + 2)/endlessQuarterFOC)):
            beatTypeList.append(BeatType.QUARTER)
        elif(randFloat <= pow(0.32, (sets + 2)/endlessEighthFOC) + pow(0.32, (sets + 29)/endlessQuarterFOC)):
            beatTypeList.append(BeatType.EIGHTH)
        elif(randFloat <= pow(0.32, (sets + 2)/endlessEighthFOC) + pow(0.32, (sets + 29)/endlessQuarterFOC) + 0.32):
            beatTypeList.append(BeatType.SIXTEENTH)
        elif(randFloat > pow(0.32, (sets + 2)/endlessEighthFOC) + pow(0.32, (sets + 29)/endlessQuarterFOC) + 0.32):
            beatTypeList.append(BeatType.TRIPLET)   
    return beatTypeList       

def generateTempo(level: int, sets: int) -> int:
    match level:
        case 1:
            return 87
        case 2:
            return 87
        case 3:
            return 97
        case 4:
            return 100
        case 5:
            return 110
        case 6:
            return 100 * (1 * (0.05 * sets))

# Randomly generate all the notes in a beat
def generateNoteValues(beatType: BeatType) -> Beat:
    note_name, notes_per_beat = beatType.value
    noteList: List[bool] = []
    for x in range(notes_per_beat):
        noteList.append(random.random() > 0.45)
    return Beat(beatType, noteList)

# Test via: print(getFrontendListFromBeatList(generateMeasure([BeatType.QUARTER, BeatType.EIGHTH, BeatType.TRIPLET, BeatType.SIXTEENTH])))
def generateMeasure(beats: List[BeatType]) -> List[Beat]:
    measure = []
    for x in range(4):
        measure.append(generateNoteValues(beats[x]))
    return measure

# Code to Trim the Background of an Image based on Online Method
def trim(im):
    background = Image.new(im.mode, im.size, im.getpixel((0,0)))
    difference = ImageChops.difference(im, background)
    difference = ImageChops.add(difference, difference, 2.0, -100)
    boundingBox = difference.getbbox()
    if boundingBox:
        return im.crop(boundingBox)

    
def generateLilyPondPNG(notes: List[Beat]):
    rhythmString = ""

    for note in notes:
        noteValues = note.noteValues
        beatType = note.beatType
        beatLength = 4 * beatType.value[1]
        if beatLength != 12:
            for note in noteValues:
                if note:
                    rhythmString += "c" + str(beatLength) + " " 
                else:
                    rhythmString += "r" + str(beatLength) + " " 
        else:
            tempString = "{"
            for note in noteValues:
                if note:
                    tempString += "c8 " #+ num2str(4/beatLength)
                else:
                    tempString += "r8 "
            tempString += "} "
            rhythmString += "\\tuplet 3/2 " + tempString

    voice = abjad.Voice(rhythmString)
    staff = abjad.Staff([voice], name="rhythmEndless", lilypond_type="RhythmicStaff")
    # abjad.show(staff)
    png = abjad.persist.as_png(staff, "none", resolution=300)
    im = Image.open(png[0][0]);
    width, height = im.size
    im = im.crop((0, 0, width, height / 2))
    im = trim(im)
    return im

def finiteOrEndless(level: int, sets: int) -> List[BeatType]:
    if level == 6:
        return generateBeatTypesForMeasureEndless(sets)
    else:
        return generateBeatTypesForMeasureFinite(level)

# takes a list of beats and turns it into the frontend format
def createFrontendList(beats: List[Beat]) -> List[float]:
    timingsList = []
    currentTime = 0
    for beat in beats:
        noteValues = beat.noteValues
        beatType = beat.beatType
        beatLength = 1.0 / beatType.value[1]
        for note in noteValues:
            if note:
                timingsList.append(currentTime)
            currentTime += beatLength
    return timingsList

@app.get("/api/set/level/{level}/")
def getFrontendList(level: int, setNumber: int, time: float) -> List[float]:
    return dict(generateTempo(level, setNumber), createFrontendList(generateMeasure(finiteOrEndless(level, setNumber))), FileResponse(generateLilyPondPNG))

# Define default root route
@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get("/test")
async def test():
    result = generateLilyPondPNG(generateMeasure(generateBeatTypesForMeasureEndless(13)))
    return {"result": result}

# For some reason on windows you have to use this command even though port is defined
# uvicorn app:app --reload --port 5000
if __name__ == '__main__':
    print(([generateLilyPondPNG(generateMeasure(generateBeatTypesForMeasureEndless(13, 0, 0)))]))
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000) 
    

'''
if __name__ == "__main__":
    print(([generateLilyPond(generateMeasure(generateBeatTypesForMeasure(13)))]))
'''