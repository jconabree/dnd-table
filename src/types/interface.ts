type AreaID = string;

export type AreaData = {
    id?: AreaID;
    name: string;
    type: 'dndplayer'|'player'|'basic';
    nodes: number[];
    highlightColor?: ColorValue;
    savedAt?: number;
    createdAt?: number;
};

export type AreaList = {
    items: AreaData[]
}

type ColorValue = string;

type GradientValue = {
    [percent: number]: ColorValue;
}

type FillValue = {
    stepDelay: number;
    color: ColorValue;
}

export type Effect = {
    type: 'solid'|'fill'|'gradient';
    value: ColorValue|FillValue|GradientValue;
    duration?: number; // in seconds
    parallel?: boolean; // execute in parallel with others. By default it will execute when the previous one finishes
    delay?: number; // Used with parallel
    repeat?: boolean|number|'infinite';
    repeatDirection?: 'forward'|'reverse';
}

export type EffectData = {
    id?: string;
    name: string;
    effects: Effect[];
    areas: AreaID[]
    savedAt?: number;
    createdAt?: number;
};

export type EffectList = {
    items: EffectData[]
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
    nodes: AreaData['nodes'];
    isCurrent: boolean;
    currentHealth: number|null;
    maxHealth: number|null;
}

export type NodesArgumentData = {
    nodes: AreaData['nodes'];
    color?: ColorValue;
}

export type TableConfiguration = {
    nodeCount: {
        bottom: number
        right: number,
        top: number,
        left: number
    }
}