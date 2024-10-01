import { AreaData, AreaList, Segment, SegmentList } from '~/types/interface';

class AreaManager {
    #apiBase = '/api/areas';
    #cache: Promise<AreaList['items']>|null = null;
    #segmentCache: Promise<SegmentList['items']>|null = null;

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

    async getAllSegments() {
        if (!this.#segmentCache) {
            const response = await fetch(`${this.#apiBase}/segments`);
            console.log('fetch response', response);
            this.#segmentCache = await response.json();
        }

        return this.#segmentCache!;
    }
}

export default new AreaManager();