import type { BaseTemplate } from "../templates/BaseTemplate";
import { BaseScreen } from "../../engine/navigation/BaseScreen";
import { Container } from "pixi.js";
import ControllerButton from "../ui/ControllerButton";
import { TemplateFactory } from "../templates/TemplateFactory";
import { ReportScreen } from "./ReportScreen";
import { engine } from "../getEngine";

/** 课件题型承载屏 */
export class TemplateScreen extends BaseScreen {
  private current?: BaseTemplate;
  private viewportWidth = 0;
  private viewportHeight = 0;
  private controllerArea =  new Container();
  public index = 0; 
  public questions = [
    {
      type: "choice",
      question: "示例题：2 + 2 = ?",
      options: ["3", "4", "5", "6"],
    },
    {
      type: "trueFalse",
      question: "示例题：地球是圆的？",
    },
  ];
  constructor() {
    super();
    
    this.loadCurrent();
    this.initCtr()
  }
  public async loadCurrent () {
    const data = this.questions[this.index];
      await this.loadTemplate(TemplateFactory.create(data.type), data);
    };
  public async loadTemplate(template: BaseTemplate, data: unknown) {
    if (this.current) {
      this.current.destroyTemplate();
      this.removeChild(this.current);
    }
    this.current = template;
    this.addChild(template);
    await template.init(data);
    if (this.viewportWidth > 0 && this.viewportHeight > 0) {
      this.layout(this.viewportWidth, this.viewportHeight);
    }
  }

  public initCtr(){
  const submitButton = ControllerButton("提交");
  const nextButton = ControllerButton("下一题");
  submitButton.x = 420;
  nextButton.x = 120;
  submitButton.y = 60;
  nextButton.y = 60;
  this.controllerArea.addChild(submitButton, nextButton);
  this.addChild(this.controllerArea);
  submitButton.on("pointertap", () => {
    this.submit();
    const answer = this.getAnswer();
    console.log("answer", answer);

    if (this.index === this.questions.length - 1) {
      engine().navigation.showScreen(ReportScreen);
    }
  });

  nextButton.on("pointertap", async () => {
    this.index = (this.index + 1) % this.questions.length;
    await this.loadCurrent();
  });
  }

  public submit() {
    this.current?.submit();
  }

  public getAnswer() {
    return this.current?.getAnswer();
  }

  public clearTemplate() {
    if (!this.current) return;
    this.current.destroyTemplate();
    this.removeChild(this.current);
    this.current = undefined;
  }

  public resize(width: number, height: number) {
    this.viewportWidth = width;
    this.viewportHeight = height;
    this.layout(width, height);
  }



  private layout(width: number, height: number) {
    if (this.current) {
      this.current.position.set(width * 0.5, height * 0.5);
    }
  }
}
