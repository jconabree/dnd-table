import storage from '../storage';
import { AreaData, AreaList } from '~/types/interface';

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