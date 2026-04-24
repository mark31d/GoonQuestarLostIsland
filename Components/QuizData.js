export const QUESTIONS = [
  {id: 1, question: 'Where did pirates usually travel?', options: ['Deserts', 'Oceans', 'Mountains'], answer: 1},
  {id: 2, question: 'What was a pirate ship used for?', options: ['Farming', 'Traveling and raids', 'Flying'], answer: 1},
  {id: 3, question: 'Who led a pirate crew?', options: ['Captain', 'Soldier', 'Merchant'], answer: 0},
  {id: 4, question: 'What did pirates search for?', options: ['Books', 'Treasure and supplies', 'Animals'], answer: 1},
  {id: 5, question: 'Where did pirates often hide?', options: ['Cities', 'Islands', 'Forests'], answer: 1},
  {id: 6, question: 'What is a pirate flag called?', options: ['Blue flag', 'Royal sign', 'Jolly Roger'], answer: 2},
  {id: 7, question: 'What was inside many pirate chests?', options: ['Clothes', 'Food', 'Valuable items'], answer: 2},
  {id: 8, question: 'What tool helped pirates navigate?', options: ['Mirror', 'Compass', 'Clock'], answer: 1},
  {id: 9, question: 'What did pirates drink on long trips?', options: ['Juice', 'Tea', 'Water or rum'], answer: 2},
  {id: 10, question: 'What kind of life did pirates have?', options: ['Safe', 'Easy', 'Dangerous'], answer: 2},
  {id: 11, question: 'Why did pirates need maps?', options: ['For drawing', 'For navigation', 'For decoration'], answer: 1},
  {id: 12, question: 'What was a common pirate weapon?', options: ['Spoon', 'Sword', 'Stick'], answer: 1},
  {id: 13, question: 'What did pirates wear?', options: ['Armor', 'Explorer-style clothes', 'Suits'], answer: 1},
  {id: 14, question: 'What is a crew?', options: ['A group of pirates', 'A ship', 'A treasure'], answer: 0},
  {id: 15, question: 'Where did pirates sleep?', options: ['Hotels', 'Ships', 'Castles'], answer: 1},
  {id: 16, question: 'What did pirates use to store items?', options: ['Bags', 'Chests', 'Boxes only'], answer: 1},
  {id: 17, question: 'Why were islands important to pirates?', options: ['For rest', 'For hiding and supplies', 'For farming'], answer: 1},
  {id: 18, question: 'What did pirates often write?', options: ['Letters', 'Logs or notes', 'Books'], answer: 1},
  {id: 19, question: 'What was a lookout\'s job?', options: ['Cook', 'Watch for danger', 'Fix the ship'], answer: 1},
  {id: 20, question: 'What did storms bring?', options: ['Fun', 'Danger', 'Nothing'], answer: 1},
  {id: 21, question: 'What was a pirate journal?', options: ['A weapon', 'A personal record', 'A map'], answer: 1},
  {id: 22, question: 'What did pirates eat?', options: ['Fresh meals', 'Stored food', 'Only fish'], answer: 1},
  {id: 23, question: 'Why did pirates form crews?', options: ['To travel together', 'To fight each other', 'To trade'], answer: 0},
  {id: 24, question: 'What was hidden on islands?', options: ['Buildings', 'Treasure and secrets', 'Roads'], answer: 1},
  {id: 25, question: 'What helped pirates find direction?', options: ['Stars and compass', 'Fire', 'Sand'], answer: 0},
  {id: 26, question: 'What is an artifact?', options: ['A weapon', 'A found object with history', 'Food'], answer: 1},
  {id: 27, question: 'Why are pirate stories important?', options: ['For fun only', 'To understand their life', 'For games'], answer: 1},
  {id: 28, question: 'What did pirates leave behind?', options: ['Nothing', 'Clues and objects', 'Cities'], answer: 1},
  {id: 29, question: 'What is exploration?', options: ['Traveling and discovering', 'Sleeping', 'Fighting'], answer: 0},
  {id: 30, question: 'What is the goal of this app?', options: ['To win money', 'To explore and learn', 'To compete'], answer: 1},
];

export function getResultMessage(score) {
  if (score === 30) return 'Perfect score. The island holds no secrets from you.';
  if (score >= 21) return 'Well done. You know this island well.';
  if (score >= 11) return 'Nice work. Every answer brings you closer to understanding the island. Keep exploring.';
  return 'Keep exploring. Every answer is a step forward.';
}
