import { useCallback, useEffect, useState } from 'react';
import { TableConfiguration } from '~/types/interface';
import configModel from '~/models/config';

export type ConfiguratorContextValues = {
    isSelectMode: boolean;
    setIsSelectMode: (value: boolean) => void;
    selection: number[];
    setSelection: (value: number[]) => void;
    config?: TableConfiguration;
    saveConfig: (config: TableConfiguration) => Promise<Response>;
};

export default (): ConfiguratorContextValues => {
    const [isSelectMode, setIsSelectMode] = useState<boolean>(false);
    const [selection, setSelection] = useState<number[]>([]);
    const [config, setConfig] = useState<TableConfiguration>();

    const loadConfig = useCallback(async () => {
        const configuration = await configModel.get();
        setConfig(configuration);
    }, [])

    const saveConfig = useCallback(async (updatedConfig: TableConfiguration) => {
        const saveResponse = await configModel.save(updatedConfig);
        console.log('saving config', saveResponse);
        setConfig(updatedConfig);

        return saveResponse;
    }, []);

    useEffect(() => {
        loadConfig();
    }, []);

    return {
        isSelectMode,
        setIsSelectMode,
        selection,
        setSelection,
        config,
        saveConfig
    };
}