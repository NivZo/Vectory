// store.js
import { derived, writable, type Writable } from 'svelte/store';
// import { readFromLocalStorage } from '../utils/fileUtils';

const readFromLocalStorage = <T>(key, defaultValue: T = null): T => {
    const json = window.localStorage.getItem(key);
    if (json) {
        const parsed = JSON.parse(json);
        return parsed as T;
    }

    return defaultValue;
}

const createLocalStorageStore = <T>(key: string, startValue: T) => {
    const { subscribe, update, set } = writable<T>(readFromLocalStorage(key) ?? startValue);

    subscribe(current => {
        window.localStorage.setItem(key, JSON.stringify(current));
    });

    return {
        subscribe,
        update,
        set,
        read: (defaultValue: T = null) => readFromLocalStorage<T>(key, defaultValue),
    };
};

type CurrentLevel = number;
type CurrentLevelStore = Writable<CurrentLevel> & {
    read: (defaultValue?: CurrentLevel) => CurrentLevel,
    increment: () => void,
};

export const currentLevelKey = "currentLevel";
const currentLevelWritable = createLocalStorageStore<CurrentLevel>(currentLevelKey, 1);
export const currentLevel: CurrentLevelStore = {
    ...currentLevelWritable,
    increment: () => {
        currentLevelWritable.update(current => current + 1);
    }
};

const levelRewardAmount = 10;
const pointsPerRank = 100;
type ExperiencePoints = number;
type ExperiencePointsStore = Writable<ExperiencePoints> & {
    read: (defaultValue?: ExperiencePoints) => ExperiencePoints,
    levelReward: () => void,
};

export const experiencePointsKey = "experiencePoints";
const experiencePointsWritable = createLocalStorageStore<ExperiencePoints>(experiencePointsKey, 0);
export const experiencePoints: ExperiencePointsStore = {
    ...experiencePointsWritable,
    levelReward: () => {
        experiencePointsWritable.update(current => current + levelRewardAmount);
    }
};
export const experienceRank = derived(
    experiencePoints,
    $experiencePoints => Math.round($experiencePoints / pointsPerRank) + 1,
);
export const currentRankExperiencePoints = derived(
    experiencePoints,
    $experiencePoints => $experiencePoints % pointsPerRank,
);