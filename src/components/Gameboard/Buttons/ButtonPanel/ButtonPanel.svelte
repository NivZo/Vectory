<script lang="ts">
    import "./ButtonPanel.scss";

    import OperationButton from "../OperationButton.svelte";
    import { gameSession } from "../../../../stores/GameSessionStore";
    import type { Domain } from "../../../../types/Display";
    import { chunk, range } from "../../../../utils/mathUtils";
    import Button from "../Button/Button.svelte";
    import OptionsPanel from "../../OptionsPanel/OptionsPanel.svelte";

    export let domain: Domain;

    const rowHeightPercentage = 35;
</script>

<div class="btn-panel">
    {#each chunk($gameSession.operations, 3) as operationsChunk, ci}
        <div
            class="btn-panel-row btn-panel-row-{ci}"
            style="--heightPercentage: {rowHeightPercentage}%"
        >
            {#each operationsChunk as operation, i (i)}
                <OperationButton {operation} {domain} />
            {/each}
            {#if operationsChunk.length < 3}
                {#each range(0, 2 - operationsChunk.length) as _}
                    <Button isEnabled={false} />
                {/each}
            {/if}
        </div>
    {/each}
    {#if $gameSession.operations.length <= 3}
        <div
            class="btn-panel-row btn-panel-row-{1}"
            style="--heightPercentage: {rowHeightPercentage}%"
        >
            <Button isEnabled={false} />
            <Button isEnabled={false} />
            <Button isEnabled={false} />
        </div>
    {/if}
    <OptionsPanel />
</div>
