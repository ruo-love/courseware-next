import { Container, Graphics } from "pixi.js";

import { Label } from "../../ui/Label";
import { BaseTemplate } from "../BaseTemplate";

type TrueFalseData = {
  question?: string;
};

export class TrueFalseTemplate extends BaseTemplate {
  private submitted = false;
  private trueBtn!: Graphics;
  private falseBtn!: Graphics;

  public init(data: unknown) {
    const payload = data as TrueFalseData;
    const question = payload.question ?? "示例题：地球是圆的？";

    const questionLabel = new Label({
      text: question,
      style: {
        fill: 0xffffff,
        fontSize: 32,
      },
    });
    questionLabel.y = -160;
    this.contentLayer.addChild(questionLabel);

    const trueButton = this.createTFButton("对", "true");
    trueButton.x = -140;
    trueButton.y = 40;
    this.contentLayer.addChild(trueButton);

    const falseButton = this.createTFButton("错", "false");
    falseButton.x = 140;
    falseButton.y = 40;
    this.contentLayer.addChild(falseButton);

  }
  public reset() {
    
  }

  public destroyTemplate() {
    this.removeChildren();
    this.destroy({ children: true });
  }

  private createTFButton(text: string, value: "true" | "false") {
    const width = 200;
    const height = 120;
    const radius = 18;

    const bg = new Graphics()
      .roundRect(0, 0, width, height, radius)
      .fill({ color: 0x2b2b2b });

    const label = new Label({
      text,
      style: { fill: 0xffffff, fontSize: 36 },
    });
    label.position.set(width / 2, height / 2);

    const container = new Container();
    container.addChild(bg, label);
    container.pivot.set(width / 2, height / 2);

    container.eventMode = "static";
    container.on("pointertap", () => this.select(value));

    if (value === "true") {
      this.trueBtn = bg;
    } else {
      this.falseBtn = bg;
    }

    return container;
  }

  private select(value: "true" | "false") {
    if (this.submitted) return;
    if (this.trueBtn && this.falseBtn) {
      this.trueBtn.tint = value === "true" ? 0x3a7afe : 0xffffff;
      this.falseBtn.tint = value === "false" ? 0x3a7afe : 0xffffff;
    }
  }
}
