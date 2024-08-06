import { EffectData, EffectList } from '~/types/interface';

class EffectManager {
    #apiBase = '/api/effects';

    async list(): Promise<EffectList['items']> {
        const response = await fetch(`${this.#apiBase}/list`);
        const data = await response.json();

        return data;
    }

    async save(effect: EffectData) {
        const response = await fetch(
            `${this.#apiBase}/effect`,
            {
                method: 'POST',
                body: JSON.stringify({
                    effect
                }),
                headers: new Headers({
                    'content-type': 'application/json'
                })
            }
        );
        const data = await response.json();

        return data;
    }

    async changeActiveEffect(id: EffectData['id'], isActive: boolean) {
        const response = await fetch(
            `${this.#apiBase}/toggle`,
            {
                method: 'POST',
                body: JSON.stringify({
                    effectId: id!,
                    active: isActive
                }),
                headers: new Headers({
                    'content-type': 'application/json'
                })
            }
        );
        const data = await response.json();

        return data;
    }

    async clearAll() {
        const response = await fetch(
            `${this.#apiBase}/clear`,
            {
                method: 'POST',
                body: '{}',
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