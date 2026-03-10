import type { BaseTemplate } from "../templates/BaseTemplate";
import type { ScreenLayout } from "../../engine/layout/layout";
import { BaseScreen } from "../../engine/navigation/BaseScreen";
import { Assets, Sprite } from "pixi.js";
import { TemplateFactory } from "../templates/TemplateFactory";
import { getPreviewExerciseData } from "@/app/servers/api/preview";
import { getTemplate } from "../templates/exercise-parse";

/** 课件题型承载屏 */
export class TemplateScreen extends BaseScreen {
  private current?: BaseTemplate;
  private viewportWidth = 0;
  private viewportHeight = 0;
  private currentId = 0;
  private bg?: Sprite;
  private ids = ["622829b28d71dd27c82989aaf806e7b1"];

  constructor() {
    super();
  }

  public override prepare() {
    void this.loadCurrent();
  }

  private async initBg(src: string) {
    const texture = await Assets.load(src);
    if (!this.bg) {
      this.bg = new Sprite(texture);
      this.backgroundLayer.addChild(this.bg);
    } else {
      this.bg.texture = texture;
    }
    this.layoutBg();
  }

  public async loadCurrent() {
    const id = this.ids[this.currentId];
    const res = await getPreviewExerciseData(id);
    await this.initBg(res.common_bg);
    const type = getTemplate(res["exercises_data"]);
    const TemplateCtor = TemplateFactory.getCtor(type);
    if (TemplateCtor.assetBundles?.length) {
      await Assets.loadBundle(TemplateCtor.assetBundles);
    }
    await this.loadTemplate(new TemplateCtor(), res);
  }

  public async loadTemplate(template: BaseTemplate, data: unknown) {
    if (this.current) {
      this.current.destroyTemplate();
      this.contentLayer.removeChild(this.current);
    }
    this.current = template;
    this.contentLayer.addChild(template);
    await template.init(data);
    if (this.viewportWidth > 0 && this.viewportHeight > 0) {
      this.layoutTemplate(this.viewportWidth, this.viewportHeight);
    }
  }

  public clearTemplate() {
    if (!this.current) return;
    this.current.destroyTemplate();
    this.contentLayer.removeChild(this.current);
    this.current = undefined;
  }

  public resize(layout: ScreenLayout) {
    const { designWidth, designHeight } = layout;
    this.applyLayout(layout);
    this.viewportWidth = designWidth;
    this.viewportHeight = designHeight;
    this.layoutTemplate(designWidth, designHeight);
    this.layoutBg();
  }

  private layoutTemplate(width: number, height: number) {
    if (this.current) {
      this.current.position.set(width * 0.5, height * 0.5);
    }
  }

  private layoutBg() {
    if(!this.bg || !this.layout) return
    const { viewportWidth, viewportHeight } = this.layout;
    this.bg.x = 0;
    this.bg.y = 0;
    this.bg.width = viewportWidth;
    this.bg.height = viewportHeight;
  }
}
