<script lang="ts">
    import { admin } from "../../../stores/AdminStore";
  import { gameSession, isVictory } from "../../../stores/GameSessionStore";
  import { getRandomGameConfiguration } from "../../../utils/jsonUtils";
  import Button from "./Button/Button.svelte";

  const initGameSession = () => {
    const gameConfiguration = getRandomGameConfiguration();
    gameSession.setGameConfiguration(gameConfiguration);
  };
</script>

<Button onClick={initGameSession} isEnabled={$admin || $isVictory} classes={$isVictory ? ["success-btn"] : []}>Next</Button>
