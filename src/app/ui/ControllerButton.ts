import { Container, Graphics } from "pixi.js";
import { Label } from "./Label";

export default function ControllerButton(text: string) {
  const width = 200;
  const height = 56;
  const radius = 14;

  const bg = new Graphics()
    .roundRect(0, 0, width, height, radius)
    .fill({ color: 0xec1561 });

  const label = new Label({
    text,
    style: { fill: 0xffffff, fontSize: 24 },
  });
  label.position.set(width / 2, height / 2);

  const container = new Container();
  container.addChild(bg, label);
  container.pivot.set(width / 2, height / 2);
  container.eventMode = "static";

  return container;
}
