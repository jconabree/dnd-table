import storage from '../storage';
import { EffectArgumentData, EffectData, EffectList } from '~/types/interface';
import ledStrip from '../ledStrip';
import { getAllAreas } from './areas';

const loadData = () => {
    return storage.load<EffectList>('effects');
}

export const getAllEffects = () => {
    const savedData = loadData();
    const items = savedData?.data.items ?? [];

    return items;
}

export const saveEffect = (data: EffectData) => {
    const model = loadData();

    console.log('effect being saved', data);
    const savedItem = model.saveItem<EffectData>(data);

    return savedItem;
}

export const changeActive = (effectId: EffectData['id']|undefined|null, active: boolean): boolean => {
    if (!active || !effectId) {
        // TODO eventually be smarter and clear only specified effect and fallback to other active effect
        ledStrip.clearEffects();

        return true;
    }

    const effects = getAllEffects();
    const areas = getAllAreas();

    const specifiedEffect = effects.find(({ id }) => id === effectId);

    if (!specifiedEffect) {
        return false;
    }

    try {
        const nodesObject = specifiedEffect.areas.reduce((areaNodes, areaId) => {
            const area = areas.find(({ id }) => id === areaId);
            if (!area) {
                return areaNodes;
            }
    
            return {
                ...areaNodes,
                ...Object.fromEntries(area.nodes.map((node) => [node, true]))
            };
        }, {})

        const sortedNodes = Object.keys(nodesObject).map((nodeKey) => Number.parseInt(nodeKey)).sort((a, b) => a-b)
    
        const effectData: EffectArgumentData = {
            effects: specifiedEffect.effects,
            nodes: sortedNodes
        }
    
        ledStrip.turnOnEffect(effectData);
    } catch(error) {
        console.error(error)
        return false;
    }

    return true;
}