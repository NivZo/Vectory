<script lang="ts">
    import UndoButton from "../UndoButton.svelte";
    import NewGameButton from "../NewGameButton.svelte";
    import OperationButton from "../OperationButton.svelte";
    import ResetButton from "../ResetButton.svelte";
    import { gameSession } from "../../../../stores/GameSessionStore";
    import type { Domain } from "../../../../types/Display";
    import { chunk } from "../../../../utils/mathUtils";

    export let domain: Domain;

    const rowHeightPercentage = 50;
</script>

<div class="btn-panel">
    {#each chunk($gameSession.operations, 3) as operationsChunk, i}
        <div
            class="btn-panel-row btn-panel-row-{i}"
            style="--heightPercentage: {rowHeightPercentage}%"
        >
            {#each operationsChunk as operation (operation.name)}
                <OperationButton {operation} {domain} />
            {/each}
        </div>
    {/each}

    <div class="btn-panel-row" style="--heightPercentage: {rowHeightPercentage}%">
        <UndoButton />
        <ResetButton />
        <NewGameButton />
    </div>
</div>

<style src="./ButtonPanel.scss"></style>
