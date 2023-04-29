import {Room} from "./Room";
import {checkUniqueName, NameUnique} from "./Compare";

import {ObjectPart} from "./ObjectPart";
import {Action, ActionGroup} from "./action/Action";
import {Building} from "./Building";
import {Actions} from "./Actions";

export class Floor extends ObjectPart implements NameUnique, Actions {

    rooms: Room[] = []
    public readonly sub: number

    constructor(public readonly name: string, private readonly belongsTo: Building, centralSub?: number) {
        super();
        if (!centralSub) {
            this.sub = -1
        }else{
            this.sub = centralSub
        }

    }


    public addRoom(room: Room) {
        const checkedRoom = checkUniqueName<Room>(this.rooms, room, "Room")
        this.rooms.push(checkedRoom)
    }

    public addFloorAction(action: Action) {
        this.addAction(action)
    }


    get fullDescription(): string {
        return `${this.name}`;
    }

    get actionGroups(): ActionGroup[] {
        if (this.isPartOfCentralFeatures())
            return this.belongsTo.actionGroups
        else return []
    }

    private isPartOfCentralFeatures() {
        return this.sub != -1;
    }
}


