export class ActionGroup {

    constructor(
        public readonly name: string,
        public readonly main: number
    ) {

    }

    private activate: string[] = []
    private parts: ActionPart[] = []

    get Id(){
        return this.main.toString().concat(this.name)
    }
    public addActionPart(part: ActionPart) {
        this.checkActionPart(part)
        this.parts.push(part)
    }

    public getActionParts(): ActionPart[]{
        return this.parts
    }
    public addActivations(activation: string[]) {
        this.activate.push(...activation)
    }

    isActivatedFor(action: string): boolean {
        return this.activate.includes(action)
    }

    private checkActionPart(part: ActionPart) {
        for (const p of this.parts) {
            if (p.middle == part.middle) {
                throw new Error(`New action ${part.toString()} clashes with existing action ${p.toString()}`)
            }
        }
    }


}

export class ActionPart {

    constructor(
        public readonly action: string,
        public readonly middle: number
    ) {
    }

    public toString(): string {
        return JSON.stringify(this, undefined, 2)
    }


}

export class Action {

    public constructor(
        public readonly action: string,
        public readonly main: number,
        public readonly middle: number,
        public readonly sub: number) {

    }

}
