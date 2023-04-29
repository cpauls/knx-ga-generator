import {GroupAddress} from "./GroupAddress";

export class MiddleAdress extends GroupAddress{
    constructor(public readonly main: number,
                public readonly middle: number,
                public readonly description: string) {
        super(main, middle, -1, description);
    }

    get Id(): string {
        return this.main.toString().concat(`/${this.middle.toString()}/-`);
    }

    toCSV(): string {
        return ` ;"${this.description}"; ;"${this.Id}";"";"";"";"";"Auto"\n`
    }
}
