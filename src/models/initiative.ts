import { CharacterArgumentData } from "~/types/interface";

class InitiativeModel {
    #apiBase: string = '/api/initiative';

    async pushPlayerStates(characters: CharacterArgumentData[]) {
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
}

export default new InitiativeModel();