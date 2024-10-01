type AreaID = string;

export type Segment = {
    id: number;
    start: number;
    stop: number;
    length: number;
    name: string;
}

export type SegmentList = {
    items: Segment[]
};

export type AreaData = {
    id?: AreaID;
    name: string;
    segment: Segment['id'];
    segmentPre?: Segment['id'];
    segmentPost?: Segment['id'];
    savedAt?: number;
    createdAt?: number;
};

export type AreaList = {
    items: AreaData[]
}

export type Character = {
    id: string;
    nickname: string;
    area: AreaData;
    initiative: number;
    showHealth: boolean;
    health: {
        max: number;
        current: number;
    }
}

export type CharacterState = Character & {
    isCurrent: boolean;
}

export type CharacterArgumentData = {
    area: AreaData;
    isCurrent: boolean;
    currentHealth: number|null;
    maxHealth: number|null;
}

export type TableConfiguration = {
    nodeCount: {
        bottom: number
        right: number,
        top: number,
        left: number
    }
    wledAddress: string;
}