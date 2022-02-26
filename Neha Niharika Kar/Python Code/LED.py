from environment import *
from physical import *
from gpio import *
from time import *
from pyjs import *

MAX_LIGHT_PERCENT = 1
VOLUME_AT_RATE = 100000
value = 0

def setup():
    setComponentOpacity("black", 1)
    add_event_detect(0, isr)
    isr()


def isr():
    global value
    analoginput = analogRead(0)
    value = js_map(analoginput, 0, 1023, 0, 1)
    setComponentOpacity("black", 1-value)
    setDeviceProperty(getName(), "level",analoginput)



def main():
    setup()
    while True:
        updateEnvironment()
        delay(1000)


def updateEnvironment():
    global value
    global MAX_LIGHT_PERCENT
    global VOLUME_AT_RATE
    rate = float(value*MAX_LIGHT_PERCENT*VOLUME_AT_RATE) / Environment.getVolume()
    # rate equals limit because we want it to happen immediately
    Environment.setContribution("Visible Light", rate, rate, False)

if __name__ == "__main__":
    main()
