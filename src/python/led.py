import argparse
import json
import time
import re
import colorsys
import strip_manager

def clear_strip(strip):
    # TODO Read pid file and kill running process
    strip_manager.clearStrip(strip)

def parse_argument(raw):
    return json.loads(raw)

def show_effect(strip, effect):
    print("show effect based on config")
    print(effect)
    effectLength = len(effect["effects"]) - 1
    for index, effectData in enumerate(effect["effects"]):
        if (effectData["type"] != "solid"):
            print("Only supporting solid colors for now")

        solidColorValues = re.sub('[^0-9,]', '', effectData["value"]).split(',')
        strip_manager.colorWipe(strip, effect["nodes"], strip_manager.colorFromRgba(*solidColorValues))

        if ("duration" in effectData and effectData["duration"] < 1):
            break
        elif ("duration" in effectData):
            time.sleep(effectData["duration"])
            if ("repeat" in effectData and effectData["repeat"] == "infinite"):
                print("Implement infinit repeat")
            
            if ("repeat" in effectData and effectData["repeat"].isnumeric()):
                print("Implement x repeat")

            if (index == effectLength):
                strip_manager.clearStrip(strip)
    print(effect)

def show_characters(strip, characters):
    print("show players based on config")
    print(characters)

    whiteColor = strip_manager.colorFromRgba(255, 255, 255, 1)
    declaredPixels = []
    for character in characters:
        color = whiteColor
        if (character['maxHealth'] is not None):
            healthPercent = int(character['maxHealth']) / int(character['currentHealth'])
            healthHue = (1 - healthPercent) * 120
            r, g, b = colorsys.hls_to_rgb(healthHue, 0.5, 1.0)
            color = strip_manager.colorFromRgba(r, g, b, 1)

        firstNode = range(character['nodes'][0])
        lastNode = range(character['nodes'][-1])
        healthNodes = character['nodes'][1:-1]

        strip_manager.colorWipe(strip, firstNode, whiteColor)
        strip_manager.colorWipe(strip, lastNode, whiteColor)
        strip_manager.colorWipe(strip, healthNodes, color)

    declaredPixels = declaredPixels + character['nodes']
    uniqueNonPlayerPixels = (list(set(declaredPixels)))
    
    # TODO add ability to set the rest of the table's color
    offColor = strip_manager.colorFromRgba(20, 20, 20, 1)
    strip_manager.colorWipe(strip, uniqueNonPlayerPixels, offColor)


def run():
    parser = argparse.ArgumentParser("LED_Strip")
    parser.add_argument("--clear", help="Clear all active effect", action='store_true')
    parser.add_argument("--effect", help="JSON encoded effect data")
    parser.add_argument("--characters", help="JSON encoded player inititiative data")
    args = parser.parse_args()

    strip = strip_manager.initStrip()

    if (args.clear):
        clear_strip(strip)
    
    if (args.effect):
        effect = parse_argument(args.effect)
        show_effect(strip, effect)
    
    if (args.characters):
        characters = parse_argument(args.characters)
        show_characters(strip, characters)

    print("hello world")

run()