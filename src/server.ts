import * as net from 'net';
import { RequestType, ResponseType } from './interfaces';
import { RequestEmitter } from './requestEmitter';
import { addNote, deleteNote, listNote, readNote, updateNote } from './serverActions';

/**
 * @function checkFields, checks if the givens parameters are strings 
 * before processing the response on the server
 * @param req variable of type RequestType
 * @param checkTitle boolean that checks if the given title is a string
 * @param checkBody boolean that checks if the given text of the note is a 
 * string
 * @param checkColor boolean that checks if the given color of the note is a 
 * string
 * @returns false if any of the parameters is not a string and true in other case.
 */
function checkFields(req: RequestType, checkTitle: boolean, checkBody: boolean, checkColor: boolean): boolean {
  if (checkTitle && typeof req.title !== 'string') {
    return false;
  }
  if (checkBody && typeof req.body !== 'string') {
    return false;
  }
  if (checkColor && typeof req.color !== 'string') {
    return false;
  }

  return true;
}

/**
 * @function processRequest, process the client petition and gives a response
 * @param req variable of type RequestType
 * @returns a ResponseType with the apropiated message
 */
function processRequest(req: RequestType): ResponseType {
  if (typeof req.type === 'string' && typeof req.user === 'string') {
    switch (req.type) {
      case 'add':
        if (checkFields(req, true, true, true)) {
          return addNote(req);
        } else {
          return { type: 'error', success: false, errorMessage: 'Missing params' };
        }
      case 'update':
        if (checkFields(req, true, true, true)) {
          return updateNote(req);
        } else {
          return { type: 'error', success: false, errorMessage: 'Missing params' };
        }
      case 'remove':
        if (checkFields(req, true, false, false)) {
          return deleteNote(req);
        } else {
          return { type: 'error', success: false, errorMessage: 'Missing title' };
        }
      case 'read':
        if (checkFields(req, true, false, false)) {
          return readNote(req);
        } else {
          return { type: 'error', success: false, errorMessage: 'Missing title' };
        }
      case 'list':
        return listNote(req);
      default:
        return { type: 'error', success: false, errorMessage: 'Bad request type' };
    }
  } else {
    return { type: 'error', success: false, errorMessage: 'Malformed request' };
  }
}

const server = net.createServer((connection) => {
  const listener = new RequestEmitter(connection);
  listener.on('request', (req) => {
    const resp = processRequest(req);
    connection.write(JSON.stringify(resp));
    connection.end();
  });
});

server.listen(60300);