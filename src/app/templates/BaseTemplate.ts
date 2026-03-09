import { Container } from "pixi.js";


export abstract class BaseTemplate extends Container {
  protected contentLayer = new Container();
  protected uiLayer = new Container();
  protected popupLayer = new Container();

  constructor() {
    super();
    this.addChild(this.contentLayer);
    this.addChild(this.uiLayer);
    this.addChild(this.popupLayer);
  }

  /** 初始化模板资源与显示对象 */
  public abstract init(data: unknown): Promise<void> | void;
  /** 模板销毁 */
  public abstract destroyTemplate(): void;
}
