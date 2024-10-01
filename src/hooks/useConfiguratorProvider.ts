import { useCallback, useEffect, useState } from 'react';
import { TableConfiguration } from '~/types/interface';
import configModel from '~/models/config';

export type ConfiguratorContextValues = {
    isSelectMode: boolean;
    setIsSelectMode: (value: boolean) => void;
    segments?: number[];
    setSegments: (segmentIds: number[]) => void;
    config?: TableConfiguration;
    saveConfig: (config: TableConfiguration) => Promise<Response>;
};

export default (): ConfiguratorContextValues => {
    const [isSelectMode, setIsSelectMode] = useState<boolean>(false);
    const [segments, setSegments] = useState<number[]>();
    const [config, setConfig] = useState<TableConfiguration>();

    const loadConfig = useCallback(async () => {
        const configuration = await configModel.get();
        setConfig(configuration);
    }, [])

    const saveConfig = useCallback(async (updatedConfig: TableConfiguration) => {
        const saveResponse = await configModel.save(updatedConfig);
        setConfig(updatedConfig);

        return saveResponse;
    }, []);

    useEffect(() => {
        loadConfig();
    }, []);

    return {
        isSelectMode,
        setIsSelectMode,
        segments,
        setSegments,
        config,
        saveConfig
    };
}