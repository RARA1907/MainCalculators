import { Metadata } from 'next';
import { generateCalculatorStructuredData, generateCalculatorMetaTags } from '../utils/structured-data';

const structuredData = generateCalculatorStructuredData(
  'Dice Roller | RPG Dice Calculator | DnD Dice Roller',
  'Roll virtual dice for tabletop RPGs, board games, and more. Features d4, d6, d8, d10, d12, d20, d100, and custom dice with modifiers.'
);

export const metadata: Metadata = generateCalculatorMetaTags(
  'Dice Roller | RPG Dice Calculator | DnD Dice Roller',
  'Roll virtual dice for tabletop RPGs, board games, and more. Features d4, d6, d8, d10, d12, d20, d100, and custom dice with modifiers.',
  ["dice roller","rpg dice calculator","dnd dice roller","d20 roller","virtual dice","dice calculator","tabletop dice","probability calculator"],
  structuredData
);