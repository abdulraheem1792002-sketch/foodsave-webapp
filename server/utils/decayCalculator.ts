export interface DecayResult {
  currentDiscountPercent: number;
  currentDiscountedPricePkr: number;
  decaySchedule: { hoursRemaining: number; discountPercent: number; pricePkr: number }[];
}

export function calculateTimeDecay(
  originalPricePkr: number,
  hoursRemaining: number,
  category: 'grocery' | 'bakery' | 'restaurant'
): DecayResult {
  // Category decay multipliers
  const categoryBonus = category === 'bakery' ? 5 : category === 'restaurant' ? 10 : 0;

  let discountPercent = 30;
  if (hoursRemaining < 1) {
    discountPercent = 75 + categoryBonus;
  } else if (hoursRemaining < 2) {
    discountPercent = 60 + categoryBonus;
  } else if (hoursRemaining < 3) {
    discountPercent = 45 + categoryBonus;
  } else {
    discountPercent = 30 + categoryBonus;
  }

  discountPercent = Math.min(85, Math.max(25, discountPercent));

  const currentDiscountedPricePkr = Math.round(originalPricePkr * (1 - discountPercent / 100));

  // Generate decay schedule points for graph / schedule preview
  const hoursCheckpoints = [4, 3, 2, 1, 0.5];
  const decaySchedule = hoursCheckpoints.map((hrs) => {
    let disc = 30;
    if (hrs < 1) disc = 75 + categoryBonus;
    else if (hrs < 2) disc = 60 + categoryBonus;
    else if (hrs < 3) disc = 45 + categoryBonus;
    else disc = 30 + categoryBonus;
    disc = Math.min(85, Math.max(25, disc));

    return {
      hoursRemaining: hrs,
      discountPercent: disc,
      pricePkr: Math.round(originalPricePkr * (1 - disc / 100)),
    };
  });

  return {
    currentDiscountPercent: discountPercent,
    currentDiscountedPricePkr,
    decaySchedule,
  };
}
