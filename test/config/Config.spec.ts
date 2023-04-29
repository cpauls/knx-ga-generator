import {describe, it, jest, beforeEach, expect} from "@jest/globals";

import {Config} from "../../src/config/Config";
import {ActionGroupService} from "../../src/domain/action/ActionGroupService";
import {ConfigParser} from "../../src/config/ConfigParser";
import fs = require('fs');
import {Floor} from "../../src/domain/Floor";
import {Building} from "../../src/domain/Building";
import {Room} from "../../src/domain/Room";
import {Entity} from "../../src/domain/Actions";
import {ActionGroup} from "../../src/domain/action/Action";


function expectCentralGroups(actionsGroups: ActionGroup[]) {
    expect(actionsGroups.length).toEqual(1)
    const actionparts = actionsGroups[0].getActionParts()
    expect(actionparts.length).toEqual(2)
    expect(actionparts[0].action).toEqual("central Light on")
    expect(actionparts[0].middle).toEqual(1)
    expect(actionparts[1].action).toEqual("central dimmable Light on")
    expect(actionparts[1].middle).toEqual(2)
}

describe("test add function", () => {


    let testdata: Config
    let parser: ConfigParser
    let building: Building
    beforeEach(() => {
            const spyobject = jest.spyOn(fs, 'readFileSync')
            testdata = {
                actionGroupConfig: [
                    {
                        name: "centralActions",
                        main: 0,
                        usedForFeatures: ["centralFeatures"],
                        actions: [{name: "central Light on", middle: 1}, {name: "central dimmable Light on", middle: 2}]
                    },
                    {
                        name: "Light",
                        main: 1,
                        usedForFeatures: ["feature1"],
                        actions: [{name: "Light on", middle: 1}, {name: "Light status", middle: 2}]
                    },
                    {
                        name: "Dimmable Light",
                        main: 2,
                        usedForFeatures: ["feature2", "feature1"],
                        actions: [{name: "Dimmable Light on", middle: 2}, {name: "Dimmable Light status", middle: 3}]
                    },
                    {
                        name: "unused",
                        main: 3,
                        usedForFeatures: ["notused"],
                        actions: [{name: "doNothing", middle: 1}]
                    },
                    {
                        name: "specialFeature",
                        main: 4,
                        usedForFeatures: ["rgb", "tunableWhite"],
                        actions: [{name: "doNothing", middle: 1}]
                    },
                    {
                        name: "specialFeature2",
                        main: 5,
                        usedForFeatures: ["tuneableWhite", "rgb"],
                        actions: [{name: "doNothing", middle: 1}]
                    }
                ],
                building: {
                    name: "my castle",
                    centralFeatures: ["centralFeatures"],
                    centralSub: 0,
                    floors: [
                        {
                            floor: "EG",
                            centralSub: 1,
                            rooms: [
                                {
                                    room: "room1",
                                    centralSub: 2,
                                    things: [
                                        {feature: "feature1", description: "a thing", sub: 1},
                                        {feature: ["feature1", "rgb"], description: "a secondthing", sub: 2},
                                        {feature: ["tunableWhite", "rgb"], description: "a third", sub: 3}
                                    ]
                                }
                            ]
                        }

                    ]
                }
            }
            spyobject.mockReturnValue(JSON.stringify(testdata));
            parser = new ConfigParser(new ActionGroupService())
            building = parser.parse("return mocked values")
        }
    )
    it("should be the correct floor", () => {
        const floor: Floor = building.floors[0]
        expect(floor.name).toEqual("EG")
    });

    it("should be correct room", () => {
        const room: Room = building.floors[0].rooms[0]
        expect(room.name).toEqual("room1")
    });

    it("should contain correct entities", () => {
        const entity: Entity = building.floors[0].rooms[0].entities[0]
        expect(entity.description).toEqual("a thing")
        expect(entity.sub).toEqual(1)
        expect(entity.room).toEqual("room1")
        expect(entity.floor).toEqual("EG")
        expect(entity.fullDescription).toEqual("EG room1 a thing")

    });
    it("should contain the corresponding actionGroups", () => {
        const actionsGroups: ActionGroup[] = building.floors[0].rooms[0].entities[0].actionGroups
        expect(actionsGroups.length).toBe(2)

        const actionGroup = actionsGroups[0]
        expect(actionGroup.main).toBe(1)
        expect(actionGroup.name).toEqual("Light")
        expect(actionGroup.isActivatedFor("feature1")).toEqual(true)
        expect(actionGroup.Id).toEqual("1Light")

        const actionparts = actionGroup.getActionParts()
        expect(actionparts.length).toEqual(2)
        expect(actionparts[0].action).toEqual("Light on")
        expect(actionparts[0].middle).toEqual(1)
        expect(actionparts[1].action).toEqual("Light status")
        expect(actionparts[1].middle).toEqual(2)
    })

    it("should contain the correct merged groups", () =>{
        const actionsGroups: ActionGroup[] = building.floors[0].rooms[0].entities[1].actionGroups
        expect(actionsGroups.length).toEqual(4) // Light, Dimmable Light, special Feature
        expect(actionsGroups[2].name).toEqual("specialFeature")
    })

    it("should not add features twice", () =>{
        const actionsGroups: ActionGroup[] = building.floors[0].rooms[0].entities[2].actionGroups
        expect(actionsGroups.length).toEqual(2) // rgb and tunable light are referencing each other in definition
        expect(actionsGroups[0].name).toEqual("specialFeature")
        expect(actionsGroups[1].name).toEqual("specialFeature2")

    })

    it("should contain correct building actions", () =>{
        expect(building.sub).toEqual(0)
        const actionsGroups: ActionGroup[] = building.actionGroups
        expectCentralGroups(actionsGroups);
    })


    it("should contain correct floor actions", () =>{
        const floor = building.floors[0]
        expect(floor.sub).toEqual(1)
        expectCentralGroups(building.floors[0].actionGroups);
    })

    it("should contain correct room actions", () =>{
        const room =  building.floors[0].rooms[0]
        expect(room.sub).toEqual(2)
        expectCentralGroups(room.actionGroups)
    })

});
