import { TableConfiguration } from "~/types/interface";

type coord = {
    x: number;
    y: number;
}

type LEDID = number;

type LEDChunk = coord & {
    id: LEDID;
    width: number;
    height: number;
}

type OnSelectCallback = (ids: LEDID[]) => void

type CanvasCoords = {
    width: number;
    height: number;
    center: coord;
};

type TableCoords = {
    topLeft: coord;
    topRight: coord;
    bottomLeft: coord;
    bottomRight: coord;
    width: number;
    height: number;
};

export default class TableCanvas {
    #canvas: HTMLCanvasElement;
    canvasCoords: CanvasCoords|null = null;
    tableCoords: TableCoords|null = null;
    realTableWidth: number = 48;
    realTableHeight = 72;
    tableLineWidth = 15;
    nodeCounts = {
        bottom: 0,
        right: 0,
        top: 0,
        left: 0
    };
    ledChunks: LEDChunk[] = [];
    selectedRangeStart: LEDID|null = null;
    selectedRangeEnd: LEDID|null = null;
    hoveredChunk: LEDID|null = null;
    mouseIsDown: boolean = false;
    onSelectCallback: OnSelectCallback|null = null;

    constructor(canvas: HTMLCanvasElement) {
        this.#canvas = canvas;
    }

    init(nodeCountConfig: TableConfiguration['nodeCount']): void {
        globalThis.addEventListener('resize', () => {
            this.resize();
            this.draw();
        });
        this.setNodeCount(nodeCountConfig, false);
        this.resize();
        this.bindChunkHover();
        this.draw();
    }

    setOnSelect(callback: OnSelectCallback|null): void {
        this.onSelectCallback = callback;
    }

    setSelection(ids: LEDID[]): void {
        if (!ids.length) {
            this.selectedRangeStart = null;
            this.selectedRangeEnd = null;
        } else {
            this.selectedRangeStart = ids[0];
            this.selectedRangeEnd = ids[ids.length - 1];
        }

        this.draw();
    }

    setNodeCount(nodeCountConfig: TableConfiguration['nodeCount'], redraw = true) {
        const { bottom, right, top, left } = nodeCountConfig || {};
        const { bottom: fallbackBottom, right: fallbackRight, top: fallbackTop, left: fallbackLeft } = this.nodeCounts;
        this.nodeCounts = {
            bottom: bottom ?? fallbackBottom,
            right: right ?? fallbackRight,
            top: top ?? fallbackTop,
            left: left ?? fallbackLeft,
        };

        if (redraw) {
            this.calculateLEDChunkPositions();
            this.draw();
        }
    }

    resize(): void {
        this.#canvas.height = this.#canvas.offsetHeight;
        this.#canvas.width = this.#canvas.offsetWidth;

        this.calculateCanvasCoords();
        this.calculateTableCoords();
        this.calculateLEDChunkPositions();
    }

    calculateCanvasCoords(): void {
        const height = this.#canvas.offsetHeight;
        const width = this.#canvas.offsetWidth;
        const center = {
            x: width / 2,
            y: height / 2
        };

        this.canvasCoords = {
            width,
            height,
            center
        };
    }

    calculateTableCoords(): void {
        const canvasCoords = this.getCanvasCoords();
        const height = canvasCoords.height * .8;
        const width = height * (this.realTableWidth / this.realTableHeight);
        const leftX = canvasCoords.center.x - width / 2;
        const topY = canvasCoords.center.y - height / 2;

        this.tableCoords = {
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

    calculateLEDChunkPositions(): void {
        const tableCoords = this.getTableCoords();
        this.ledChunks = [];

        const paths = [
            { // Bottom Line
                start: tableCoords.bottomLeft.x + this.tableLineWidth,
                end: tableCoords.bottomRight.x,
                direction: 'x',
                static: tableCoords.bottomLeft.y,
                numberOfNodes: this.nodeCounts.bottom ?? 0
            },
            { // Right Line
                start: tableCoords.bottomRight.y,
                end: tableCoords.topRight.y + this.tableLineWidth,
                direction: 'y',
                static: tableCoords.bottomRight.x,
                numberOfNodes: this.nodeCounts.right ?? 0
            },
            { // Top Line
                start: tableCoords.topRight.x,
                end: tableCoords.topLeft.x + this.tableLineWidth,
                direction: 'x',
                static: tableCoords.topRight.y + this.tableLineWidth,
                numberOfNodes: this.nodeCounts.top ?? 0
            },
            { // Left Line
                start: tableCoords.topLeft.y + this.tableLineWidth,
                end: tableCoords.bottomLeft.y,
                direction: 'y',
                static: tableCoords.topLeft.x + this.tableLineWidth,
                numberOfNodes: this.nodeCounts.left ?? 0
            }
        ]

        let id = 1;
        paths.forEach((path) => {
            if (!path.numberOfNodes) {
                return;
            }

            const isLtr = path.start < path.end;
            let nodeCount = 0;
            const totalLength = Math.abs(path.end - path.start);
            const width = totalLength / path.numberOfNodes;
            let currentCoord = isLtr ? path.start : path.start - width;
            while (nodeCount < path.numberOfNodes) {
                const xPos = path.direction === 'x' ? currentCoord : path.static;
                const yPos = path.direction === 'y' ? currentCoord : path.static;
                const rectWidth = path.direction === 'x' ? width : this.tableLineWidth * (isLtr ? -1 : 1);
                const rectHeight = path.direction === 'y' ? width : this.tableLineWidth * (isLtr ? 1 : -1);

                this.ledChunks.push({
                    id,
                    x: xPos,
                    y: yPos,
                    width: rectWidth,
                    height: rectHeight
                });

                if (isLtr) {
                    currentCoord += width;
                } else {
                    currentCoord -= width;
                }

                nodeCount++;
                id++;
            }
        })
    }

    getCanvasCoords(): CanvasCoords {
        return this.canvasCoords!;
    }

    getTableCoords(): TableCoords {
        return this.tableCoords!;
    }

    draw(): void {
        this.clear();
        this.drawTable();
        this.drawLEDChunks();
    }

    clear(): void {
        const ctx = this.#canvas.getContext('2d')!;
        ctx.clearRect(0, 0, this.#canvas.offsetWidth, this.#canvas.offsetHeight);
    }

    drawTable(): void {
        const ctx = this.#canvas.getContext('2d')!;
        const tableCoords = this.getTableCoords();
        ctx.beginPath();
        ctx.strokeStyle = '#baa58a';
        ctx.lineWidth = this.tableLineWidth;
        ctx.lineCap = 'butt';
        ctx.strokeRect(
            tableCoords.topLeft.x + (this.tableLineWidth/2),
            tableCoords.topLeft.y + (this.tableLineWidth/2),
            tableCoords.width,
            tableCoords.height,
        );
    }

    /**
     * Convert inches to number of LED nodes
     * 960 LEDs for 10m and 6 LEDs per Node
     *
     * @param length 
     */
    getNodeCountForLength(length: number) {
        return (length * 0.0254 * 96) / 6;
    }

    bindChunkHover(): void {
        this.#canvas.addEventListener('mousedown', () => {
            if (!this.onSelectCallback) {
                return;
            }

            this.mouseIsDown = true;
            this.selectedRangeStart = null;
            this.selectedRangeEnd = null;
        });
        this.#canvas.addEventListener('mouseup', () => {
            this.mouseIsDown = false;
            if (typeof this.onSelectCallback === 'function') {
                let rangeTriggered = 0;
                const selectedIds = this.ledChunks.filter((chunk) => {
                    if (chunk.id === this.selectedRangeEnd || chunk.id === this.selectedRangeStart) {
                        rangeTriggered++;
                    }

                    const isInRange = Boolean(rangeTriggered);

                    if (rangeTriggered === 2) {
                        rangeTriggered = 0;
                    }

                    return isInRange;
                }).map((chunk) => chunk.id)

                this.onSelectCallback(selectedIds);
            }
        });
        this.#canvas.addEventListener('mousemove', (event) => {
            const mouseX = event.pageX;
            const mouseY = event.pageY;

            const hasMatch = this.ledChunks.some((chunk) => {
                const isWidthInverse = chunk.width < 0;
                const isHeightInverse = chunk.height < 0;
                const isWithinX = (!isWidthInverse && mouseX > chunk.x && mouseX < chunk.x + chunk.width) ||
                (isWidthInverse && mouseX < chunk.x && mouseX > chunk.x + chunk.width);
                const isWithinY = (!isHeightInverse && mouseY > chunk.y && mouseY < chunk.y + chunk.height) ||
                (isHeightInverse && mouseY < chunk.y && mouseY > chunk.y + chunk.height);
                
                if (isWithinX && isWithinY) {
                    this.hoveredChunk = chunk.id;
                    if (this.mouseIsDown) {
                        if (!this.selectedRangeStart) {
                            this.selectedRangeStart = chunk.id;
                        }

                        this.selectedRangeEnd = chunk.id;
                    }

                    return true
                }

                return false;
            });

            if (!hasMatch) {
                this.hoveredChunk = null;
            }

            this.draw();
        })
    }

    getChunkColor(chunk: LEDChunk): string {
        return chunk.id === this.hoveredChunk ? '#111' : '#555';
    }
 
    drawLEDChunks(): void {
        const ctx = this.#canvas.getContext('2d')!;
        let rangeTriggered = 0;
        this.ledChunks.forEach((chunk) => {
            ctx.beginPath();
            const isRangeMinMax = this.selectedRangeStart === chunk.id || this.selectedRangeEnd === chunk.id;
            if (isRangeMinMax) {
                rangeTriggered++;
            }
            ctx.strokeStyle = rangeTriggered ? '#000' : this.getChunkColor(chunk);
            ctx.lineWidth = rangeTriggered ? 3 : 1;
            ctx.strokeRect(
                chunk.x,
                chunk.y,
                chunk.width,
                chunk.height,
            );

            if (rangeTriggered === 2 || this.selectedRangeStart === this.selectedRangeEnd) {
                rangeTriggered = 0;
            }
        })
    }
};