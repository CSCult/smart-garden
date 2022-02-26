from environment import *
from physical import *
from gpio import *
from time import *
from ioeclient import *
import math

ENVIRONMENT_NAME = "Atmospheric Pressure"
P_MIN = 0;    # assumed minimum pressure value in the environment
P_MAX = 100*1000;  # (Pa) assumed maximum pressure value in the environment
level = 0

def setup():

    IoEClient.setup({
        "type": "Atm. Pressure Sensor",
        "states": [
        {
            "name": "Atm. Pressure",
            "type": "number",
            "controllable": False
        }]
    })

    sendReport()



def main():
    setup()
    while True:
        detect()
        sendReport()
        delay(1000)


def detect():
    global ENVIRONMENT_NAME
    value = Environment.get(ENVIRONMENT_NAME) * 1000; # sale to Pa from kPa
    if value >= 0 :
        setLevel( value )

def sendReport():
    global level
    report = level; # comma seperated states

    IoEClient.reportStates(report)
    setDeviceProperty(getName(), "level", str(level) + " Pa")


def setLevel(newLevel):
    global level
    global ENVIRONMENT_NAME
    global P_MIN
    global P_MAX
    if  level == newLevel:
        return

    level = math.floor(float(newLevel))

    avalue = level

    if avalue < P_MIN:
        avalue = P_MIN
    if avalue > P_MAX:
        avalue = P_MAX

    setCustomText(20,18,200,20, Environment.getValueWithUnit(ENVIRONMENT_NAME) )
    # 50% at sea level
    out_avalue = float(128)/101.325 * Environment.getMetricValue(ENVIRONMENT_NAME)

    analogWrite(A0, out_avalue)
    sendReport()
    delay(500)

if __name__ == "__main__":
	main()