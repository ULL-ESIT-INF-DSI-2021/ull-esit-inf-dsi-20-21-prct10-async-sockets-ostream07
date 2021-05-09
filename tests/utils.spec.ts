import "mocha";
import { expect } from "chai";
import { getNoteByTitle } from "../src/utils";
import { Color, Note } from "../src/note";

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
});