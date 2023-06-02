import type { Coordinate } from "../types/Coordinate";
import type { Domain } from "../types/Display";
import type { AxisOperation, Operation, OperationAction, OperationActionConfiguration, OperationCandidate, OperationConfiguration } from "../types/Operation";

// OperationAction factories
export let xPlus = (plusAmount: number): OperationAction => crd => crd.x + plusAmount;
export let xMinus = (minusAmount: number): OperationAction => crd => crd.x - minusAmount;
export let xTimex = (timesAmount: number): OperationAction => crd => crd.x * timesAmount;
export let yPlus = (plusAmount: number): OperationAction => crd => crd.y + plusAmount;
export let yMinus = (minusAmount: number): OperationAction => crd => crd.y - minusAmount;
export let yTimes = (timesAmount: number): OperationAction => crd => crd.y * timesAmount;

export const operationFromConfiguration = (operationConfig: OperationConfiguration): Operation => {
    let operationActionFromConfiguration = (candidate: OperationCandidate, operationActionConfig: OperationActionConfiguration): OperationAction => {
        if (operationActionConfig) {
            switch (operationActionConfig.operator) {
                case "+":
                    return crd => crd[candidate] + operationActionConfig.operatorValue
                case "-":
                    return crd => crd[candidate] - operationActionConfig.operatorValue
                case "*":
                    return crd => crd[candidate] * operationActionConfig.operatorValue
            }
        }
        return crd => crd[candidate];
    }

    return {
        x: operationConfig.x ? {
            name: operationName("x", operationConfig.x),
            action: operationActionFromConfiguration("x", operationConfig.x),
        } : emptyOperation.x,
        y: operationConfig.y ? {
            name: operationName("y", operationConfig.y),
            action: operationActionFromConfiguration("y", operationConfig.y),
        } : emptyOperation.y,
    }
}

export const isInDomain = (crd: Coordinate, domain: Domain) =>
    crd.x >= domain.x[0] &&
    crd.x <= domain.x[1] &&
    crd.y >= domain.y[0] &&
    crd.y <= domain.y[1];

export const isOperationValid = (operation: Operation, crd: Coordinate, domain: Domain): boolean => {
    const newCrd: Coordinate = {
        x: operation.x.action(crd),
        y: operation.y.action(crd),
    };

    return isInDomain(newCrd, domain);
}

const operationName = (cand: OperationCandidate, operationActionConfig: OperationActionConfiguration): string => `${cand}${operationActionConfig.operator}${operationActionConfig.operatorValue}`.toUpperCase().replace('*', '×');

const operationSign = (operationActionConfig: OperationActionConfiguration, alignment: "vertical" | "horizontal"): string => {
    switch (operationActionConfig.operator) {
        case "*":
            return alignment == "horizontal" ? '  ⇉' : '  ⇈'
        case "+":
            return alignment == "horizontal" ? '  →' : '  ↑'
        case "-":
            return alignment == "horizontal" ? '  ←' : '  ↓'
    }
}

// Operations
// export const flipOperation: Operation = {
//     name: "Flip",
//     xOperation: crd => crd.y,
//     yOperation: crd => crd.x,
// };

const emptyOperation: Operation = {
    x: {
        name: "",
        action: crd => crd.x,
    },
    y: {
        name: "",
        action: crd => crd.y,
    },
}