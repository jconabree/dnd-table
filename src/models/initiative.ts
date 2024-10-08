import { CharacterArgumentData } from "~/types/interface";

class InitiativeModel {
    #apiBase: string = '/api/initiative';

    async pushCharacterStates(characters: CharacterArgumentData[]) {
        const response = await fetch(
            `${this.#apiBase}/states`,
            {
                method: 'POST',
                body: JSON.stringify({
                    characters
                }),
                headers: new Headers({
                    'content-type': 'application/json'
                })
            }
        );
        const data = await response.json();

        return data;
    }

    async stopStates() {
        const response = await fetch(
            `${this.#apiBase}/stop`,
            {
                method: 'POST',
                headers: new Headers({
                    'content-type': 'application/json'
                })
            }
        );
        const data = await response.json();

        return data;
    }
}

export default new InitiativeModel();