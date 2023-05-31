<script lang="ts">
  import { gameSession, isVictory } from "../../../stores/GameSessionStore";
  import { getRandomGameConfiguration } from "../../../utils/jsonUtils";
    import Button from "./Button/Button.svelte";

  const initGameSession = () => {
    const gameConfiguration = getRandomGameConfiguration();
    gameSession.setGameConfiguration(gameConfiguration);
  };
</script>

<Button onClick={initGameSession} text={$isVictory ? "Next" : "New"}/>
