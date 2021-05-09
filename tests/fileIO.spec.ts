import "mocha";
import { expect } from "chai";
import { saveNote, loadNotes } from "../src/fileIO";
import { Color, Note } from "../src/note";

describe("fileIO function tests", () => {
    it("it saves a note and loads it back", () => {
      const note1 = new Note("note1", Color.YELLOW, "yellow test");
      const testUser = "testing";
      saveNote(testUser, note1);
      expect(loadNotes(testUser)).to.be.deep.equal([note1]);
    });
});