type DebounceMode = "delay" | "prevent"

export type Debouncer = {
    debounce: () => void,
    timer: NodeJS.Timeout,
    isRunning: boolean,
}

export const debouncer = (callback: () => void, periodInMs: number, mode: DebounceMode): Debouncer => {
    let debounce: () => void = null;
    let timer: NodeJS.Timeout = null;
    let isRunning = false;

    switch (mode) {
        case "delay":
            debounce = () => {
                clearTimeout(timer);
                isRunning = true;
                timer = setTimeout(callback, periodInMs);
            };
            break;
        case "prevent":
            debounce = () => {
                if (timer) {
                    return;
                }
                else {
                    callback();
                    isRunning = true;
                    timer = setTimeout(() => { timer = null; isRunning = false; }, periodInMs);
                }
            }
    }
    return {
        debounce,
        timer,
        isRunning,
    }
}