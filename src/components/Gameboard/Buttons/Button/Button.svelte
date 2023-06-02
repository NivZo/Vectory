<script lang="ts">
import "./Button.scss";

    export let widthPrecentage: number = 30;
    export let heightPercentage: number = 90;
    export let isEnabled: boolean = true;
    export let classes: string[] = [];
    export let onHover: () => void = null;
    export let onMouseLeave: () => void = null;
    export let onClick: () => void = null;

    let isLongPress = false;

    let isActive = false;
    let setIsActive = (newValue: boolean) => () => {
        isActive = newValue;
    };
</script>

<div
    style="--widthPrecentage: {widthPrecentage}%; --heightPercentage: {heightPercentage}%"
    class={"btn" + (!!classes ? " " : "") + classes.join(" ")}
    on:pointerdown={isEnabled && setIsActive(true)}
    on:pointerup={isEnabled &&
        (() => {
            onClick();
            isActive = false;
        })}
    on:pointerover={isEnabled && onHover}
    on:pointerleave={isEnabled &&
        (() => {
            onMouseLeave && onMouseLeave();
            isActive = false;
            isLongPress = false;
        })}
    on:contextmenu|preventDefault={isEnabled &&
        (() => {
            setIsActive(true)();
            isLongPress = true;
        })}
    class:active={isActive}
    class:disabled={!isEnabled}
>
    <slot />
</div>
