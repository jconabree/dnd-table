import { useState } from 'react';

export type ConfiguratorContextValues = {
    isSelectMode: boolean;
    setIsSelectMode: (value: boolean) => void
    selection: number[];
    setSelection: (value: number[]) => void
};

export default () => {
    const [isSelectMode, setIsSelectMode] = useState<boolean>(false);
    const [selection, setSelection] = useState<number[]>([]);

    return {
        isSelectMode,
        setIsSelectMode,
        selection,
        setSelection
    };
}