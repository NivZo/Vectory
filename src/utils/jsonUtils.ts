import type { GameConfiguration, RawGameConfiguration } from "../types/GameSession";
import { operationFromConfiguration } from "./operationUtils";
import { puzzles } from "../data/puzzles";

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
