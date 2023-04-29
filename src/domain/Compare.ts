
export interface NameUnique{
    name: string;
}


export function checkUniqueName<Type extends NameUnique>(a: Type[], b: Type, type: string): Type{
    for (const o of a) {
        if(o.name == b.name){
            throw new Error(`${type} ${b.name} already exists and must be unique.`)
        }
    }
    return b;
}
