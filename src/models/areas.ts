import { AreaData, AreaList } from '~/types/interface';
import nodesManager from './nodes';

class AreaManager {
    #apiBase = '/api/areas';
    #cache: Promise<AreaList['items']>|null = null;

    async list(): Promise<AreaList['items']> {
        if (!this.#cache) {
            const response = await fetch(this.#apiBase);
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

    async delete(areaId: AreaData['id']) {
        this.#cache = null;
        const response = await fetch(
            `${this.#apiBase}/area/delete`,
            {
                method: 'POST',
                body: JSON.stringify({
                    areaId
                }),
                headers: new Headers({
                    'content-type': 'application/json'
                })
            }
        );
        const data = await response.json();

        return data;
    }

    async show(area: AreaData) {
        const { nodes, highlightColor: color } = area;
        const data = await nodesManager.highlight({
            nodes,
            color
        });

        return data;
    }

    async hide() {
        await nodesManager.clearAll();
    }
}

export default new AreaManager();