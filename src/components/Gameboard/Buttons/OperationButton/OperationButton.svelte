<script lang="ts">
    import "./OperationButton.scss";
    import {
        currentCoordinate,
        gameSession,
        isPlayable,
    } from "../../../../stores/GameSessionStore";
    import type { Coordinate } from "../../../../types/Coordinate";
    import type { Operation } from "../../../../types/Operation";
    import type { Domain } from "../../../../types/Display";
    import Button from "../Button/Button.svelte";
    import { isOperationValid } from "../../../../utils/operationUtils";
    import { fly } from "svelte/transition";

    export let operation: Operation;
    export let domain: Domain;
    let classes = [];
    $: {
        classes = [];
        if (!!operation.x.name) {
            classes.push("x-op-btn");
        }
        if (!!operation.y.name) {
            classes.push("y-op-btn");
        }
    }

    const applyOperation = (): void => {
        const newCoordinate: Coordinate = {
            x: operation.x.action($currentCoordinate),
            y: operation.y.action($currentCoordinate),
        };
        gameSession.addCoordinate(newCoordinate, domain);
    };

    const hoverOperation = (): void => {
        const newCoordinate: Coordinate = {
            x: operation.x.action($currentCoordinate),
            y: operation.y.action($currentCoordinate),
        };
        gameSession.addHoverCoordinate(newCoordinate, domain);
    };
</script>

<Button
    {classes}
    onHover={hoverOperation}
    onClick={applyOperation}
    onMouseLeave={gameSession.removeHoverCoordinate}
    isEnabled={$isPlayable &&
        isOperationValid(operation, $currentCoordinate, domain)}
>
    {#key operation.x.name}
    <span class="x-op-name">{operation.x.name}</span>
    {/key}
    {#key operation.y.name}
    <span class="y-op-name">{operation.y.name}</span>
    {/key}
</Button>
