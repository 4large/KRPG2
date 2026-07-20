export class Kevin {
    //default stats
    constructor() {
        this.hp = 10;               //Out of 20
        this.stamina = 4;           //Out of 20
        this.mp = 13;               //Out of 20
        this.asthma = true;
        this.courage = 5;           //Out of 20
        this.girthy_thrust = 14;    //Out of 20
        this.jewish = false;
        this.tel_aviv_citizen = false;  //Probably story triggered? No clue how it gets updated yet
        this.special_moves = ['Tel Aviv Smash'];    //Mutable
        this.items = [];                            //Mutable
        this.date_endings = new Array(9);   //Can be a store of kevins dates, and can indicate good or bad endings (for future use)
        this.dexterity = 8;         //Out of 20
        this.rizz = 10;             //Out of 20
    }
}