type AreaID = string;

export type AreaData = {
    id?: AreaID;
    name: string;
    type: 'dndplayer'|'player'|'basic';
    nodes: number[]
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