<script lang="ts">
    import "./MainScreen.scss"
    import Graph from "./Graph/Graph.svelte";
    import { mainScreen } from '../../../stores/MainScreenStore';
    import Victory from "./Victory/Victory.svelte";
    import Menu from "./Menu/Menu.svelte";

    const screens = {
        "menu": Menu,
        "graph": Graph,
        "victory": Victory,
    };

</script>

<div class="screen-panel">
    <svelte:component this={screens[$mainScreen]} />
</div>