import {ActionGroup} from "./Action";

export class ActionGroupService {

    private readonly actionGroups: ActionGroup[] = []

    public addActionGroup(actionGroup: ActionGroup) {
        this.actionGroups.push(actionGroup)
    }


    public getGroupsForFeatures(features: string | string[]) {
        const map: Map<string, ActionGroup> = new Map<string, ActionGroup>()

        if(Array.isArray(features)){
            for(const feature of features){
                for(const actionGroup of this.getGroupsForFeature(feature)){
                    map.set(actionGroup.Id, actionGroup)
                }
            }
        }else{
            for(const actionGroup of this.getGroupsForFeature(features)){
                map.set(actionGroup.Id, actionGroup)
            }
        }
        return Array.from(map.values())
    }

    private getGroupsForFeature(feature: string): ActionGroup[] {
        const foundGroups: ActionGroup[] = [];
        for (const actionGroup of this.actionGroups) {
            if (actionGroup.isActivatedFor(feature)) {
                foundGroups.push(actionGroup)
            }
        }
        return foundGroups
    }
}
