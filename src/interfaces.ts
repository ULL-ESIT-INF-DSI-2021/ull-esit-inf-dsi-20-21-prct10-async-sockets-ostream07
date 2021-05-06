import {Color, Note} from './note';

export type RequestType = {
  type: 'add' | 'update' | 'remove' | 'read' | 'list';
  user: string;
  title?: string;
  body?: string;
  color?: Color;
}

export type ResponseType = {
  type: 'add' | 'update' | 'remove' | 'read' | 'list' | 'error';
  success: boolean;
  notes?: Note[];
  errorMessage?: string;
}

/**
 * @interface IndexEntry, entries of the index
 */
export interface IndexEntry {
  title: string;
  fileName: string;
}

/**
 * @interface NoteIndex, index with all the entries
 */
export interface NoteIndex {
  index: IndexEntry[];
}
