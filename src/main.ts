import { setEngine } from "./app/getEngine";
import { LoadScreen } from "./app/screens/LoadScreen";
import { TemplateFactory } from "./app/templates/TemplateFactory";
import { ChoiceTemplate } from "./app/templates/choice/ChoiceTemplate";
import { TrueFalseTemplate } from "./app/templates/trueFalse/TrueFalseTemplate";
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

  // Show the load screen
  await engine.navigation.showScreen(LoadScreen);
  // // 注册题型模板
  TemplateFactory.register("choice", ChoiceTemplate);
  TemplateFactory.register("trueFalse", TrueFalseTemplate);

  // // Show the template screen once the load screen is dismissed
})();
