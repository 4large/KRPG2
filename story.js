export class story {
    /*
    Sprites:
    The problem is that i index story elements by an array and that array is restricted to text and i cant stores sprites.
    The solution is to take in an equal size array and have it store sprites at story index [None, img1, img2]
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