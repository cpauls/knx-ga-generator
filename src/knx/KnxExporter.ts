import {Building} from "../domain/Building";
import {MainAddress} from "./MainAddress";
import {ActionGroup} from "../domain/action/Action";
import {MiddleAdress} from "./MiddleAdress";
import {GroupAddress} from "./GroupAddress";
import {Actions} from "../domain/Actions";
import {SubAddress} from "./SubAddress";

export class KnxExporter {

    addresses: Map<string, GroupAddress> = new Map<string, GroupAddress>()

    createGroupAdressesFrom(building: Building): GroupAddress[] {
        this.createMainAndMiddleAddresses(building.uniqueActionGroups)
        this.createSubAdresses(building.allEntities)
        return Array.from(this.addresses.values())
    }




    private createMainAndMiddleAddresses(actionGroups: ActionGroup[]) {
        for (const actionGroup of actionGroups) {
            const mainAddress = new MainAddress(actionGroup.main, actionGroup.name)
            this.addAddressToPool(mainAddress)
            for (const actionPart of actionGroup.getActionParts()) {
                const middleAddress = new MiddleAdress(mainAddress.main, actionPart.middle, actionPart.action)
                this.addAddressToPool(middleAddress)
            }
        }
    }

    private addAddressToPool(address: GroupAddress) {
        if (this.addresses.has(address.Id)) {
            throw new Error(`Groupaddress ${address.Id} already exists.`);
        }
        this.addresses.set(address.Id, address)
    }

    private createSubAdresses(allActions: Actions[]) {
        for (const action of allActions) {
            for (const actionGroup of action.actionGroups) {
                for (const actionPart of actionGroup.getActionParts()) {

                    const sub = new SubAddress(actionGroup.main, actionPart.middle, action.sub, `${action.fullDescription} ${actionPart.action}`)
                    if (!this.addresses.has(sub.middleId)) {
                        throw new Error(`Entity does not belong to any Middlegroup: ${sub.toCSV()}`)
                    }
                    this.addAddressToPool(sub)
                }
            }
        }
    }
}
