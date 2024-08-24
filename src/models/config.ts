import { TableConfiguration } from '~/types/interface';

class ConfigManager {
    #apiBase = '/api/config';
    #cache: Promise<TableConfiguration>|null = null;

    async get(): Promise<TableConfiguration> {
        if (!this.#cache) {
            const response = await fetch(this.#apiBase);
            console.log('fetch response', response);
            this.#cache = await response.json();
        }

        return this.#cache!;
    }

    async save(config: Partial<TableConfiguration>) {
        this.#cache = null;
        const response = await fetch(
            this.#apiBase,
            {
                method: 'POST',
                body: JSON.stringify(config),
                headers: new Headers({
                    'content-type': 'application/json'
                })
            }
        );
        const data = await response.json();

        return data;
    }
}

export default new ConfigManager();