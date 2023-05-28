import type { Coordinate } from "./Coordinate";

export type OperationAction = (crd: Coordinate) => number;

export type Operation = {
    name: string,
    xOperation: OperationAction,
    yOperation: OperationAction,
}

export type Operator = "+" | "-" | "*" | "/";
export type OperationCandidate = "x" | "y";
export type OperationActionConfiguration = {
    operator: Operator,
    operatorValue: number,
};
export type OperationConfiguration = {
    "x": OperationActionConfiguration,
    "y": OperationActionConfiguration,
    "name": string,
};
