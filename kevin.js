const myVar = false;

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

        //Maps item names to functions to be called so it can quickly and scalably be called IE 
        //clav does +2 courage +3 rizz -2 hp, so it would be an array of functions setCourage, setRizz, setHp
        //Item effects can be added here

        this.itemEffects = new Map([
            ['clav', [
                () => this.setCourage(2),
                () => this.setRizz(3),
                () => this.setHp(-2)
            ]],
            ['steroids', [
                () => this.setHp(3),
                () => this.setStamina(2),
                () => this.setMp(-3),
                () => this.setGirthyThrust(-2)
            ]],
            ['nord vpn', [
                // Does fuckall (thank you kimi)
            ]],
            ['yarmulke', [
                () => this.setJewish()
            ]],
            ['israeli flag body pillow', [
                () => this.setGirthyThrust(3)
            ]],
            ['storm cosplay', [
                //Something pertaining to a special date, maybe a flag?
            ]],
            ['kitty cat :3', [
                () => this.addItem('kitty cat :3')
            ]],
            ['leave store', [
                () => document.dispatchEvent(new CustomEvent('done-gambling', {
                    detail: { myVar }
                }))
            ]],
            ['hentai game', [
                () => this.setMp(3),
                () => this.setStamina(-2)
            ]],
            ['penis curling', [
                () => this.setDexterity(5),
                () => this.setGirthyThrust(-2),
                () => this.setCourage(-2)
            ]],
            ['mystery sludge', [
                () => this.setHp(-1),
                () => this.setStamina(-1),
                () => this.setMp(-1),
                () => this.setCourage(-1),
                () => this.setGirthyThrust(-1),
                () => this.setQuickdraw(-1),
                () => this.setDexterity(-1),
                () => this.setRizz(-1)
            ]]
        ]);
    }

    applyStatChange(itemName) {
        const effects = this.itemEffects.get(itemName);
        if (!effects) {
            console.log('Retard');
            return;
        }
        effects.forEach(effect => effect());
    }

    // Number stats (increment/decrement)
    setHp(amount) {
        this.hp += amount;
    }

    setStamina(amount) {
        this.stamina += amount;
    }

    setMp(amount) {
        this.mp += amount;
    }

    setCourage(amount) {
        this.courage += amount;
    }

    setGirthyThrust(amount) {
        this.girthy_thrust += amount;
    }

    setQuickdraw(amount) {
        this.quickdraw += amount;
    }

    setDexterity(amount) {
        this.dexterity += amount;
    }

    setRizz(amount) {
        this.rizz += amount;
    }

    // Booleans (set to true)
    setJewish() {
        this.jewish = true;
    }

    setTelAvivCitizen() {
        this.tel_aviv_citizen = true;
    }

    // Arrays (push to array)
    addSpecialMove(moveName) {
        this.special_moves.push(moveName);
    }

    addItem(itemName) {
        this.items.push(itemName);
    }

    // Date endings (set index to true)
    setDateEnding(index) {
        this.date_endings[index] = true;
    }

    //debug purposes, shout out kimi fuck claude
    printStatSheet() {
        const divider = '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
        const line = (label, value, max = null) => {
            const maxStr = max !== null ? ` / ${max}` : '';
            return `  ${label.padEnd(20)} ${value}${maxStr}`;
        };

        const boolLine = (label, value) => {
            const status = value ? '✓' : '✗';
            return `  ${label.padEnd(20)} ${status}`;
        };

        const arrayLine = (label, arr) => {
            const display = arr.length > 0 ? arr.join(', ') : '(none)';
            return `  ${label.padEnd(20)} ${display}`;
        };

        const dateEndingsLine = () => {
            const filled = this.date_endings
                .map((val, i) => val ? i + 1 : null)
                .filter(v => v !== null);
            const display = filled.length > 0 ? filled.join(', ') : '(none)';
            return `  ${'Date Endings'.padEnd(20)} ${display}`;
        };

        console.log(divider);
        console.log('  ⚔️  KEVIN\'S STAT SHEET');
        console.log(divider);
        console.log('');
        console.log('  ── Combat Stats ──');
        console.log(line('HP', this.hp, 20));
        console.log(line('Stamina', this.stamina, 20));
        console.log(line('MP', this.mp, 20));
        console.log(line('Courage', this.courage, 20));
        console.log(line('Girthy Thrust', this.girthy_thrust, 20));
        console.log(line('Dexterity', this.dexterity, 20));
        console.log(line('Rizz', this.rizz, 20));
        console.log('');
        console.log('  ── Conditions ──');
        console.log(boolLine('Asthma', this.asthma));
        console.log('');
        console.log('  ── Identity ──');
        console.log(boolLine('Jewish', this.jewish));
        console.log(boolLine('Tel Aviv Citizen', this.tel_aviv_citizen));
        console.log('');
        console.log('  ── Abilities ──');
        console.log(arrayLine('Special Moves', this.special_moves));
        console.log('');
        console.log('  ── Inventory ──');
        console.log(arrayLine('Items', this.items));
        console.log(dateEndingsLine());
        console.log(divider);
    }
}