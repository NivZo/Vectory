<script lang="ts">
  import {
    gameSession,
    showNextButton,
  } from "../../../stores/GameSessionStore";
  import {
    currentLevel,
    experiencePoints,
  } from "../../../stores/LocalStorageStore";
  import { mainScreen } from "../../../stores/MainScreenStore";
  import { getNextGameConfiguration } from "../../../utils/fileUtils";
  import Button from "./Button/Button.svelte";

  const initGameSession = () => {
    const gameConfiguration = getNextGameConfiguration();
    gameSession.setGameConfiguration(gameConfiguration);
  };

  const advanceMainScreen = () => {
    switch ($mainScreen) {
      case "victory":
        currentLevel.increment();
        initGameSession();
        break;
      case "graph":
        experiencePoints.levelReward();
        break;
      default:
        break;
    };

    mainScreen.toNextScreen();
  };
</script>

<Button
  onClick={advanceMainScreen}
  isEnabled={$showNextButton}
  classes={["success-btn"]}
>
  {$mainScreen == "menu" ? "Play" : "Next"}
</Button>
