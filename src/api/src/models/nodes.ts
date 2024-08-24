import { NodesArgumentData } from '~/types/interface';
import ledStrip from '../ledStrip';

export const clearAll = () => {
    ledStrip.clearAll();
};

export const highlightNodes = (nodes: number[], color: string): boolean => {
    try {    
        const nodesData: NodesArgumentData = {
            nodes: nodes,
            color
        }
    
        ledStrip.highlightNodes(nodesData);
    } catch(error) {
        console.error(error)
        return false;
    }

    return true;
}