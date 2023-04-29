import {GroupAddress} from "./GroupAddress";

export class MainAddress extends GroupAddress{
    constructor(public readonly main: number,
                public readonly description: string) {
        super(main, -1, -1, description);
    }

    get Id(): string {
        return this.main.toString();
    }

    toCSV(): string {
        return `"${this.description}"; ; ;"${this.Id}";"";"";"";"";"Auto"\n`
    }
}
