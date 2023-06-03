<script lang="ts">
    import { admin } from "../../../stores/AdminStore";
  import { gameSession, isVictory } from "../../../stores/GameSessionStore";
    import { currentLevel } from "../../../stores/LocalStorageStore";
  import { getNextGameConfiguration } from "../../../utils/fileUtils";
  import Button from "./Button/Button.svelte";

  const initGameSession = () => {
    const gameConfiguration = getNextGameConfiguration();
    gameSession.setGameConfiguration(gameConfiguration);
  };

  const advanceLevel = () => {
    currentLevel.increment();
    initGameSession();
  }
</script>

<Button onClick={advanceLevel} isEnabled={$admin || $isVictory} classes={$isVictory ? ["success-btn"] : []}>Next</Button>
