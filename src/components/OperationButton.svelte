<script lang="ts">
    import { currentCoordinate, gameSession, isPlayable } from "../stores/GameSessionStore";
    import { onHoverOrMouseDown } from "../utils/hoverUtils";
    import type { Coordinate } from "../types/Coordinate";
    import type { Operation } from "../types/Operation";
    import type { Domain } from "../types/Display";

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

<button
    use:onHoverOrMouseDown={hoverOperation}
    on:click={applyOperation}
    on:mouseleave={gameSession.removeHoverCoordinate}
    disabled={!$isPlayable}>
    {operation.name}
</button>