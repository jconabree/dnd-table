import { useCallback, useEffect, useRef, useState } from 'react';
import { useConfiguratorContext } from '~/context/ConfiguratorProvider';
import TableCanvas from '~/utils/TableCanvas';

export function Table() {
    const canvasRef = useRef<HTMLCanvasElement>();
    const tableCanvas = useRef<TableCanvas>();
    const selectionSetByCanvas = useRef<boolean>(true);
    const [isReady, setIsReady] = useState<boolean>(false);
    const { isSelectMode, setSelection, selection } = useConfiguratorContext();

    useEffect(() => {
        setIsReady(true);
    }, []);

    useEffect(() => {
        if (!isReady) {
            return;
        }

        tableCanvas.current = new TableCanvas(canvasRef.current!);
        tableCanvas.current.init();
    }, [isReady]);

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
        if (!selectionSetByCanvas.current) {
            tableCanvas.current!.setSelection(selection!);
        }
        selectionSetByCanvas.current = false;
    }, [selection]);

    return (
        <>
            <canvas ref={canvasRef} className="w-full h-full" />
        </>
    )
}