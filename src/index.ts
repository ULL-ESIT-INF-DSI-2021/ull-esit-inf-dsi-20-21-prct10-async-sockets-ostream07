import * as yargs from 'yargs';
import chalk from "chalk";
import {Note} from './note';
import { loadNotes, removeNote, saveNote} from './fileIO';
import { getNoteByTitle, getColorByString, getColorizer } from "./utils";

/**
 * @api Yarg for the command add
 */
yargs.command({
  command: 'add',
  describe: 'Add a new note',
  builder: {
    title: {
      describe: 'Note title',
      demandOption: true,
      type: 'string',
    },
    user: {
      describe: 'Notes owner',
      demandOption: true,
      type: 'string',
    },
    body: {
      describe: 'Note body',
      demandOption: true,
      type: 'string',
    },
    color: {
      describe: 'Note color',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.title === 'string' && typeof argv.user === 'string' && 
          typeof argv.body === 'string' && typeof argv.color === 'string') {

      let userNotes = loadNotes(argv.user);
      if (!getNoteByTitle(argv.title, userNotes)) {
        let color = getColorByString(argv.color);
        if (color) {
          let note = new Note(argv.title, color, argv.body);
          saveNote(argv.user, note);
          console.log(chalk.green('New note added!'));
        } else {
          console.log(chalk.red('Invalid color'));
          console.log(chalk.red('Admited colors: Red, Blue, Green, Yellow, Black'));
        }
      } else {
        console.log(chalk.red('Error! Already exist a note with this title'));
      }
    } else {
      console.log(chalk.red('It is necesary to give all the arguments'));
    }
  },
});

/**
 * @api Yarg for the command modify
 */
yargs.command({
  command: 'modify',
  describe: 'Modify an existing note',
  builder: {
    title: {
      describe: 'Note title',
      demandOption: true,
      type: 'string',
    },
    user: {
      describe: 'Notes owner',
      demandOption: true,
      type: 'string',
    },
    body: {
      describe: 'Note body',
      demandOption: true,
      type: 'string',
    },
    color: {
      describe: 'Note color',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.title === 'string' && typeof argv.user === 'string' && 
              typeof argv.body === 'string' && typeof argv.color === 'string') {
      
      let userNotes = loadNotes(argv.user);
      if (getNoteByTitle(argv.title, userNotes)) {
        let color = getColorByString(argv.color);
        if (color) {
          let note = new Note(argv.title, color, argv.body);
          saveNote(argv.user, note);
          console.log(chalk.green('Note modified correctly!'));
        } else {
          console.log(chalk.red('Invalid color'));
          console.log(chalk.red('Admited colors: Red, Blue, Green, Yellow, Black'));
        }
      } else {
        console.log(chalk.red('Error! The note does not exist'));
      }
    } else {
      console.log(chalk.red('It is necesary to give all the arguments'));
    }
  },
});

/**
 * @api Yarg for the command remove
 */
yargs.command({
  command: 'remove',
  describe: 'Remove an existing note',
  builder: {
    title: {
      describe: 'Note title',
      demandOption: true,
      type: 'string',
    },
    user: {
      describe: 'Notes owner',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.title === 'string' && typeof argv.user === 'string') {
      if (removeNote(argv.user, argv.title)) {
        console.log(chalk.green('Correctly removed'));
      } else {
        console.error(chalk.red('The note does not exist!'));
      }
    } 
  },
});

/**
 * @api Yarg for the command list
 */
yargs.command({
  command: 'list',
  describe: 'List all notes for an user',
  builder: {
    user: {
      describe: 'Notes owner',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.user === 'string') {
      let userNotes = loadNotes(argv.user);
      console.log(chalk.green(`Listing notes for user ${argv.user} ...`));
      for (const note of userNotes) {
        let colorizer = getColorizer(note);
        console.log(colorizer(note.getTitle()));
      }
    } else {
      console.log(chalk.red('Error, invalid argument'));
    }
  },
});

/**
 * @api Yarg for the command read
 */
yargs.command({
  command: 'read',
  describe: 'Read an existing note of an user',
  builder: {
    title: {
      describe: 'Note title',
      demandOption: true,
      type: 'string',
    },
    user: {
      describe: 'Notes owner',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.title === 'string' && typeof argv.user === 'string') {
      let userNotes = loadNotes(argv.user);
      let note = getNoteByTitle(argv.title, userNotes);
      if (note) {
        let colorizer = getColorizer(note);
        console.log(chalk.green('Your notes:'));
        console.log(colorizer(note.getTitle()));
        console.log(colorizer(note.getText()));
      } else {
        console.log(chalk.red(`The user ${argv.user} does not have any notes`));
      }
    } else {
      console.log(chalk.red('Invalid arguments!'));
    }
  },
});

yargs.parse();