<script lang="ts">
    import "./StatusPanel.scss";

    import {
        currentCoordinate,
        gameSession,
        remainingMoves,
    } from "../../../stores/GameSessionStore";
    import { admin } from "../../../stores/AdminStore";
    import { currentLevel } from "../../../stores/LocalStorageStore";
    import { mainScreen } from "../../../stores/MainScreenStore";
    import { fade } from "svelte/transition";
</script>

<div class="status-panel">
    {#if ($mainScreen == "graph") || ($mainScreen == "victory")}
        <span
            class="status-panel-item status-panel-level-item"
            transition:fade={{ duration: 400, delay: 400 }}
        >
            Level:
            <br />
            {$currentLevel}
        </span>
        <span
            class="status-panel-item"
            on:click={admin.toggleAdmin}
            transition:fade={{ duration: 400, delay: 400 }}
        >
            Moves:
            <br />
            <b>{$remainingMoves}</b>
        </span>
        <span
            class="status-panel-item"
            transition:fade={{ duration: 400, delay: 400 }}
        >
            Current:
            <br />
            <b>({$currentCoordinate.x}, {$currentCoordinate.y})</b></span
        >
        <span
            class="status-panel-item"
            transition:fade={{ duration: 400, delay: 400 }}
        >
            Goal:
            <br />
            <b>
                ({$gameSession.targetCoordinate.x}, {$gameSession
                    .targetCoordinate.y})
            </b>
        </span>
    {/if}
</div>
