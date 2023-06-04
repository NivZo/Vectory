<script lang="ts">
    import { fade } from "svelte/transition";

    
</script>

<div class="victory-panel" in:fade={{delay: 300, duration: 300}} out:fade={{duration: 300}}>
    Victory!
    Yay!
</div>