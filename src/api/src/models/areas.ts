import storage from '../storage';
import { AreaData, AreaList } from '~/types/interface';
import { getConfig } from './configurations';

const loadData = () => {
    return storage.load<AreaList>('areas');
}

export const getAllAreas = () => {
    const savedData = loadData();
    const items = savedData?.data.items ?? [];

    return items;
}

export const saveArea = (areaData: AreaData) => {
    const areaModel = loadData();

    const savedItem = areaModel.saveItem<AreaData>(areaData);

    return savedItem;
}

export const deleteArea = (areaId: AreaData['id']) => {
    const areaModel = loadData();
    areaModel.deleteItem(areaId);
}

interface WLEDState {
    on: boolean;
    bri: number;
    seg: {
        id: number;
        start: number;
        stop: number;
        len: number;
        n?: string;
        col: number[][];
    
        [x: string | number | symbol]: unknown;
    }[];
    [x: string | number | symbol]: unknown;
}
export const getAllSegments = async () => {
    const config = getConfig();
    const address = config.wledAddress;

    const response = await fetch(
        `http://${address}/json/state`,
        {
            headers: new Headers({
                'content-type': 'application/json'
            })
        }
    );

    const data: WLEDState = await response.json()
    
    return data.seg?.map((segment) => {
        return {
            id: segment.id,
            start: segment.start,
            stop: segment.stop,
            length: segment.len,
            name: segment.n
        };
    });
}