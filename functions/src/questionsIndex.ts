export const EI: Number[] = [
  1,
  5,
  9,
  13,
  17,
  21,
  25,
  29,
  33,
  37,
  41,
  45,
  49,
  53,
  57,
  61,
  65,
  69,
  73,
  77,
  81
];
export const JP: Number[] = [
  4,
  8,
  12,
  16,
  20,
  24,
  28,
  32,
  36,
  40,
  44,
  48,
  52,
  56,
  60,
  64,
  68,
  72,
  76,
  80,
  84,
  87,
  90,
  92
];
export const SN: Number[] = [
  2,
  6,
  10,
  14,
  18,
  22,
  26,
  30,
  34,
  38,
  42,
  46,
  50,
  54,
  58,
  62,
  66,
  70,
  74,
  78,
  82,
  85,
  88,
  91,
  93,
  94
];
export const TF: Number[] = [
  3,
  7,
  11,
  15,
  19,
  23,
  27,
  31,
  35,
  39,
  43,
  47,
  51,
  55,
  59,
  63,
  67,
  71,
  75,
  79,
  83,
  86,
  89
];

export function twoRandomItemsFromArray(arr: Array<any>) {
  function getOne() {
    return arr[Math.floor(Math.random() * arr.length)];
  }
  const first = getOne();
  let second = getOne();
  while (first === second) {
    second = getOne();
  }
  return [first, second];
}

export function get8Questions(): Number[] {
  const ei = twoRandomItemsFromArray(EI);
  const jp = twoRandomItemsFromArray(JP);
  const sn = twoRandomItemsFromArray(SN);
  const tf = twoRandomItemsFromArray(TF);
  const final = [...ei, ...jp, ...sn, ...tf];
  final.sort((a, b) => a - b);
  return final;
}
