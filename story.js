export class story {
    /*
    Sprites:
    The problem is that i index story elements by an array and that array is restricted to text and i cant stores sprites.
    The solution is to has each string tail with a char and that char signifies non print, but also isntruction at the end of the string
    */
    constructor(name, dialogue) {
        this.name = name;
        this.dialogue = dialogue;
        this.index = -1;
    }

    nextDialogue() {
        this.index += 1;
        return (this.index < this.dialogue.length) ? this.dialogue[this.index] : 'Error: pussy';
    }

    resetIndex() {
        this.index = 0;
    }
}