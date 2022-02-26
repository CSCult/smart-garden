from gpio import *
from time import *
from physical import *
from environment import *
from pyjs import *
import math

# Purpose:
# Humiture sensor.  Check environmental values to determine the humiture.

# Environment must have these two variables in order for this object to work.
# The tempurature must be in degrees fahrenheit.
TEMPERATURE_NAME = "Ambient Temperature"
HUMIDITY_NAME = 'Humidity'
MIN = 0
MAX = 100

# How temperatures are represented in the Environment.
# If you are storing temperature as C then this would be true.
# If as F then false.  This way the script knows how to convert it when reading from the environment.
METRIC = True

def main():
    while True:
	    loop()

# Purpose:
# Update function.  Occures once each update.  Limits how over the temerature is detected to speed up the operation.
def loop():
    detect()
    delay(1000)


# Detects when how temperature is stored in then environment is changed.
# Updates the display and handles the correct measurement type (F or C)
def measurementSystemChangeEvent():
    METRIC = isUsingMetric()
    detect()


# Purpose:
# Check the environmental value and calculate and display the humiture.
def detect():
    temperature = Environment.get(TEMPERATURE_NAME)
    humidity = Environment.get(HUMIDITY_NAME)
    if 0 > humidity:
        humidity = 0

    if METRIC == True:
        temperature = (temperature * 1.8) + 32

    updateHumiture(temperature,  humidity)



# Purpose:
# Compute the humature and update the text display.
def updateHumiture(temperature, humidity):
    global MIN
    global MAX
    result = float(temperature + humidity)/2
    if result < MIN:
        result = MIN
    elif result > MAX:
        result = MAX
    setDeviceProperty(getName(), "level", math.floor(result + .5))
    result = math.floor(js_map(result, MIN, MAX, 0, 255))
    analogWrite(A0, result)

if __name__ == "__main__":
    main()