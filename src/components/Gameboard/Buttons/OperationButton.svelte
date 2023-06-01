<script lang="ts">
    import { currentCoordinate, gameSession, isPlayable, isVictory } from "../../../stores/GameSessionStore";
    import type { Coordinate } from "../../../types/Coordinate";
    import type { Operation } from "../../../types/Operation";
    import type { Domain } from "../../../types/Display";
    import Button from "./Button/Button.svelte";
    import { isOperationValid } from "../../../utils/operationUtils";

    export let operation: Operation;
    export let domain: Domain;

    const applyOperation = (): void => {
        const newCoordinate: Coordinate = {
            x: operation.xOperation($currentCoordinate),
            y: operation.yOperation($currentCoordinate),
        }
        gameSession.addCoordinate(newCoordinate, domain);
    }

    const hoverOperation = (): void => {
        const newCoordinate: Coordinate = {
            x: operation.xOperation($currentCoordinate),
            y: operation.yOperation($currentCoordinate),
        }
        gameSession.addHoverCoordinate(newCoordinate, domain);
    }
</script>

<Button
    onHover={hoverOperation}
    onClick={applyOperation}
    onMouseLeave={gameSession.removeHoverCoordinate}
    isEnabled={$isPlayable && isOperationValid(operation, $currentCoordinate, domain)}
    text={operation.name} 
    />