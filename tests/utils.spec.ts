import "mocha";
import { expect } from "chai";
import { getNoteByTitle, searchEntryIndex, getColorByString } from "../src/utils";
import { Color, Note } from "../src/note";
import { IndexEntry, NoteIndex } from "../src/interfaces";

describe("utils function tests", () => {
  it("it search the title of a vector with some notes", () => {
    const note1 = new Note("note1", Color.YELLOW, "yellow test");
    const note2 = new Note("note2", Color.GREEN, "green test");
    const note3 = new Note("note3", Color.RED, "red test");
    const vectorTest = [note1, note2, note3];
    expect(getNoteByTitle("note1", vectorTest)).to.be.deep.equal(note1);
  });
  it("it search the title of a vector with some notes", () => {
    const note1 = new Note("note1", Color.YELLOW, "yellow test");
    const note2 = new Note("note2", Color.GREEN, "green test");
    const note3 = new Note("note3", Color.RED, "red test");
    const vectorTest = [note1, note2, note3];
    expect(getNoteByTitle("note4", vectorTest)).to.be.false;
  });

  it("it search an entry for a user index", () => {
    const indexTest: NoteIndex = {"index":[{"title":"Yellow note","fileName":"Yellow_note.json"},
    {"title":"Red note","fileName":"Red_note.json"},{"title":"Blue note","fileName":"Blue_note.json"},
    {"title":"Green note","fileName":"Green_note.json"},{"title":"Black note","fileName":"Black_note.json"}]};
    const entry: IndexEntry = {"title":"Blue note","fileName":"Blue_note.json"}; 
    expect(searchEntryIndex(entry.title, indexTest)).to.be.deep.equal(entry);
  });
  it("it search a false entry for a user index", () => {
    const indexTest: NoteIndex = {"index":[{"title":"Yellow note","fileName":"Yellow_note.json"},
    {"title":"Red note","fileName":"Red_note.json"},{"title":"Blue note","fileName":"Blue_note.json"},
    {"title":"Green note","fileName":"Green_note.json"},{"title":"Black note","fileName":"Black_note.json"}]};
    const entry: IndexEntry = {"title":"Orange note","fileName":"Blue_note.json"}; 
    expect(searchEntryIndex(entry.title, indexTest)).to.be.false;
  });

  it("color", () => {
    expect(getColorByString('rEd')).to.be.equal(Color.RED);
  });
  it("Checks if the color of the note is blue", () => {
    expect(getColorByString('bLuE')).to.be.equal(Color.BLUE);
  });
  it("Checks if the color of the note is yellow", () => {
    expect(getColorByString('yellow')).to.be.equal(Color.YELLOW);
  });
  it("Checks if the color of the note is green", () => {
    expect(getColorByString('GREEN')).to.be.equal(Color.GREEN);
  });
  it("Checks if the color of the note is black", () => {
    expect(getColorByString('blACK')).to.be.equal(Color.BLACK);
  });
  it("returns false because the color gray is not available", () => {
    expect(getColorByString('GRAY')).to.be.false;
  });
});