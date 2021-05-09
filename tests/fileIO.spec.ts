import "mocha";
import { expect } from "chai";
import { saveNote, loadNotes, removeNote } from "../src/fileIO";
import { Color, Note } from "../src/note";

describe("fileIO functions tests", () => {
  it("it saves a note and loads it back", () => {
    const note1 = new Note("note1", Color.YELLOW, "yellow test");
    const testUser = "testing";
    saveNote(testUser, note1);
    expect(loadNotes(testUser)).to.be.deep.equal([note1]);
  });
  it("it deletes a note and check that it is removed", () => {
    const note1 = new Note("note1", Color.YELLOW, "yellow test");
    const testUser = "testing";
    saveNote(testUser, note1);
    removeNote(testUser, note1.getTitle());
    expect(loadNotes(testUser)).not.contains(note1);
  });
});