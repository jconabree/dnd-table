export type AreaData = {
    id?: string;
    name: string;
    type: 'dndplayer'|'player'|'basic';
    nodes: number[]
    savedAt?: number;
    createdAt?: number;
};

export type AreaList = {
    items: AreaData[]
}