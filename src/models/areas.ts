import { AreaData, AreaList } from '~/types/interface';

class AreaManager {
    #apiBase = '/api/areas';

    async list(): Promise<AreaList['items']> {
        const response = await fetch(`${this.#apiBase}/list`);
        console.log('fetch response', response);
        const data = await response.json();

        return data;
    }

    async save(area: AreaData) {
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