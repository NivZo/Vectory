import type { Coordinate } from "../types/Coordinate";
import type { Domain } from "../types/Display";
import type { Operation, OperationAction, OperationActionConfiguration, OperationCandidate, OperationConfiguration } from "../types/Operation";

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
        name: operationName(operationConfig),
        xOperation: operationActionFromConfiguration("x", operationConfig.x),
        yOperation: operationActionFromConfiguration("y", operationConfig.y),
    }
}

export const isInDomain = (crd: Coordinate, domain: Domain) =>
    crd.x >= domain.x[0] &&
    crd.x <= domain.x[1] &&
    crd.y >= domain.y[0] &&
    crd.y <= domain.y[1];

export const isOperationValid = (operation: Operation, crd: Coordinate, domain: Domain): boolean => {
    const newCrd: Coordinate = {
        x: operation.xOperation(crd),
        y: operation.yOperation(crd),
    };

    return isInDomain(newCrd, domain);
}

const operationName = (operationConfig: OperationConfiguration): string => {
    if (operationConfig.x && operationConfig.y) {
        return `${operationConfig.x.name} , ${operationConfig.y.name}`
    }
    else if (operationConfig.x) {
        return operationConfig.x.name + operationSign(operationConfig.x) 
    } else return operationConfig.y.name + operationSign(operationConfig.y)
}

const operationSign = (operationActionConfig: OperationActionConfiguration): string => {
    switch (operationActionConfig.operator) {
        case "*":
            return ''
        case "+":
            return '  (->)'
        case "-":
            return '  (<-)'
    }
}

// Operations
export const flipOperation: Operation = {
    name: "Flip",
    xOperation: crd => crd.y,
    yOperation: crd => crd.x,
};