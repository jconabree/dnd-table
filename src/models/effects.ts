import { EffectData, EffectList } from '~/types/interface';

class EffectManager {
    #apiBase = '/api/effects';

    async list(): Promise<EffectList['items']> {
        const response = await fetch(`${this.#apiBase}/list`);
        console.log('fetch response', response);
        const data = await response.json();

        return data;
    }

    async save(area: EffectData) {
        const response = await fetch(
            `${this.#apiBase}/effect`,
            {
                method: 'POST',
                body: JSON.stringify({
                    area
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

export default new EffectManager();