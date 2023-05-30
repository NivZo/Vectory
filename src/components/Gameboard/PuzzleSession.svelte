<script>
    import { onMount } from "svelte";
    import Graph from "./Graph/Graph.svelte";
    import {
        gameSession,
        currentCoordinate,
        currentPath,
        remainingMoves,
    } from "../../stores/GameSessionStore";
    import { display } from "../../stores/DisplayStore";
    import UndoButton from "./Buttons/UndoButton.svelte";
    import NewGameButton from "../Gameboard/Buttons/NewGameButton.svelte";
    import OperationButton from "../Gameboard/Buttons/OperationButton.svelte";
    import { getSessionDomain } from "../../utils/mathUtils";
    import ResetButton from "./Buttons/ResetButton.svelte";

    onMount(() => {
        gameSession.resetGameState();
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
    <ResetButton />
    <NewGameButton />
</div>
