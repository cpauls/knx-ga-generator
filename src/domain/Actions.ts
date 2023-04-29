import {Action, ActionGroup} from "./action/Action";
import {ObjectPart} from "./ObjectPart";
import {Room} from "./Room";

export interface Actions {
    readonly actionGroups: ActionGroup[]
    get fullDescription(): string
    readonly sub: number
}

export class Entity extends ObjectPart implements Actions {
    constructor(public readonly sub: number,
                public readonly description: string,
                public readonly actionGroups: ActionGroup[],
                private readonly belongsToRoom: Room,
    ) {
        super();
    }

    public addEntityAction(action: Action) {
        this.addAction(action)
    }

    get room() {
        return this.belongsToRoom.name
    }

    get floor() {
        return this.belongsToRoom.belongsToFloor.name
    }

    get fullDescription() {
        return `${this.floor} ${this.room} ${this.description}`
    }


}
