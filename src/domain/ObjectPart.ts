import {Action} from "./action/Action";

export abstract class ObjectPart {

    private actions: Action[] = []


    protected addAction(action: Action) {
        this.actions.push(action)
    }
}
