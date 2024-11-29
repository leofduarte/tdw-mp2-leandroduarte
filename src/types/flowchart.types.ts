type Element = {
    id: string;
    type?: string;
    data: { label: string };
    position: { x: number; y: number };
};

type Edge = {
    id: string;
    source: string;
    target: string;
    animated?: boolean;
};

export type FlowchartElement = Element | Edge;