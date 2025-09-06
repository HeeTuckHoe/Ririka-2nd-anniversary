export interface Card {
  id: number;
  image: string;
}

const imageCount = 35; // change this to match your number of images

export const cards: Card[] = Array.from({ length: imageCount }, (_, i) => ({
  id: i + 1,
  image: `src/img/cards/card${i + 1}.png`,
}));
