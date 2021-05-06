import {EventEmitter} from 'events';

export class RequestEmitter extends EventEmitter {
  constructor(connection: EventEmitter) {
    super();

    let wholeRequest = '';
    connection.on('data', (dataChunk) => {
      wholeRequest += dataChunk;

      let messageLimit = wholeRequest.indexOf('\0');
      if (messageLimit !== -1) {
        wholeRequest = wholeRequest.substring(0, messageLimit);
        this.emit('request', JSON.parse(wholeRequest));
      }
    });
  }
}