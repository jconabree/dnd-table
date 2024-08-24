import { spawn } from 'node:child_process';
import { CharacterArgumentData, EffectArgumentData, NodesArgumentData } from './types/interface';
import path from 'node:path';

type PythonArgumentData = {
    [key: string]: string|null
};

class LEDStrip {
    #pathToPythonScript: string;
    #silent: boolean = false;

    constructor() {
        this.#pathToPythonScript = path.join(__dirname, '..', '..', 'python', 'led.py')
    }

    detachedExec(data: PythonArgumentData) {
        const subprocess = spawn('python3',
            [
                this.#pathToPythonScript,
                ...Object.entries<string|null>(data).reduce((argList: string[], [key, value]) => {
                    argList.push(`--${key}`);
                    if (value !== null) {
                        argList.push(value);
                    }

                    return argList;
                }, [])
            ],
            {
                detached: true,
                stdio: this.#silent ? 'ignore' : 'inherit',
            }
        );
          
        if (this.#silent) {
            subprocess.unref(); 
        }
    }

    turnOnEffect(effectData: EffectArgumentData) {
        this.detachedExec({
            'effect': JSON.stringify(effectData)
        })
    }

    updateInitiative(characters: CharacterArgumentData[]) {
        this.detachedExec({
            'characters': JSON.stringify(characters)
        });
    }

    highlightNodes(nodes: NodesArgumentData) {
        this.detachedExec({
            'highlight': JSON.stringify(nodes),
        })
    }

    clearAll() {
        this.detachedExec({
            'clear': null
        })
    }
}

export default new LEDStrip();