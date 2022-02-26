from gpio import *
from time import *
from physical import *
from ioeclient import *
from environment import *
import math

# Purpose:
# Humiture detector.  Check environmental values to determine and display the humiture.

# Environment must have these two variables in order for this object to work.
# The tempurature must be in degrees fahrenheit.
TEMPERATURE_NAME = "Ambient Temperature"
HUMIDITY_NAME = 'Humidity'

# How temperatures are represented in the Environment.
# If you are storing temperature as C then this would be true.
# If as F then false.  This way the script knows how to convert it when reading from the environment.
METRIC = True


def main():
	setup()
	while True:  
	    loop()
	    
def setup():
    # Necessary for display in a registration server.
    IoEClient.setup({
        "type": "Humitor Sensor",
        "states": [
        {
            "name": "Humitor",
            "type": "number",

            "controllable": False
        }]
    })

# Purpose:
# Update function.  Occures once each update.  Limits how over the temerature is detected to speed up the operation.
def loop():
    detect()
    delay(1000)


# Detects when how temperature is stored in then environment is changed.
# Updates the display and handles the correct measurement type (F or C)
def measurementSystemChangeEvent():
    global METRIC
    METRIC = isUsingMetric()
    if METRIC == True:
    	unit = "C"
    else:
    	unit = "F"

    detect()


# Purpose:
# Check the environmental value and calculate and display the humiture.
def detect():
    global TEMPERATURE_NAME
    global HUMIDITY_NAME
    temperature = Environment.get(TEMPERATURE_NAME)
    humidity = Environment.get(HUMIDITY_NAME)
    if 0 > humidity:
        humidity = 0

    if METRIC:
        temperature = float(temperature * 1.8) + 32

    updateHumiture(temperature,  humidity)



# Purpose:
# Compute the humature and update the text display.
def updateHumiture(temperature, humidity):
    result = float(temperature + humidity)/2
    text = math.floor(result + .5)
    setCustomText(30, 20, 230, 52, text)

    # Update a registration server.
    IoEClient.reportStates(text)
    setDeviceProperty(getName(), "level", text)


if __name__ == "__main__":
    main()