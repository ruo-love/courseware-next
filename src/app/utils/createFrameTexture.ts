import { Rectangle, Texture } from "pixi.js";

export type FrameRect = {
  x: number;
  y: number;
  w: number;
  h: number;
};

export function createFrameTexture(
  atlas: string,
  rect: FrameRect,
): Texture {
  const atlasTexture = Texture.from(atlas);
  const { x, y, w, h } = rect;
  return new Texture({
    source: atlasTexture as any,
    frame: new Rectangle(
      x,
      y,
      w,
      h,
    )
  });
}
