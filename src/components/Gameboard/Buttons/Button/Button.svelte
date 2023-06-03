<script lang="ts">
    import { element } from "svelte/internal";
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

    const isOnButtonTouch = (ev) => {
        let rect = ev.target.getBoundingClientRect();
        let touch = ev.changedTouches[0];
        console.table({
            rectx: rect,
            touch,
        });
        return (
            touch.clientX > rect.x &&
            touch.clientX < rect.x + rect.width &&
            touch.clientY > rect.y &&
            touch.clientY < rect.y + rect.height
        );
    };
</script>

<div
    class={"btn-container" + (!!classes ? " " : "") + classes.join(" ")}
    class:active={isActive}
    class:disabled={!isEnabled}
    style="--widthPrecentage: {widthPrecentage}%; --heightPercentage: {heightPercentage}%;"
    on:pointerup={isEnabled &&
        (() => {
            onClick();
            isActive = false;
            !!onMouseLeave && onMouseLeave();
        })}
    on:pointerdown={isEnabled && setIsActive(true)}
    on:pointerover={isEnabled && onHover}
    on:contextmenu|preventDefault={() => null}
    on:touchend={isEnabled &&
        ((ev) => {
            if (isActive) {
                setIsActive(false)();
                !!onMouseLeave && onMouseLeave();
                if (isOnButtonTouch(ev)) {
                    onClick();
                }
            }
        })}
>
    <div class="btn-bg" />
    <div class={"btn-face"}>
        <slot />
    </div>
</div>
