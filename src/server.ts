import * as net from 'net';
import { RequestType, ResponseType } from './interfaces';
import { RequestEmitter } from './requestEmitter';
import { addNote, deleteNote, listNote, readNote, updateNote } from './serverActions';

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
    connection.write(JSON.stringify(resp) + '\0');
  });
});

server.listen(60300);