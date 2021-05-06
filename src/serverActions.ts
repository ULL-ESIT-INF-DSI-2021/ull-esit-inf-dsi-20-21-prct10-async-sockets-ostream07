import { Note } from './note';
import { RequestType, ResponseType } from "./interfaces";
import { loadNotes, removeNote, saveNote } from './fileIO';
import { getNoteByTitle, getColorByString, getColorizer } from "./utils";

export function addNote(req: RequestType): ResponseType {
  let userNotes = loadNotes(req.user);
  if (!getNoteByTitle(req.title, userNotes)) {
    let color = getColorByString(req.color);
    if (color) {
      let note = new Note(req.title, color, req.body);
      saveNote(req.user, note);
      return {success: true, type: 'add'};
    } else {
      return {success: false, type: 'error', errorMessage: 'Invalid color\nAdmited colors: Red, Blue, Green, Yellow, Black'};
    }
  } else {
    return {success: false, type: 'error', errorMessage: 'Error! Already exist a note with this title'};
  }
}

export function deleteNote(req: RequestType): ResponseType {
  if (removeNote(req.user, req.title)) {
    return {success: true, type: 'remove'};
  } else {
    return {success: false, type: 'error', errorMessage: 'The note does not exist!'};
  }
}

export function updateNote(req: RequestType): ResponseType {
  let userNotes = loadNotes(req.user);
  if (getNoteByTitle(req.title, userNotes)) {
    let color = getColorByString(req.color);
    if (color) {
      let note = new Note(req.title, color, req.body);
      saveNote(req.user, note);
      return {success: true, type: 'update'};
    } else {
      return {success: false, type: 'error', errorMessage: 'Invalid color\nAdmited colors: Red, Blue, Green, Yellow, Black'};
    }
  } else {
    return {success: false, type: 'error', errorMessage: 'The note does not exist!'};
  }
}

export function listNote(req: RequestType): ResponseType {
  let userNotes = loadNotes(req.user);
  return {success: true, type: 'list', notes: userNotes};
}

export function readNote(req: RequestType): ResponseType {
  let userNotes = loadNotes(req.user);
  let note = getNoteByTitle(req.title, userNotes);
  if (note) {
    return {success: true, type: 'read', notes: [note]};
  } else {
    return {success: false, type: 'error', errorMessage: `The user ${req.user} does not have any notes`};
  }
}