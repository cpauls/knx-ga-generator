import {GroupAddress} from "./GroupAddress";
import {MiddleAdress} from "./MiddleAdress";

export class SubAddress extends GroupAddress {
    constructor(public readonly main: number,
                public readonly middle: number,
                public readonly sub: number,
                public readonly description: string) {
        super(main, middle, sub, description);
    }

    get Id(): string {
        return this.main.toString().concat(`/${this.middle.toString()}/${this.sub.toString()}`);
    }

    get middleId(): string {
        //This is bad, cause the id is already defined in MiddleGroup
        return new MiddleAdress(this.main, this.middle, "").Id
    }
    toCSV(): string {
        return ` ; ;"${this.description}";"${this.Id}";"";"";"";"";"Auto"\n`
    }

}
