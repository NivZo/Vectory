<script>
    import "./ExperienceBar.scss";
    import { tweened } from "svelte/motion";
    import { cubicInOut } from "svelte/easing";
    import {
        currentRankExperiencePoints,
        experienceRank,
    } from "../../stores/LocalStorageStore";
    import { onMount } from "svelte";

    const progress = tweened(0, {
        duration: 4000,
        easing: cubicInOut,
    });

    onMount(() => {
        setTimeout(() => progress.set($currentRankExperiencePoints), 700);
    });
</script>

<progress value={$progress} max="100" />
{Math.round($progress)} / 100
<br />
Rank: {$experienceRank}

<style>
    progress {
        display: block;
        width: 100%;
    }
</style>
