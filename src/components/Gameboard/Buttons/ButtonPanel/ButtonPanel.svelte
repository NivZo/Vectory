<script lang="ts">
    import UndoButton from "../UndoButton.svelte";
    import NewGameButton from "../NewGameButton.svelte";
    import OperationButton from "../OperationButton.svelte";
    import ResetButton from "../ResetButton.svelte";
    import { gameSession } from "../../../../stores/GameSessionStore";
    import type { Domain } from "../../../../types/Display";

    export let domain: Domain;
</script>

<div class="button-panel">
    <div class="panel-row">
        {#each $gameSession.operations as operation}
            <OperationButton {operation} {domain} />
        {/each}
    </div>

    <div class="panel-row">
        <UndoButton />
        <ResetButton />
        <NewGameButton />
    </div>
</div>

<style src="./ButtonPanel.css"></style>
