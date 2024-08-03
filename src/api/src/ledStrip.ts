import { spawn } from 'node:child_process';
import { EffectArgumentData } from './types/interface';
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

    asyncExec(data: PythonArgumentData) {
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
        this.asyncExec({
            'clear': null, // TODO remove this
            'effect': JSON.stringify(effectData)
        })
    }

    clearEffects() {
        this.asyncExec({
            'clear': null
        })
    }
}

export default new LEDStrip();