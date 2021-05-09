import "mocha";
import { expect } from "chai";
import { Note, Color } from "../src/note";

describe("note functions tests", () => {
  it("Checks the title of a note", () => {
    const note1 = new Note("note1", Color.YELLOW, "yellow test");
    expect(note1.getTitle()).to.be.equal('note1');
  });
});
