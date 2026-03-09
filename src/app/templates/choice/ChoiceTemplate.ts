import { Container, Graphics } from "pixi.js";

import { Label } from "../../ui/Label";
import { BaseTemplate } from "../BaseTemplate";

type ChoiceData = {
  question?: string;
  options?: string[];
};

export class ChoiceTemplate extends BaseTemplate {
  public static override assetBundles: string[] = ["choice"];

  private optionButtons: Graphics[] = [];
  private submitted = false;
  public init(data: unknown) {
    const payload = data as ChoiceData;
    const question = payload.question ?? "示例题：2 + 2 = ?";
    const options = payload.options ?? ["3", "4", "5", "6"];

    const questionLabel = new Label({
      text: question,
      style: {
        fill: 0xffffff,
        fontSize: 32,
      },
    });
    questionLabel.y = -220;
    this.contentLayer.addChild(questionLabel);

    options.forEach((text, i) => {
      const btn = this.createOptionButton(text, i);
      btn.y = -120 + i * 90;
      this.contentLayer.addChild(btn);
    });
  }

  public reset() {}

  public destroyTemplate() {
    this.removeChildren();
    this.destroy({ children: true });
  }

  private createOptionButton(text: string, index: number) {
    const width = 520;
    const height = 64;
    const radius = 16;

    const bg = new Graphics()
      .roundRect(0, 0, width, height, radius)
      .fill({ color: 0x2b2b2b });

    const label = new Label({
      text,
      style: { fill: 0xffffff, fontSize: 24 },
    });
    label.position.set(width / 2, height / 2);

    const container = new Container();
    container.addChild(bg, label);
    container.pivot.set(width / 2, height / 2);
    container.x = 0;
    container.y = 0;

    container.eventMode = "static";
    container.on("pointertap", () => this.selectOption(index));

    this.optionButtons.push(bg);
    return container;
  }

  private selectOption(index: number) {
    if (this.submitted) return;
    this.optionButtons.forEach((btn, i) => {
      btn.tint = i === index ? 0x3a7afe : 0xffffff;
    });
  }
}
