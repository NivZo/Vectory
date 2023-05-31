import { derived, writable } from 'svelte/store';
import type { GameConfiguration, GameSession } from '../types/GameSession';
import type { Coordinate } from '../types/Coordinate';
import type { Domain } from '../types/Display';
import { isInDomain } from '../utils/operationUtils';

const emptyGameSession: GameSession = {
	sourceCoordinate: { x: 0, y: 0 },
	targetCoordinate: { x: 0, y: 0 },
	operations: [],
	boardSideSize: 0,
	maxMoves: 0,
	state: {
		currentPath: [],
		currentHover: null,
	},
	loaded: false,
};

const createGameSession = () => {
	const { subscribe, set, update } = writable<GameSession>(emptyGameSession);

	return {
		subscribe,
		set,
		setGameConfiguration: (gameConfig: GameConfiguration) => set({
			...gameConfig,
			state: {
				currentPath: [gameConfig.sourceCoordinate],
				currentHover: null,
			},
			loaded: true,
		}),
		addCoordinate: (newCrd: Coordinate, domain: Domain) => update(gs => {
			if (isInDomain(newCrd, domain))
				gs.state.currentPath.push(newCrd);
			gs.state.currentHover = null;
			return gs;
		}),
		addHoverCoordinate: (hoverCrd: Coordinate, domain: Domain) => update(gs => {
			if (isInDomain(hoverCrd, domain))
				gs.state.currentHover = hoverCrd;
			return gs;
		}),
		removeHoverCoordinate: () => update(gs => {
			gs.state.currentHover = null;
			return gs;
		}),
		removeLastCoordinate: () => update(gs => {
			if (gs.state.currentPath.length > 1)
				gs.state.currentPath = gs.state.currentPath.slice(0, -1);
			gs.state.currentHover = null;
			return gs;
		}),
		reset: () => set(emptyGameSession),
		resetGameState: () => update(gs => {
			gs.state = {
				currentPath: [gs.sourceCoordinate],
				currentHover: null,
			};

			return gs;
		}),
	};
}

export const gameSession = createGameSession();
export const currentPath = derived(
	gameSession,
	$gameSession => $gameSession.state.currentPath
);
export const currentCoordinate = derived(
	gameSession,
	$gameSession => {
		let cp = $gameSession.state.currentPath;
		return cp.length > 0 ? cp[cp.length - 1] : $gameSession.sourceCoordinate;
	}
);
export const currentHover = derived(
	gameSession,
	$gameSession => $gameSession.state.currentHover
);
export const isVictory = derived(
	[gameSession, currentCoordinate],
	([gs, crd]) => gs.targetCoordinate.x == crd.x && gs.targetCoordinate.y == crd.y,
);
export const remainingMoves = derived(
	gameSession,
	$gameSession => $gameSession.maxMoves - $gameSession.state.currentPath.length + 1
);
export const isPlayable = derived(
	[isVictory, remainingMoves],
	([iv, rm]) => iv ? false : rm > 0,
);


