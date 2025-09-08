export interface Card {
  id: number;
  image: string;
}

const imageCount = 36;

export const cards: Card[] = Array.from({ length: imageCount }, (_, i) => ({
  id: i + 1,
  image: `/cards/card${i + 1}.png`,
}));
