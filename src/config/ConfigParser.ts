import * as fs from "fs";
import yaml = require('js-yaml');
import {ActionsGroupConfig, Config, FloorConfig, RoomsConfig, ThingsConfig} from "./Config";
import {ActionGroup, ActionPart} from "../domain/action/Action";
import {ActionGroupService} from "../domain/action/ActionGroupService";
import {Building} from "../domain/Building";
import {Floor} from "../domain/Floor";
import {Room} from "../domain/Room";
import {Entity} from "../domain/Actions";


export class ConfigParser {
    constructor(private readonly actionGroupService: ActionGroupService) {
    }

    parse(file: string): Building {

        const config = this.loadConfigFromFile(file)
        for (const actionGroupConfig of config.actionGroupConfig) {
            this.actionGroupService.addActionGroup(this.parseActionGroup(actionGroupConfig))
        }

        const building = new Building(config.building.centralSub)
        if (config.building.centralFeatures) {
            for (const centralFeature of config.building.centralFeatures) {
                building.actionGroups.push(...this.actionGroupService.getGroupsForFeatures(centralFeature))
            }
        }

        for (const floorConfig of config.building.floors) {
            building.addFloor(this.parseFloor(building, floorConfig))
        }
        return building
    }

    private loadConfigFromFile(file: string): Config {
        return yaml.load(fs.readFileSync(file, 'utf8'),) as Config;
    }

    private parseFloor(building: Building, floorConfig: FloorConfig): Floor {
        const floor = new Floor(floorConfig.floor, building, floorConfig.centralSub)

        for (const roomConfig of floorConfig.rooms)
            floor.addRoom(this.parseRoom(roomConfig, floor))
        return floor
    }

    private parseRoom(roomConfig: RoomsConfig, belongsTo: Floor): Room {
        const room = new Room(roomConfig.room, belongsTo, roomConfig.centralSub)
        for (const thing of roomConfig.things) {
            room.addEntity(this.createEntityFromThing(thing, room))
        }
        return room
    }

    private createEntityFromThing(thing: ThingsConfig, belongsTo: Room): Entity {
        const actionGroups = this.actionGroupService.getGroupsForFeatures(thing.feature)
        return new Entity(thing.sub, thing.description, actionGroups, belongsTo)
    }


    private parseActionGroup(actionsgroupConfig: ActionsGroupConfig): ActionGroup {
        const actionGroup = new ActionGroup(actionsgroupConfig.name, actionsgroupConfig.main)
        for (const action of actionsgroupConfig.actions) {
            actionGroup.addActionPart(new ActionPart(action.name, action.middle))
        }
        actionGroup.addActivations(actionsgroupConfig.usedForFeatures)
        return actionGroup
    }

}
