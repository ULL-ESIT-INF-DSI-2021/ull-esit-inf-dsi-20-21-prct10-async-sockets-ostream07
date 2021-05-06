import chalk from 'chalk';
import { NoteIndex } from './interfaces';
import {Note, Color} from './note';

/**
 * @function getNoteByTitle, checks if a note exists looking for the title
 * @param title title of the note
 * @param notes vector of notes
 * @returns the note if the title exist, or false if the title doesnot appear
 */
export function getNoteByTitle(title: string, notes: Note[]) {
  for (const note of notes) {
    if(note.getTitle() === title) {
      return note;
    }
  }
  return false;
}

/**
 * @function searchEntryIndex, looks for an entry of the user index
 * @param title title of the note
 * @param index index of the user
 * @returns the correspondent entry to the title given, or false in other case
 */
export function searchEntryIndex(title: string, index: NoteIndex) {
  for (const entry of index.index) {
    if(entry.title === title) {
      return entry;
    }
  }
  return false;
}

/**
 * @function getColorByString, received a color int a string and returns the
 * crrespondent color defined into de enum Color
 * @param color color of the note
 * @returns the color defined into the enum Color, or false if the color is 
 * undefined
 */
export function getColorByString(color: string) {
  switch(color.toLowerCase()) {
    case 'red':
      return Color.RED;
    
    case 'blue':
      return Color.BLUE;

    case 'green':
      return Color.GREEN;

    case 'yellow':
      return Color.YELLOW;

    case 'black':
      return Color.BLACK;

    default:
      return false;
  }
}

/**
 * @function getColorizer, uses the API chalk to paint with differents color
 * @param note a note of a user
 * @returns the note paint with the select color, or in white by default
 */
export function getColorizer(note: Note) {
  switch(note.getColor()) {
    case Color.RED:
      return chalk.red;
    
    case Color.BLUE:
      return chalk.blue;

    case Color.GREEN:
      return chalk.green;

    case Color.YELLOW:
      return chalk.yellow;

    case Color.BLACK:
      return chalk.black;

    default:
      return chalk.white;
  }
}