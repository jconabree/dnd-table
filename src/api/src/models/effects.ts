import storage from '../storage';
import { EffectData, EffectList } from '~/types/interface';

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

    const savedItem = model.saveItem<EffectData>(data);

    return savedItem;
}