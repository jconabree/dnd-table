import argparse
import json
import time
import re
import strip_manager

def clear_strip(strip):
    # TODO Read pid file and kill running process
    strip_manager.clearStrip(strip)

def parse_argument(raw):
    return json.loads(raw)

def parse_color_string(colorString):
    return re.sub('[^0-9,]', '', colorString).split(',')

def show_effect(strip, effect):
    print("show effect based on config")
    print(effect)
    effectLength = len(effect["effects"]) - 1
    for index, effectData in enumerate(effect["effects"]):
        if (effectData["type"] != "solid"):
            print("Only supporting solid colors for now")

        solidColorValues = parse_color_string(effectData["value"])
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

def percentage_to_rgb(percentage):
    if not (0 <= percentage <= 100):
        raise ValueError("Percentage must be between 0 and 100.")

    green = int((percentage / 100) * 255)
    red = int(255 - ((percentage / 100) * 255))
    
    return (red, green, 5)

def show_characters(strip, characters):
    print("show players based on config")
    print(characters)

    whiteColor = strip_manager.colorFromRgba(255, 255, 255, 1)
    whiteHighlightColor = strip_manager.colorFromRgba(177, 6, 201, 1)
    declaredPixels = []
    for character in characters:
        color = whiteColor
        if (character['maxHealth'] is not None):
            healthPercent = (int(character['currentHealth']) / int(character['maxHealth'])) * 100
            r, g, b = percentage_to_rgb(healthPercent)
            color = strip_manager.colorFromRgba(r, g, b, 1)

        if (character["isCurrent"]):
            print("is current")
            firstNode = [character['nodes'][0]]
            lastNode = [character['nodes'][-1]]
            healthNodes = character['nodes'][1:-1]

            highlightColor = whiteColor if character['maxHealth'] is not None else whiteHighlightColor
            strip_manager.colorWipe(strip, firstNode, highlightColor)
            strip_manager.colorWipe(strip, lastNode, highlightColor)
            strip_manager.colorWipe(strip, healthNodes, color)
        else:
            strip_manager.colorWipe(strip, character['nodes'], color)

    declaredPixels = declaredPixels + character['nodes']
    uniquePlayerPixels = (list(set(declaredPixels)))
    
    # TODO add ability to set the rest of the table's color
    offColor = strip_manager.colorFromRgba(20, 20, 20, 1)
    # strip_manager.inverseColorWipe(strip, uniquePlayerPixels, offColor)

def highlight_nodes(strip, nodes, color):
    print("highlighting nodes")
    solidColorValues = parse_color_string(color)
    strip_manager.colorWipe(strip, nodes, strip_manager.colorFromRgba(*solidColorValues))


def run():
    parser = argparse.ArgumentParser("LED_Strip")
    parser.add_argument("--clear", help="Clear all active effect", action='store_true')
    parser.add_argument("--effect", help="JSON encoded effect data")
    parser.add_argument("--characters", help="JSON encoded player inititiative data")
    parser.add_argument("--highlight", help="JSON encoded player inititiative data")
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

    if (args.highlight):
        highlight = parse_argument(args.highlight)
        highlight_nodes(strip, highlight['nodes'], highlight['color'])

    print("hello world")

run()