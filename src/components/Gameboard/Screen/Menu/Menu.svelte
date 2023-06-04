<script lang="ts">
    import { fade } from "svelte/transition";
    import Logo from "../../../Visuals/Logo/Logo.svelte";

    
</script>

<div class="menu-panel" in:fade={{delay: 300, duration: 300}} out:fade={{duration: 300}}>
    <Logo/>
</div>