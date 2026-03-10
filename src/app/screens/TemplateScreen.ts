import type { BaseTemplate } from "../templates/BaseTemplate";
import type { ScreenLayout } from "../../engine/layout/layout";
import { BaseScreen } from "../../engine/navigation/BaseScreen";
import { Assets, Sprite } from "pixi.js";
import { TemplateFactory } from "../templates/TemplateFactory";
import { getPreviewExerciseData } from "@/app/servers/api/preview";
import { getTemplate } from "../templates/exercise-parse";
import Ctrs from "../ui/Ctrs";

/** 课件题型承载屏 */
export class TemplateScreen extends BaseScreen {
  private currentTemplate?: BaseTemplate;
  private currentId = 0;
  private templateBackground?: Sprite;
  private ctr: Ctrs = new Ctrs();
  private ids = ["5bc79aee391eea64cbdeb90da34a4a14","622829b28d71dd27c82989aaf806e7b1"];

  constructor() {
    super();
  }

  public override prepare() {
    this.overlayLayer.addChild(this.ctr);
    void this.loadCurrent();
  }

  private async initBg(src: string) {
    const texture = await Assets.load("https://course-assets.alo7.com/generate/pieces/732/7325b950a902a3e05b3180a80d487b3bdb36275381621899ef81cc9b0ea2d83d/1024x768/img.png");
    if (!this.templateBackground) {
      this.templateBackground = new Sprite(texture);
      this.backgroundLayer.addChild(this.templateBackground);
    } else {
      this.templateBackground.texture = texture;
    }
    this.layoutBg();
  }

  public async loadCurrent() {
    const id = this.ids[this.currentId];
    const payload = await getPreviewExerciseData(id);
    await this.initBg(payload.common_bg);
    const type = getTemplate(payload["exercises_data"]);
    const TemplateCtor = TemplateFactory.getCtor(type);
    if (TemplateCtor.assetBundles?.length) {
      await Assets.loadBundle(TemplateCtor.assetBundles);
    }
    await this.loadTemplate(new TemplateCtor(), payload);
  }

  public async loadTemplate(template: BaseTemplate, data: unknown) {
    if (this.currentTemplate) {
      this.currentTemplate.destroyTemplate();
      this.contentLayer.removeChild(this.currentTemplate);
    }
    this.currentTemplate = template;
    this.contentLayer.addChild(template);
    await template.init(data);
  }

  public clearTemplate() {
    if (!this.currentTemplate) return;
    this.currentTemplate.destroyTemplate();
    this.contentLayer.removeChild(this.currentTemplate);
    this.currentTemplate = undefined;
  }

  public resize(layout: ScreenLayout) {
    this.applyLayout(layout);
    const { viewportWidth } = layout;
    this.layoutBg();
    this.ctr.x = viewportWidth - 40 - this.ctr.width;
    this.ctr.y = 30;
  }


  private layoutBg() {
    if(!this.templateBackground || !this.layout) return
    const { viewportWidth, viewportHeight } = this.layout;
    this.templateBackground.x = 0;
    this.templateBackground.y = 0;
    this.templateBackground.width = viewportWidth;
    this.templateBackground.height = viewportHeight;
  }
}
