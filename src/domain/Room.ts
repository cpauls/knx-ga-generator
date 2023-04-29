import {ObjectPart} from "./ObjectPart";
import {Action, ActionGroup} from "./action/Action";
import {Floor} from "./Floor";
import {Entity} from "./Actions";

export class Room extends ObjectPart{

    entities: Entity[] = []

    public readonly sub: number

    constructor(public readonly name: string,
                public readonly belongsToFloor: Floor,
                centralSub?: number) {
        super();
        if (!centralSub) {
            this.sub = -1
        }else{
            this.sub = centralSub
        }
    }


    public addRoomAction(action: Action) {
        this.addAction(action)
    }

    addEntity(entity: Entity) {
        this.entities.push(entity)

    }

    get actionGroups(): ActionGroup[] {
        if (this.isPartOfCentralFeatures())
            return this.belongsToFloor.actionGroups
        else return []
    }

    private isPartOfCentralFeatures() {
        return this.sub != -1;
    }


    get floor(): string {
        return this.belongsToFloor.name;
    }

    get fullDescription(): string {
        return `${this.floor} ${this.name}`;
    }

}
