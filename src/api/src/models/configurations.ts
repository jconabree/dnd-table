import { TableConfiguration } from "~/types/interface";
import storage from '../storage';

const loadData = () => {
    return storage.load<TableConfiguration>('config');
}

export const getConfig = () => {
    const data = loadData().data;

    return data;
};

export const saveConfig = (configurations: Partial<TableConfiguration>): boolean => {
    const config = loadData();
    try {
        config.updateData(configurations);
    } catch {
        return false;
    }

    return true;
};