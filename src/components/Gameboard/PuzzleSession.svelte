<script>
    import { onMount } from "svelte";
    import Graph from "./Graph.svelte";
    import {
        gameSession,
        currentCoordinate,
        currentPath,
        remainingMoves,
    } from "../../stores/GameSessionStore";
    import { display } from "../../stores/DisplayStore";
    import UndoButton from "../UndoButton.svelte";
    import NewGameButton from "../NewGameButton.svelte";
    import OperationButton from "../OperationButton.svelte";
    import { getSessionDomain } from "../../utils/mathUtils";

    onMount(() => {
        gameSession.resetGameState();
        console.table({
            sourceCoordinate: $gameSession.sourceCoordinate,
            path: $currentPath,
        });
    });

    $: domain = getSessionDomain($gameSession.boardSideSize, $display);
</script>

<div class="puzzle-session">
    <Graph {domain}/>

    <div>Current: {$currentCoordinate.x}, {$currentCoordinate.y}</div>
    <div>
        Goal: {$gameSession.targetCoordinate.x}, {$gameSession.targetCoordinate.y}
    </div>
    <div>
        Path:
        {#each $currentPath as crd, i}
            <span
                >({crd.x}, {crd.y})
                {#if i != $currentPath.length - 1} -> {/if}
            </span>
        {/each}
    </div>
    <div>
        Remaining Moves: {$remainingMoves}
    </div>
    {#each $gameSession.operations as operation}
        <OperationButton {operation} {domain}/>
    {/each}
    <UndoButton />
    <NewGameButton />
</div>
