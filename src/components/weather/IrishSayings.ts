import type { WeatherConditionType } from './types';

export const IRISH_SAYINGS: Record<WeatherConditionType, string[]> = {
  sunny: [
    "Grand stretch in the evening!",
    "We're blessed with the weather today!",
    "The sun is splittin' the stones!",
    "'Tis a fine soft day, thanks be to God.",
    "Lovely day for it, so it is!",
    "The weather's been mighty altogether!",
    "Sure, we'll have to go to the beach!",
    "God's been good to us today!",
    "The fine weather won't last, but enjoy it!",
    "A rare aul day!",
  ],
  rainy: [
    "Soft day, thank God.",
    "Sure it's only a bit of mist.",
    "We needed the rain anyway.",
    "If you don't like the weather, wait five minutes.",
    "It's lashing out there!",
    "The rain is coming down in sheets!",
    "Ah sure, it's grand drying weather inside!",
    "The farmers will be happy anyway.",
    "Sure what else would you expect?",
    "Put on the kettle, we're going nowhere!",
    "It's a four-jumper day!",
    "The rain is horizontal!",
  ],
  cloudy: [
    "Ah sure, it could be worse.",
    "The sun will be out later, maybe.",
    "Grand drying weather if the rain stays away.",
    "Fierce mild out there.",
    "At least it's not raining... yet.",
    "There's a bit of brightness trying to get through.",
    "It's neither here nor there.",
    "Could go either way, so it could.",
    "The sky's thinking about what to do.",
    "A typical Irish day, like.",
  ],
  stormy: [
    "The wind would skin ya!",
    "Stay inside with a cup of tea.",
    "There's a fierce wind out there!",
    "Hold onto your hat!",
    "The weather's gone wild altogether!",
    "Sure you wouldn't put a dog out in it.",
    "It's blowing a hoolie!",
    "The trees are doing a dance!",
    "Jesus, Mary, and Joseph, what weather!",
    "Stay away from the windows!",
  ],
  snowy: [
    "The country's gone to pot!",
    "We'll all be snowed in!",
    "Sure the kids will be delighted.",
    "Time to build a snowman, so it is!",
    "The schools will be closed for a week!",
    "Get the bread and milk!",
    "It's like Narnia out there!",
    "The snow is fierce heavy!",
    "We're not built for this weather!",
    "Even the sheep look confused!",
  ],
  foggy: [
    "You couldn't see your hand in front of your face.",
    "Mysterious weather, like.",
    "The fog's come down like a blanket.",
    "Drive careful now, won't ya?",
    "It's like pea soup out there.",
    "Very atmospheric altogether.",
    "The fog's thick as a ditch.",
    "Sure you'd lose yourself walking to the shop.",
    "The world's disappeared!",
    "Visibility is absolutely brutal.",
  ],
};

// Generic sayings that can be used as fallback or for any weather
export const GENERIC_IRISH_SAYINGS = [
  "Sure, isn't it grand to be alive!",
  "There's no bad weather, only bad clothing.",
  "Whatever the weather, we'll weather the weather!",
  "Tomorrow's another day, so it is.",
  "Ah well, what can you do?",
];

// Get a random saying for the given weather condition
export function getIrishSaying(condition: WeatherConditionType): string {
  const sayings = IRISH_SAYINGS[condition];
  if (!sayings || sayings.length === 0) {
    return GENERIC_IRISH_SAYINGS[Math.floor(Math.random() * GENERIC_IRISH_SAYINGS.length)];
  }
  return sayings[Math.floor(Math.random() * sayings.length)];
}

// Get a consistent saying for a given day (using date as seed)
export function getDailySaying(condition: WeatherConditionType, date: Date = new Date()): string {
  const sayings = IRISH_SAYINGS[condition];
  if (!sayings || sayings.length === 0) {
    const index = date.getDate() % GENERIC_IRISH_SAYINGS.length;
    return GENERIC_IRISH_SAYINGS[index];
  }
  // Use date to create a pseudo-random but consistent index
  const seed = date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
  const index = seed % sayings.length;
  return sayings[index];
}
