export type RGBAColor = {
  red: number;
  green: number;
  blue: number;
  alpha: number;
};

export type ImageRowInfo = [number, [number, number]];

export type ClippedInfo = {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
};
