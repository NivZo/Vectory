<script lang="ts">
    import OperationButton from "./OperationButton.svelte";
    import Grid from "./Grid.svelte";
    import {
        currentCoordinate,
        currentPath,
        gameSession,
        remainingMoves,
    } from "../stores/GameSessionStore";
    import UndoButton from "./UndoButton.svelte";
    import NewGameButton from "./NewGameButton.svelte";
</script>

<div>
    {#if $gameSession.loaded}
    <Grid />
    <div>Current: {$currentCoordinate.x}, {$currentCoordinate.y}</div>
    <div>Goal: {$gameSession.targetCoordinate.x}, {$gameSession.targetCoordinate.y}</div>
    <div>
        Path:
        {#each $currentPath as crd, i}
            <span
                >({crd.x}, {crd.y})
                {#if i != $currentPath.length - 1}
                    ->
                {/if}
            </span>
        {/each}
    </div>
    <div>
        Remaining Moves: {$remainingMoves}
    </div>
    {#each $gameSession.operations as operation}
        <OperationButton {operation} />
    {/each}
    <UndoButton />
    <NewGameButton />
    {/if}
</div>
