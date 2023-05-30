<script lang="ts">
    import { onDestroy, onMount } from "svelte";
    import { display } from "../../stores/DisplayStore";

    const handleResize = () => {
        display.set({
            width: window.innerWidth,
            height: window.innerHeight,
        });
    };

    onMount(() => {
        handleResize();
        window.addEventListener("resize", handleResize);
    });

    onDestroy(() => {
        window.removeEventListener("resize", handleResize);
    });
</script>
