from time import *
from physical import *
from gpio import *
from environment import Environment
from ioeclient import IoEClient
from pyjs import *

ALARM_LEVEL = 20.
ENVIRONMENT_NAME = "CO"

state = 0
level = 0

def setup ():
    global state
    IoEClient.setup({
        "type": "Carbon Monoxide Detector",
        "states": [{
            "name": "Alarm",
            "type": "bool",
            "controllable": False
        },
        {
            "name": "Level",
            "type": "number",
            "controllable": False
        }]
    })

    state = restoreProperty("state", 0)
    setState(state)
    sendReport()

def restoreProperty (propertyName, defaultValue):
    value = getDeviceProperty(getName(), propertyName)
    if  value != "" and value != None:
        if isinstance(defaultValue, (int, float)):
            value = int(value)

        setDeviceProperty(getName(), propertyName, value)
        return value

    return defaultValue

def loop ():
    detect()
    delay(1000)


def detect ():
    value = Environment.get(ENVIRONMENT_NAME)
    if value >= 0 :
        setLevel( Environment.get(ENVIRONMENT_NAME))

def sendReport ():
    report = str(state) +","+str(level);    # comma seperated states
    IoEClient.reportStates(report)
    setDeviceProperty(getName(), "state", state)
    setDeviceProperty(getName(), "level", level)

def setState (newState):
    global state
    if  newState == 0:
        digitalWrite(1, LOW)
    else:
        digitalWrite(1, HIGH)

    state = newState

    sendReport()

def setLevel (newLevel):
    global level
    if level == newLevel:
        return

    level = newLevel
    if  level > ALARM_LEVEL:
        setState(1)
    else:
        setState(0)

    sendReport()

if __name__ == "__main__":
    setup()
    while True:
        loop()
        sleep(0)

