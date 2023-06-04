<script lang="ts">
  import { admin } from "../../../stores/AdminStore";
  import { gameSession, isVictory } from "../../../stores/GameSessionStore";
  import { currentLevel } from "../../../stores/LocalStorageStore";
  import { mainScreen } from "../../../stores/MainScreenStore";
  import { getNextGameConfiguration } from "../../../utils/fileUtils";
  import Button from "./Button/Button.svelte";

  const initGameSession = () => {
    const gameConfiguration = getNextGameConfiguration();
    gameSession.setGameConfiguration(gameConfiguration);
  };

  const advanceMainScreen = () => {
    if ($mainScreen == "victory") {
      currentLevel.increment();
      initGameSession();
    }
    mainScreen.toNextScreen();
  };
</script>

<Button
  onClick={advanceMainScreen}
  isEnabled={$admin || $isVictory || $mainScreen == "menu"}
  classes={["success-btn"]}
>
  {$mainScreen == "menu" ? "Play" : "Next"}
</Button>
