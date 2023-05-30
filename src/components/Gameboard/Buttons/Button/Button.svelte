<script lang="ts">
    export let text: string;
    export let widthPrecentage: number = 30;
    export let isEnabled: boolean = true;
    export let onHover: () => void = null;
    export let onMouseLeave: () => void = null;
    export let onClick: () => void;

    let isActive = false;
    let toggleIsActive = () => {
        isActive = !isActive;
    };
</script>

<div
    style="--widthPrecentage: {widthPrecentage}%"
    class="button"
    on:mousedown={isEnabled && toggleIsActive}
    on:mouseup={isEnabled && toggleIsActive}
    on:click={isEnabled && onClick}
    on:mouseover={isEnabled && onHover}
    on:mouseleave={isEnabled && onMouseLeave}
    class:active={isActive}
    class:disabled={!isEnabled}
>
    {text}
</div>

<style src="./Button.css"></style>
