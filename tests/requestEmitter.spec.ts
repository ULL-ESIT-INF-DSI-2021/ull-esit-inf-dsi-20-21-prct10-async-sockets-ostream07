/*
import 'mocha';
import {expect} from 'chai';
import {EventEmitter} from 'events';
import {RequestEmitter} from '../src/requestEmitter';

describe('RequestEmitter', () => {
  it('Should emit a message event once it gets a complete message', (done) => {
    const socket = new EventEmitter();
    const client = new RequestEmitter(socket);

    client.on('request', (message) => {
      expect(message).to.be.eql({'type': 'read', 'user': 'edusegre'});
      done();
    });

    socket.emit('data', '{"type": "read", "user": "edusegre');
    socket.emit('data', '\0');
  });
});
*/