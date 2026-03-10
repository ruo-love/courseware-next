import type { Ticker } from "pixi.js";
import { Container } from "pixi.js";
import type { ScreenLayout } from "../layout/layout";

/**
 * 所有页面/弹窗的抽象基类
 * 统一生命周期与布局接口
 */
export abstract class BaseScreen extends Container {
  protected layout?: ScreenLayout;
  protected backgroundLayer = new Container();
  protected contentLayer = new Container();
  protected overlayLayer = new Container();

  public constructor() {
    super();
    this.addChild(this.backgroundLayer, this.contentLayer, this.overlayLayer);
  }

  protected applyLayout(layout: ScreenLayout): void {
    this.layout = layout;
    this.contentLayer.position.set(layout.offsetX, layout.offsetY);
    this.contentLayer.scale.set(layout.scale);
  }

  /** Resize the screen */
  public abstract resize(layout: ScreenLayout): void;

  /** Prepare the screen just before showing */
  public prepare(): void {}

  /** Show the screen */
  public async show(): Promise<void> {}

  /** Hide the screen */
  public async hide(): Promise<void> {}

  /** Pause the screen */
  public async pause(): Promise<void> {}

  /** Resume the screen */
  public async resume(): Promise<void> {}

  /** Reset screen, after hidden */
  public reset(): void {}

  /** Update the screen, passing delta time/step */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public update(_time: Ticker): void {}

  /** Blur the screen */
  public blur(): void {}

  /** Focus the screen */
  public focus(): void {}

  /** Method to react on assets loading progress */
  public onLoad(progress: number): void {
    void progress;
  }
}
