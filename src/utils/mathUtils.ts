import type { Display, Domain } from "../types/Display";

export const range = (from: number, to: number, step: number = 1, reverseStep: boolean = false): Array<number> => {
    if ((from > to && step > 0) || (from < to && step < 0)) {
        return null
    }

    let result: Array<number> = []

    if (!reverseStep) {
        for (let i = from; step > 0 ? (i <= to) : (i >= to); i += step) {
            result.push(i);
        }
    }
    else {
        for (let i = to; step > 0 ? (i >= from) : (i <= from); i -= step) {
            result = [i, ...result];
        }
    }

    return result;
}

export const rangeAroundZero = (from: number, to: number, step: number = 1): Array<number> => {
    if ((from > to && step > 0) || (from < to && step < 0)) {
        return null
    }

    const leftHalf: Array<number> = range(from, 0, step, true)
    const rightHalf = range(step, to, step);
    console.table({
        step, leftHalf, rightHalf
    })
    return leftHalf && rightHalf ? [...leftHalf, ...rightHalf] : [];
}

const isHalfPortrait = (display: Display): boolean => (display.height) / 2 > display.width;

export const getSessionDomain = (minimumSideCount: number, display: Display): Domain => {
    const isHPortrait = isHalfPortrait(display);
    const smallerSide = isHPortrait ? display.width : display.height / 2;
    const largerSide = !isHPortrait ? display.width : display.height / 2;
    const cellSize = smallerSide / minimumSideCount;
    let largerSideCount = Math.floor(largerSide / cellSize);
    largerSideCount -= largerSideCount % 2 == 0 ? 0 : 1;

    if (isHPortrait) {
        return {
            x: [-minimumSideCount / 2, minimumSideCount / 2],
            y: [-largerSideCount / 2, largerSideCount / 2],
        }
    }
    return {
        x: [-largerSideCount / 2, largerSideCount / 2],
        y: [-minimumSideCount / 2, minimumSideCount / 2],
    }
}