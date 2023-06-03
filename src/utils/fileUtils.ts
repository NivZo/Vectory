import type { GameConfiguration } from "../types/GameSession";
import { operationFromConfiguration } from "./operationUtils";
import { puzzles } from "../data/puzzles";
import { currentLevel } from "../stores/LocalStorageStore";

export const getRandomGameConfiguration = (): GameConfiguration => {
    const randomIndex = Math.floor(Math.random() * puzzles.length);
    const rawGameConf = puzzles[randomIndex];

    const gameConf: GameConfiguration = {
        ...rawGameConf,
        operations: []
    }

    rawGameConf.operations.forEach(operationConf => {
        gameConf.operations.push(operationFromConfiguration(operationConf))
    });

    console.log(gameConf);

    return gameConf;
}

export const getNextGameConfiguration = (): GameConfiguration => {
    let nextIndex = currentLevel.read() - 1;

    if (nextIndex >= puzzles.length) {
        currentLevel.set(1);
        nextIndex = 0;
    }

    const rawGameConf = puzzles[nextIndex];

    const gameConf: GameConfiguration = {
        ...rawGameConf,
        operations: rawGameConf.operations.map(operationFromConfiguration)
    }

    console.log(gameConf);

    return gameConf;
}