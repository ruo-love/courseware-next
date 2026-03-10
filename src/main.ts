import { setEngine } from "./app/getEngine";
import { LoadScreen } from "./app/screens/LoadScreen";
import { TemplateScreen } from "./app/screens/TemplateScreen";
import TemplateRegister from "./app/templates/TemplateRegister";
import { userSettings } from "./app/utils/userSettings";
import { CreationEngine } from "./engine/engine";

/**
 * Importing these modules will automatically register there plugins with the engine.
 */
import "@pixi/sound";
// import "@esotericsoftware/spine-pixi-v8";

// Create a new creation engine instance
const engine = new CreationEngine();
setEngine(engine);

(async () => {
  // Initialize the creation engine instance
  await engine.init({
    background: "#1E1E1E",
    resizeOptions: { minWidth: 1024, minHeight: 768, letterbox: false },
  });

  // Initialize the user settings
  userSettings.init();
  TemplateRegister()
  // Show the load screen
  // await engine.navigation.showScreen(TemplateScreen);
  await engine.navigation.showScreen(LoadScreen);
})();
