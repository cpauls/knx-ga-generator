import {Floor} from "./Floor";
import {checkUniqueName} from "./Compare";
import {Action, ActionGroup} from "./action/Action";
import {ObjectPart} from "./ObjectPart";
import {Actions} from "./Actions";

export class Building extends ObjectPart implements Actions {

    floors: Floor[] = []
    actionGroups: ActionGroup[] = [];


    constructor(public readonly sub: number) {
        super();
    }

    public addFloor(floor: Floor) {
        const checkedFloor = checkUniqueName(this.floors, floor, "Floor")
        this.floors.push(checkedFloor)
    }

    public addBuildingAction(action: Action) {
        this.addAction(action)
    }

    get uniqueActionGroups(): ActionGroup[] {
        const uniqueActionGroup: Map<String, ActionGroup> = new Map()
        for (const entity of this.allEntities) {
            for (const actionGroup of entity.actionGroups) {
                uniqueActionGroup.set(actionGroup.Id, actionGroup)
            }
        }
        return Array.from(uniqueActionGroup.values());
    }

    get allEntities() {
        const entities: Actions[] = []
        entities.push(this)
        for (const floor of this.floors) {
            entities.push(floor)
            for (const room of floor.rooms) {
                entities.push(room)
                entities.push(...room.entities)
            }
        }
        return entities
    }

    get fullDescription(): string {
       return `Gesamt`
    }


}
