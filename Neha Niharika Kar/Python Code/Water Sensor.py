from options import Options
from time import *
import math
from physical import *
from gpio import *
from environment import Environment
from ioeclient import IoEClient
from pyjs import *


ENVIRONMENT_NAME = "Water Level"        # var ENVIRONMENT_NAME
MIN = 0        # var MIN
MAX = 20        # var MAX
value = MIN        # var value


def loop ():
    global value

    value = Environment.get(ENVIRONMENT_NAME)

    if value < MIN:
        value = MIN
    elif value > MAX:
        value = MAX

    setDeviceProperty(getName(), "level", value)
    value = js_map(value, MIN, MAX, 0, 255)
    analogWrite(A0, value)
    delay(1000)





if __name__ == "__main__":
#    setup()
    while True:
        loop()
        sleep(0)

