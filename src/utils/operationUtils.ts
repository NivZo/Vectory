import type { Operation, OperationAction, OperationActionConfiguration, OperationCandidate, OperationConfiguration } from "../types/Operation";

// OperationAction factories
export let xPlus = (plusAmount: number): OperationAction => crd => crd.x + plusAmount;
export let xMinus = (minusAmount: number): OperationAction => crd => crd.x - minusAmount;
export let xTimex = (timesAmount: number): OperationAction => crd => crd.x * timesAmount;
export let yPlus = (plusAmount: number): OperationAction => crd => crd.y + plusAmount;
export let yMinus = (minusAmount: number): OperationAction => crd => crd.y - minusAmount;
export let yTimes = (timesAmount: number): OperationAction => crd => crd.y * timesAmount;

export let operationFromConfiguration = (operationConfig: OperationConfiguration): Operation => {
    let operationActionFromConfiguration = (candidate: OperationCandidate, operationActionConfig: OperationActionConfiguration): OperationAction => {
        switch (operationActionConfig.operator) {
            case "+":
                return crd => crd[candidate] + operationActionConfig.operatorValue
            case "-":
                return crd => crd[candidate] - operationActionConfig.operatorValue
            case "*":
                return crd => crd[candidate] * operationActionConfig.operatorValue
            case "/":
                return crd => crd[candidate] / operationActionConfig.operatorValue
        }
    }

    return {
        name: operationConfig.name,
        xOperation: operationActionFromConfiguration("x", operationConfig.x),
        yOperation: operationActionFromConfiguration("y", operationConfig.y),
    }
}

// Operations
export let flipOperation: Operation = {
    name: "Flip",
    xOperation: crd => crd.y,
    yOperation: crd => crd.x,
};