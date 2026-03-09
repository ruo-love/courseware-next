import { animate } from "motion";
import type { ObjectTarget } from "motion/react";
import { Container, Sprite } from "pixi.js";
import { BaseScreen } from "../../engine/navigation/BaseScreen";
import { engine } from "../getEngine";
import gsap from "gsap";
import { TemplateScreen } from "./TemplateScreen";
import Ctrs from "../ui/Ctrs";
/** Screen shown while loading assets */
export class LoadScreen extends BaseScreen {
  /** Assets bundles required by this screen */
  public static assetBundles = ["common"];
  private bg:Sprite = Sprite.from("common/loading-bg.png");
  private coverArea:Container = new Container()
  private cover:Sprite= Sprite.from("common/home-bg.png")
  private click_start:Sprite= Sprite.from("common/click-start.png")
  private ctr:Ctrs=new Ctrs()
  constructor() {
    super();
    this.coverArea.addChild(this.cover,this.click_start,this.ctr)
    this.addChild(this.bg,this.coverArea)
    this.click_start.anchor.set(0.5);
    this.click_start.eventMode = "static";
    this.click_start.cursor = "pointer";
    this.click_start.on('pointertap', async () => {
      await engine().navigation.showScreen(TemplateScreen);
    });
  }

  public onLoad(progress: number) {
    void progress;
  }

  /** Resize the screen, fired whenever window size changes  */
  public resize(width: number, height: number) {
    void width;
    void height;
    const app = engine();
    // 背景
    const scaleX = app.screen.width / this.bg.texture.width;
    const scaleY = app.screen.height / this.bg.texture.height;
    const scale = Math.max(scaleX, scaleY);
    this.bg.scale.set(scale);

    // coverArea
    this.coverArea.x = app.screen.width * 0.1;

    const coverScale = (app.screen.width * 0.8) / this.cover.texture.width;
    this.cover.height = Math.min(this.cover.texture.height*coverScale,app.screen.height)
    this.cover.width = this.cover.texture.width*coverScale

    this.coverArea.y = (app.screen.height - this.cover.height) / 2;

    this.click_start.x = this.cover.width / 2;
    this.click_start.y = this.cover.height / 2;

    this.ctr.x = this.coverArea.width-20-this.ctr.width
    this.ctr.y = 20
  }

  /** Show screen with animations */
  public async show() {
    this.alpha = 1;
    gsap.to(this.click_start.scale, {
      x: 1.1,
      y: 1.1,
      duration: 0.5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
  }

  /** Hide screen with animations */
  public async hide() {
    await animate(this, { alpha: 0 } as ObjectTarget<this>, {
      duration: 0.3,
      ease: "linear",
    });
  }
}
