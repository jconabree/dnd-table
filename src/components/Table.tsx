import { useCallback, useEffect, useRef, useState } from 'react';
import { useConfiguratorContext } from '~/context/ConfiguratorProvider';
import TableCanvas from '~/utils/TableCanvas';

export function Table() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const tableCanvas = useRef<TableCanvas>();
    const selectionSetByCanvas = useRef<boolean>(true);
    const [isReady, setIsReady] = useState<boolean>(false);
    const { isSelectMode, setSelection, selection, config } = useConfiguratorContext();

    useEffect(() => {
        setIsReady(true);
    }, []);

    useEffect(() => {
        if (!isReady || !config) {
            return;
        }

        tableCanvas.current = new TableCanvas(canvasRef.current!);
        tableCanvas.current.init(config.nodeCount);
    }, [isReady, config]);

    useEffect(() => {
        if (!tableCanvas.current) {
            return;
        }

        if (!isSelectMode) {
            tableCanvas.current.setOnSelect(null);
            setSelection([]);

            return;
        }

        tableCanvas.current.setOnSelect((ids) => {
            selectionSetByCanvas.current = true;
            setSelection(ids);
            console.log('selected', ids);
        })
    }, [isSelectMode]);

    useEffect(() => {
        if (!isReady || !tableCanvas.current) {
            return;
        }

        if (!selectionSetByCanvas.current) {
            tableCanvas.current.setSelection(selection!);
        }
        selectionSetByCanvas.current = false;
    }, [selection, isReady]);

    useEffect(() => {
        if (!tableCanvas.current || !config) {
            return;
        }

        tableCanvas.current.setNodeCount(config.nodeCount);
    }, [config?.nodeCount])

    return (
        <>
            <canvas ref={canvasRef} className="w-full h-full" />
        </>
    )
}