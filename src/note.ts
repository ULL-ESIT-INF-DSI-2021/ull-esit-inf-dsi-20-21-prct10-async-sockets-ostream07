
export enum Color { BLUE = 'blue', RED = 'red', YELLOW = 'yellow', BLACK = 'black', GREEN = 'green' };

/**
 * @class Note, contains the attributes and methods of the Note class
 */
export class Note {
  /**
   * @constructor Initialize the class attributes
   * @param title Title of a note
   * @param color Color of a note
   * @param text Text or body of a note 
   */
  constructor(private title: string, private color: Color, private text: string) {
  }
  /**
   * Getter of the note title
   * @returns the title of a note
   */
  getTitle(): string {
    return this.title;
  }
  /**
   * Getter of the note color
   * @returns the color of a note
   */
  getColor(): Color {
    return this.color;
  }
  /**
   * Getter of the note text or body
   * @returns the text or body of a note
   */
  getText(): string {
    return this.text;
  }
} 