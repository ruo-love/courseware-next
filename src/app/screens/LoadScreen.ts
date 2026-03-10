import { animate } from "motion";
import type { ObjectTarget } from "motion/react";
import { Container, Sprite } from "pixi.js";
import type { ScreenLayout } from "../../engine/layout/layout";
import { BaseScreen } from "../../engine/navigation/BaseScreen";
import { engine } from "../getEngine";
import gsap from "gsap";
import { TemplateScreen } from "./TemplateScreen";
import Ctrs from "../ui/Ctrs";


/** Screen shown while loading assets */
export class LoadScreen extends BaseScreen {
  /** Assets bundles required by this screen */
  public static assetBundles = ["common"];
  private bg: Sprite = Sprite.from("common/loading-bg.png");
  private content: Container = new Container();
  private coverArea: Container = new Container();
  private cover: Sprite = Sprite.from("common/home-bg.png");
  private click_start: Sprite = Sprite.from("common/click-start.png");
  private ctr: Ctrs = new Ctrs();

  constructor() {
    super();
    this.content.addChild(this.coverArea);
    this.coverArea.addChild(this.cover, this.click_start);
    this.backgroundLayer.addChild(this.bg);
    this.contentLayer.addChild(this.content);
    this.overlayLayer.addChild(this.ctr);
    this.click_start.anchor.set(0.5)
    this.click_start.eventMode = "static";
    this.click_start.cursor = "pointer";
    this.click_start.on("pointertap", async () => {
      await engine().navigation.showScreen(TemplateScreen);
    });

  }

  public onLoad(progress: number) {
    void progress;
  }

  /** Resize the screen, fired whenever window size changes  */
  public resize(layout: ScreenLayout) {
    this.applyLayout(layout);
    const { designWidth, designHeight, viewportWidth, viewportHeight } = layout;
    this.bg.x = 0;
    this.bg.y = 0;
    this.bg.width = viewportWidth;
    this.bg.height = viewportHeight;
    this.coverArea.x = 0;
    this.coverArea.y = 0;
    this.cover.width = designWidth;
    this.cover.height = designHeight;
    this.click_start.x = this.cover.width / 2;
    this.click_start.y = this.cover.height / 2;
    this.ctr.scale.set(1);
    this.ctr.x = viewportWidth - 40 - this.ctr.width;
    this.ctr.y = 30;
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
      ease: "sine.inOut",
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
