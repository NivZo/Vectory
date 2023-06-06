<script lang="ts">
    import "./Victory.scss";
    import { fade } from "svelte/transition";
    import ExperienceBar from "../../../ExperienceBar/ExperienceBar.svelte";
    import { onMount } from "svelte";

    const congratulations = [
        "You made it!",
        "You did it!",
        "Amazing!",
        "Thank you, next!",
        "Wow!",
        "Clean mean vector machine!",
        "Victory!",
        "Huzzah!",
        "Touchdown!",
        "Goal!!!",
        "Success has been achieved!",
        "No brain no gain!",
        "Great minds think alike!",
        "Mission accomplished!",
        "Target reached!",
        "Vector mentor!",
        "Math wizard!",
        "Think you can beat the next?",
        "Harder faster better smarter!",
        "Awesome!",
        "Congratulations!",
        "GG WP",
        "Puzzle? No hustle!",
        "Mega-mind!",
        "Genius!",
    ];

    let selectedLine = "";

    onMount(() => {
        selectedLine = congratulations[Math.round(Math.random() * congratulations.length)];
    })
</script>

<div
    class="victory-panel"
    in:fade={{ delay: 300, duration: 300 }}
    out:fade={{ duration: 300 }}
>
    {selectedLine}
    <br/>
    <ExperienceBar />
</div>
