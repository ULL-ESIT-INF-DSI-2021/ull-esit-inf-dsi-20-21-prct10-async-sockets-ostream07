import {EventEmitter} from 'events';

/**
 * @class RequestEmitter, the client will work with this class to be able to 
 * communicate correctly with the server, in addition with that, we can fix 
 * the problem of receiving messages in chunks
 */
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