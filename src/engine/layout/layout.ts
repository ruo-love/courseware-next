export const DESIGN_WIDTH = 1024;
export const DESIGN_HEIGHT = 768;

export type ScreenLayout = {
  viewportWidth: number;
  viewportHeight: number;
  designWidth: number;
  designHeight: number;
  scale: number;
  offsetX: number;
  offsetY: number;
};

export function createScreenLayout(
  viewportWidth: number,
  viewportHeight: number,
): ScreenLayout {
  const scale = Math.min(
    viewportWidth / DESIGN_WIDTH,
    viewportHeight / DESIGN_HEIGHT,
  );
  const offsetX = (viewportWidth - DESIGN_WIDTH * scale) * 0.5;
  const offsetY = (viewportHeight - DESIGN_HEIGHT * scale) * 0.5;

  return {
    viewportWidth,
    viewportHeight,
    designWidth: DESIGN_WIDTH,
    designHeight: DESIGN_HEIGHT,
    scale,
    offsetX,
    offsetY,
  };
}
