export abstract class GroupAddress {


    constructor(readonly main: number,
                readonly middle: number,
                readonly sub: number,
                readonly description: string
    ) {
    }

    abstract get Id(): string

    abstract toCSV(): string


}


export const sortGroupAdresses = (a: GroupAddress, b: GroupAddress) => {
    const main = a.main - b.main
    const middle = a.middle - b.middle
    const sub = a.sub - b.sub
    if (main != 0) return main
    if (middle != 0) return middle
    return sub
}

