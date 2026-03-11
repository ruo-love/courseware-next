import type { ScreenLayout } from "@/engine/layout/layout";
import { Container } from "pixi.js";

export abstract class BaseTemplate extends Container {
  public static assetBundles?: string[];
  protected layout?: ScreenLayout;
  protected payload?: unknown;

  protected contentLayer = new Container();
  protected uiLayer = new Container();
  protected popupLayer = new Container();

  constructor(payload?: unknown) {
    super();
    this.payload = payload;
    this.addChild(this.contentLayer);
    this.addChild(this.uiLayer);
    this.addChild(this.popupLayer);
  }
  /** 重置模版状态 */
  public abstract reset(): Promise<void> | void;
  /** 模板销毁 */
  public abstract destroyTemplate(): void;
}
