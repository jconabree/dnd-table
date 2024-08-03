import { AreaData, AreaList } from '~/types/interface';

class AreaManager {
    #apiBase = '/api/areas';
    #cache: Promise<AreaList['items']>|null = null;

    async list(): Promise<AreaList['items']> {
        if (!this.#cache) {
            const response = await fetch(`${this.#apiBase}/list`);
            console.log('fetch response', response);
            this.#cache = await response.json();
        }

        return this.#cache!;
    }

    async save(area: AreaData) {
        this.#cache = null;
        const response = await fetch(
            `${this.#apiBase}/area`,
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

export default new AreaManager();