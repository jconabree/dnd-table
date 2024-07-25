import { useCallback, useEffect, useRef, useState } from 'react';

import TableCanvas from '~/utils/TableCanvas';

export function Table() {
    const canvasRef = useRef<HTMLCanvasElement>();
    const tableCanvas = useRef<TableCanvas>();
    const [isReady, setIsReady] = useState<boolean>(false);
    const [isSelectMode, setIsSelectMode] = useState<boolean>(false);

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

            return;
        }

        tableCanvas.current.setOnSelect((ids) => {
            console.log('selected', ids);
        })
    }, [isSelectMode]);

    return (
        <>
            <button
                className="absolute top-3 left-3 btn"
                onClick={() => {
                    setIsSelectMode((current) => !current);
                }}
            >Selection Mode: {isSelectMode ? 'true' : 'false'}</button>
            <canvas ref={canvasRef} className="w-full h-full" />
        </>
    )
}