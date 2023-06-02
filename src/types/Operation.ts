import type { Coordinate } from "./Coordinate";

export type OperationAction = (crd: Coordinate) => number;
export type AxisOperation = {
    name: string,
    action: OperationAction,
}

export type Operation = {
    x: AxisOperation | null,
    y: AxisOperation | null,
}

export type Operator = "+" | "-" | "*";
export type OperationCandidate = "x" | "y";
export type OperationActionConfiguration = {
    operator: Operator,
    operatorValue: number,
};
export type OperationConfiguration = {
    "x": OperationActionConfiguration | null,
    "y": OperationActionConfiguration | null,
};
