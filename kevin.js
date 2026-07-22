const myVar = false;

export class Kevin {
    constructor() {
        this.hp = 15;
        this.stamina = 4;
        this.mp = 12;
        this.asthma = true;
        this.courage = 5;
        this.girthy_thrust = 14;
        this.jewish = false;
        this.tel_aviv_citizen = false;
        this.special_moves = ['Tel Aviv Smash'];
        this.items = [];
        this.date_endings = new Array(9);
        this.dexterity = 8;
        this.rizz = 10;
        this.intelligence = 12;

        this.statMap = new Map([
            ['h', 'setHp'],
            ['s', 'setStamina'],
            ['m', 'setMp'],
            ['c', 'setCourage'],
            ['g', 'setGirthyThrust'],
            ['q', 'setQuickdraw'],
            ['d', 'setDexterity'],
            ['r', 'setRizz'],
            ['i', 'setIntelligence']
        ]);

        this.itemEffects = new Map([
            ['clav', [
                () => this.setCourage(2),
                () => this.setRizz(3),
                () => this.setHp(-2),
                () => this.setIntelligence(-2)
            ]],
            ['steroids', [
                () => this.setHp(3),
                () => this.setStamina(2),
                () => this.setMp(-3),
                () => this.setGirthyThrust(-2)
            ]],
            ['nord vpn', []],
            ['yarmulke', [
                () => this.setJewish()
            ]],
            ['israeli flag body pillow', [
                () => this.setGirthyThrust(3),
                () => this.setIntelligence(-2)
            ]],
            ['storm cosplay', []],
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
                () => this.setCourage(-2),
                () => this.setIntelligence(1)
            ]],
            ['mystery sludge', [
                () => this.setHp(-1),
                () => this.setStamina(-1),
                () => this.setMp(-1),
                () => this.setCourage(-1),
                () => this.setGirthyThrust(-1),
                () => this.setDexterity(-1),
                () => this.setRizz(-1),
                () => this.setIntelligence(-1)
            ]],
            ['aderall', [
                () => this.setIntelligence(3),
                () => this.setGirthyThrust(-3)
            ]]
        ]);
    }

    parseStatInstruction(instruction) {
        if (!instruction || instruction.length < 3) {
            console.log('Invalid stat instruction:', instruction);
            return;
        }

        const statCode = instruction[0];
        const operation = instruction[1];
        const valueStr = instruction.slice(2);
        const value = Number(valueStr);

        if (isNaN(value)) {
            console.log('Invalid value in instruction:', instruction);
            return;
        }

        const setterName = this.statMap.get(statCode);
        if (!setterName) {
            console.log('Unknown stat code:', statCode);
            return;
        }

        const change = operation === 'm' ? -value : value;
        this[setterName](change);
    }

    applyEncodedChanges(encodedString) {
        const codes = encodedString.split(/[, ]+/).filter(s => s.length > 0);
        codes.forEach(code => this.parseStatInstruction(code));
    }

    applyStatChange(input) {
        const isEncodedInstruction = /^[hsmcgqdri][pm]\d+$/.test(input);

        if (isEncodedInstruction) {
            this.parseStatInstruction(input);
            return;
        }

        const effects = this.itemEffects.get(input);
        if (!effects) {
            console.log('Retard');
            return;
        }
        effects.forEach(effect => effect());
    }

    setHp(amount) {
        this.hp = Math.max(0, Math.min(20, this.hp + amount));
    }

    setStamina(amount) {
        this.stamina = Math.max(0, Math.min(20, this.stamina + amount));
    }

    setMp(amount) {
        this.mp = Math.max(0, Math.min(20, this.mp + amount));
    }

    setCourage(amount) {
        this.courage = Math.max(0, Math.min(20, this.courage + amount));
    }

    setGirthyThrust(amount) {
        this.girthy_thrust = Math.max(0, Math.min(20, this.girthy_thrust + amount));
    }

    setQuickdraw(amount) {
        this.quickdraw = Math.max(0, Math.min(20, this.quickdraw + amount));
    }

    setDexterity(amount) {
        this.dexterity = Math.max(0, Math.min(20, this.dexterity + amount));
    }

    setRizz(amount) {
        this.rizz = Math.max(0, Math.min(20, this.rizz + amount));
    }

    setIntelligence(amount) {
        this.intelligence = Math.max(0, Math.min(20, this.intelligence + amount));
    }

    setJewish() { this.jewish = true; }
    setTelAvivCitizen() { this.tel_aviv_citizen = true; }

    addSpecialMove(moveName) { this.special_moves.push(moveName); }
    addItem(itemName) { this.items.push(itemName); }
    setDateEnding(index) { this.date_endings[index] = true; }

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
        console.log(line('Intelligence', this.intelligence, 20));
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