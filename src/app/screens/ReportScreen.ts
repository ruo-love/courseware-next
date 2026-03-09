import { Label } from "../ui/Label";
import { BaseScreen } from "../../engine/navigation/BaseScreen";

/** 报告页 */
export class ReportScreen extends BaseScreen {
  private title: Label;
  private hint: Label;

  constructor() {
    super();

    this.title = new Label({
      text: "报告页",
      style: { fill: 0xffffff, fontSize: 36 },
    });
    this.addChild(this.title);

    this.hint = new Label({
      text: "这里展示答题报告",
      style: { fill: 0xffffff, fontSize: 20 },
    });
    this.addChild(this.hint);
  }

  public resize(width: number, height: number) {
    this.title.position.set(width * 0.5, height * 0.5 - 40);
    this.hint.position.set(width * 0.5, height * 0.5 + 10);
  }
}
