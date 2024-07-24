import { useEffect, useRef, useState } from 'react';

import TableCanvas from '~/utils/TableCanvas';

export function Table() {
    const canvasRef = useRef<HTMLCanvasElement>();
    const [isReady, setIsReady] = useState<boolean>(false);

    useEffect(() => {
        setIsReady(true);
    }, []);

    useEffect(() => {
        if (!isReady) {
            return;
        }

        const tableCanvas = new TableCanvas(canvasRef.current!);
        tableCanvas.init();
    }, [isReady]);

    return (
        <canvas ref={canvasRef} className="w-full h-full" />
    )
}