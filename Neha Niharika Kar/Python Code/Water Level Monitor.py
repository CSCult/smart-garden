from options import Options
from time import *
import math
from physical import *
from gpio import *
from environment import Environment
from ioeclient import IoEClient
#from pyjs import *


ENVIRONMENT_NAME = "Water Level" # global environment variable to hold the water level        # var ENVIRONMENT_NAME
METRIC = True # use cm when set to true and inch when set to false        # var METRIC
level = 0 # level of water measured in either inch or cm        # var level
# set up metric, initialize state and client to talk to IoE registration server

def setup ():
    global level
    IoEClient.setup({
        "type": "Water Level Monitor",
        "states": [{
            "name": "Water Level",
            "type": "number",
            "unit": "cm",
            "imperialUnit": "in",
            "toImperialConversion": "x/2.54",
            "toMetricConversion": "x*2.54",
            "decimalDigits": 1,
            "controllable": False
        }]
    })
    setState()
    sendReport()


# continuosly detecting water level and send report to server

def loop ():
    measurementSystemChangeEvent()
    detect()
    sendReport()
    delay(1000)


# get WATER_LEVEL measurement defined in Environment

def detect ():
    global ENVIRONMENT_NAME
    value = Environment.get(ENVIRONMENT_NAME)        # var value
    setLevel("%.2f"%(value,))


# send water level in desired metric to the server

def sendReport ():
    global level
    report = level # comma seperated states        # var report
    IoEClient.reportStates(report)
    setDeviceProperty(getName(), "level", report)


# set state and update component image to reflect the current state

def setState ():
    global level
    if level > 0:
        digitalWrite(1, HIGH)
    else:
        digitalWrite(1, LOW)

    sendReport()


# set water level

def setLevel (newLevel):
    global level
    global METRIC
    level = newLevel
    setCustomText(35, 20, 200, 20, str("%.2f"%(convertLength(level, METRIC))))
    setState()

def convertLength (value, isMetric):
    if isMetric:
        return value
    else:
        return float(value) / 2.54
        
def measurementSystemChangeEvent ():
    global METRIC, unit
    METRIC = Options.isUsingMetric()


if __name__ == "__main__":
    setup()
    while True:
        loop()
        sleep(0)

