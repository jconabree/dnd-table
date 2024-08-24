import { NodesArgumentData } from '~/types/interface';
import { DEFAULT_COLOR } from '~/constants/colors';

class NodesManager {
    async highlight(nodeData: NodesArgumentData) {
        const data = {
            ...nodeData
        };

        if (!data.color) {
            data.color = DEFAULT_COLOR;
        }

        const response = await fetch(
            '/api/nodes/highlight',
            {
                method: 'POST',
                body: JSON.stringify(nodeData),
                headers: new Headers({
                    'content-type': 'application/json'
                })
            }
        );
        const responseData = await response.json();

        return responseData;
    }

    async clearAll() {
        const response = await fetch(
            `/clear`,
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

export default new NodesManager();