import type { Coordinate } from "./Coordinate"
import type { Operation, OperationConfiguration } from "./Operation"

export type GameState = {
    currentPath: Coordinate[],
    currentHover?: Coordinate,
};

export type RawGameConfiguration = {
    sourceCoordinate: Coordinate,
    targetCoordinate: Coordinate,
    operations: OperationConfiguration[],
    boardSideSize: number,
    maxMoves: number,
}

export type GameConfiguration = {
    sourceCoordinate: Coordinate,
    targetCoordinate: Coordinate,
    operations: Operation[],
    boardSideSize: number,
    maxMoves: number,
}

export type GameSession = GameConfiguration & {
    state: GameState,
    loaded: boolean,
}