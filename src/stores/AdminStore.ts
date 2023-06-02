import { writable } from 'svelte/store';

const createAdmin = () => {
    const { subscribe, set, update } = writable<boolean>(false);

    return {
        subscribe,
        enableAdmin: () => set(true),
        disableAdmin: () => set(false),
        toggleAdmin: () => update(a => !a),
        set,
    };
};

export const admin = createAdmin();