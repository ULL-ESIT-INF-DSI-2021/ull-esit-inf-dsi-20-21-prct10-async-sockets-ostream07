import * as yargs from 'yargs';
import chalk from "chalk";
import {Note} from './note';
import { getNoteByTitle, getColorByString, getColorizer } from "./utils";
import { RequestType, ResponseType } from './interfaces';
import * as net from 'net';


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
      
      const color = getColorByString(argv.color);
      if(color) {
        const req: RequestType = {
          type: 'add',
          user: argv.user,
          title: argv.title,
          body: argv.body,
          color: color
        };
        const client = net.connect({port: 60300});
        client.write(JSON.stringify(req) + '\0');

        let wholeData = '';
        client.on('data', (dataChunk) => {
          wholeData += dataChunk;
        });
        
        client.on('end', () => {
          const resp: ResponseType = JSON.parse(wholeData);
          if(resp.success) {
            console.log(chalk.green('New note added!'));
          } else {
            console.log(chalk.red(resp.errorMessage));
          }
        });
      } else {
        console.log(chalk.red('Invalid color'));
        console.log(chalk.red('Admited colors: Red, Blue, Green, Yellow, Black'));
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
  command: 'update',
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
      
      const color = getColorByString(argv.color);
      if (color) {
        const req: RequestType = {
          type: 'update',
          user: argv.user,
          title: argv.title,
          body: argv.body,
          color: color
        };
        const client = net.connect({ port: 60300 });
        client.write(JSON.stringify(req) + '\0');

        let wholeData = '';
        client.on('data', (dataChunk) => {
          wholeData += dataChunk;
        });

        client.on('end', () => {
          const resp: ResponseType = JSON.parse(wholeData);
          if (resp.success) {
            console.log(chalk.green('Note modified correctly!'));
          } else {
            console.log(chalk.red(resp.errorMessage));
          }
        });
      } else {
        console.log(chalk.red('Invalid color'));
        console.log(chalk.red('Admited colors: Red, Blue, Green, Yellow, Black'));
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
      
      const req: RequestType = {
        type: 'remove',
        user: argv.user,
        title: argv.title
      };
      const client = net.connect({ port: 60300 });
      client.write(JSON.stringify(req) + '\0');

      let wholeData = '';
      client.on('data', (dataChunk) => {
        wholeData += dataChunk;
      });

      client.on('end', () => {
        const resp: ResponseType = JSON.parse(wholeData);
        if (resp.success) {
          console.log(chalk.green('Correctly removed'));
        } else {
          console.log(chalk.red(resp.errorMessage));
        }
      });
    } else {
      console.log(chalk.red('Missing title or user'));
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
      const req: RequestType = {
        type: 'list',
        user: argv.user
      };
      const client = net.connect({ port: 60300 });
      client.write(JSON.stringify(req) + '\0');

      let wholeData = '';
      client.on('data', (dataChunk) => {
        wholeData += dataChunk;
      });

      client.on('end', () => {
        const resp: ResponseType = JSON.parse(wholeData);
        if (resp.success) {
          console.log(chalk.green(`Listing notes for user ${argv.user} ...`));
          let userNotes = resp.notes;
          for (const noteJSON of <any[]>userNotes) {
            const note = new Note(noteJSON.title, noteJSON.color, noteJSON.text);
            let colorizer = getColorizer(note);
            console.log(colorizer(note.getTitle()));
          }
        } else {
          console.log(chalk.red(resp.errorMessage));
        }
      });
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
      
      const req: RequestType = {
        type: 'read',
        user: argv.user,
        title: argv.title
      };
      const client = net.connect({ port: 60300 });
      client.write(JSON.stringify(req) + '\0');

      let wholeData = '';
      client.on('data', (dataChunk) => {
        wholeData += dataChunk;
      });

      client.on('end', () => {
        const resp: ResponseType = JSON.parse(wholeData);
        if (resp.success) {
          const noteJSON: any = resp.notes[0];
          const note = new Note(noteJSON.title, noteJSON.color, noteJSON.text);
          let colorizer = getColorizer(note);
          console.log(chalk.green('Your note:'));
          console.log(colorizer(note.getTitle()));
          console.log(colorizer(note.getText()));
        } else {
          console.log(chalk.red(resp.errorMessage));
        }
      });
    } else {
      console.log(chalk.red('Invalid arguments!'));
    }
  },
});

yargs.parse();