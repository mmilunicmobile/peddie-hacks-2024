# Import FastAPI for backend server communication
import fastapi
from pydantic import BaseModel
from enum import Enum
from typing import List
import abjad
import random
import sqlalchemy
from auth import router as auth_router

# Create FastAPI app
app = fastapi.FastAPI()

app.include_router(auth_router)

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

endlessQuarterFOC = 3.0
endlessEighthFOC = 30.0

@app.get("/api/set/level/{level}?number={setNumber}&time={time}")
def generateBeatTypesForMeasureEndless(sets: int) -> List[BeatType]:
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
    abjad.persist.as_png(staff)
    return rhythmString

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

@app.get("/api/set/level/{level}?number={setNumber}&time={time}")
def getFrontendList(setNumber: int) -> List[float]:
    return createFrontendList(generateMeasure(generateBeatTypesForMeasureEndless(setNumber)))

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
    print(([generateLilyPondPNG(generateMeasure(generateBeatTypesForMeasureEndless(13)))]))
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000) 
    

'''
if __name__ == "__main__":
    print(([generateLilyPond(generateMeasure(generateBeatTypesForMeasure(13)))]))
'''
