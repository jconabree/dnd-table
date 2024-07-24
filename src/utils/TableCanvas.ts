type coord = {
    x: number;
    y: number;
}

export default class TableCanvas {
    #canvas: HTMLCanvasElement;
    realTableWidth: number = 48;
    realTableHeight = 72;
    tableLineWidth = 15;

    constructor(canvas: HTMLCanvasElement) {
        this.#canvas = canvas;
    }

    init(): void {

        globalThis.addEventListener('resize', () => {
            this.resize();
            this.draw();
        });
        this.resize();
        this.draw();
    }

    resize(): void {
        this.#canvas.height = this.#canvas.offsetHeight;
        this.#canvas.width = this.#canvas.offsetWidth;
    }

    getCanvasCoords(): { width: number, height: number, center: coord } {
        const height = this.#canvas.offsetHeight;
        const width = this.#canvas.offsetWidth;
        const center = {
            x: width / 2,
            y: height / 2
        };

        return {
            width,
            height,
            center
        };
    }

    getTableCoords(): {
        topLeft: coord;
        topRight: coord;
        bottomLeft: coord;
        bottomRight: coord;
        width: number;
        height: number;
    } {
        const canvasCoords = this.getCanvasCoords();
        const height = canvasCoords.height * .8;
        const width = height * (this.realTableWidth / this.realTableHeight);
        const leftX = canvasCoords.center.x - width / 2;
        const topY = canvasCoords.center.y - height / 2;

        return {
            width,
            height,
            topLeft: {
                x: leftX,
                y: topY
            },
            topRight: {
                x: leftX + width,
                y: topY
            },
            bottomLeft: {
                x: leftX,
                y: topY + height
            },
            bottomRight: {
                x: leftX + width,
                y: topY + height
            }
        }
        
    }

    draw(): void {
        this.drawTable();
        this.drawLEDChunks();
    }

    clear(): void {
        const ctx = this.#canvas.getContext('2d')!;
        ctx.clearRect(0, 0, this.#canvas.width, this.#canvas.height);
    }

    drawTable(): void {
        const ctx = this.#canvas.getContext('2d')!;
        this.clear();
        const tableCoords = this.getTableCoords();
        ctx.beginPath();
        ctx.strokeStyle = 'green';
        ctx.lineWidth = this.tableLineWidth;
        ctx.strokeRect(
            tableCoords.topLeft.x + (this.tableLineWidth/2),
            tableCoords.topLeft.y + (this.tableLineWidth/2),
            tableCoords.width,
            tableCoords.height,
        );

        console.log(tableCoords);
    }

    /**
     * Convert inches to number of LED nodes
     * 960 LEDs for 10m and 6 LEDs per Node
     *
     * @param length 
     */
    getNodeCountForLength(length: number) {
        return Math.floor((length * 0.0254 * 96) / 6);
    }

    drawLEDChunks(): void {
        const ctx = this.#canvas.getContext('2d')!;
        const tableCoords = this.getTableCoords();

        const paths = [
            {
                start: tableCoords.bottomLeft.x,
                end: tableCoords.bottomRight.x,
                direction: 'x',
                static: tableCoords.bottomLeft.y,
                numberOfNodes: this.getNodeCountForLength(this.realTableWidth)
            },
            {
                start: tableCoords.bottomRight.y,
                end: tableCoords.topRight.y,
                direction: 'y',
                static: tableCoords.bottomRight.x,
                numberOfNodes: this.getNodeCountForLength(this.realTableHeight)
            },
            {
                start: tableCoords.topRight.x,
                end: tableCoords.topLeft.x,
                direction: 'x',
                static: tableCoords.topRight.y,
                numberOfNodes: this.getNodeCountForLength(this.realTableWidth)
            },
            {
                start: tableCoords.topLeft.y,
                end: tableCoords.bottomLeft.y,
                direction: 'y',
                static: tableCoords.topLeft.x,
                numberOfNodes: this.getNodeCountForLength(this.realTableHeight)
            }
        ]

        paths.forEach((path) => {
            const isLtr = path.start < path.end;
            let currentCoord = isLtr ? path.start + this.tableLineWidth : path.start - this.tableLineWidth;
            let nodeCount = 0;
            const totalLength = Math.abs(isLtr ? path.end - path.start : path.end - path.start);
            const width = (totalLength - this.tableLineWidth) / path.numberOfNodes;
            while (nodeCount < path.numberOfNodes) {
                ctx.beginPath();
                ctx.strokeStyle = '#333';
                ctx.lineWidth = 3;
                ctx.strokeRect(
                    path.direction === 'x' ? currentCoord : path.static,
                    path.direction === 'y' ? currentCoord : path.static,
                    path.direction === 'x' ? width : 50 * (isLtr ? -1 : 1),
                    path.direction === 'y' ? width : 50 * (isLtr ? 1 : -1),
                );

                if (isLtr) {
                    currentCoord += width;
                } else {
                    currentCoord -= width;
                }

                // TODO push node into a stored array for eventing

                nodeCount++;
            }
        })
    }
};