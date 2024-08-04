import argparse
import json
import time
import re
import strip_manager

def clear_strip(strip):
    # TODO Read pid file and kill running process
    strip_manager.clearStrip(strip)

def parse_effect(raw):
    return json.loads(raw)

def show_effect(strip, effect):
    print("show effect based on config")
    print(effect)
    effectLength = len(effect["effects"]) - 1
    for index, effectData in enumerate(effect["effects"]):
        if (effectData["type"] != "solid"):
            print("Only supporting solid colors for now")

        solidColorValue = re.sub('[^0-9,]', '', effectData["value"])
        strip_manager.colorWipe(strip, effect["nodes"], strip_manager.colorFromRgba(solidColorValue.split(',')))

        if (effectData["duration"] < 1):
            break
        else:
            time.sleep(effectData["duration"])
            if (effectData["repeat"] == "infinite"):
                print("Implement infinit repeat")
            
            if (effectData["repeat"].isnumeric()):
                print("Implement x repeat")

            if (index == effectLength):
                strip_manager.clearStrip(strip)
    print(effect)

def run():
    parser = argparse.ArgumentParser("LED_Strip")
    parser.add_argument("--clear", help="Clear all active effect", action='store_true')
    parser.add_argument("--effect", help="JSON encoded effect data")
    args = parser.parse_args()

    strip = strip_manager.initStrip()

    if (args.clear):
        clear_strip(strip)
    
    if (args.effect):
        effect = parse_effect(args.effect)
        show_effect(strip, effect)

    print("hello world")

run()