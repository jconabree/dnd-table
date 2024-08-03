import argparse
import json

def clear_strip():
    # Read pid file and kill running process
    print("clear the full strip")

def parse_effect(raw):
    return json.loads(raw)

def show_effect(effect):
    print("show effect based on config")
    print(effect)

def run():
    parser = argparse.ArgumentParser("LED_Strip")
    parser.add_argument("--clear", help="Clear all active effect", action='store_true')
    parser.add_argument("--effect", help="JSON encoded effect data")
    args = parser.parse_args()

    if (args.clear):
        clear_strip()
    
    if (args.effect):
        effect = parse_effect(args.effect)
        show_effect(effect)

    print("hello world")

run()