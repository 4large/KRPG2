export class story {
    constructor(name, dialogue) {
        this.name = name;
        this.dialogue = dialogue;
        index = 0;
    }

    nextDialogue() {
        index += 1;
        return (index < length(this.dialogue)) ? this.dialogue[index] : "Error: pussy"
    }
}