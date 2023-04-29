export interface Config {
    actionGroupConfig: ActionsGroupConfig[]

    building: BuildingConfig

}

export interface ActionsGroupConfig {

    name: string;
    main: number
    usedForFeatures: string[]
    actions: ActionConfig[]

}

export interface ActionConfig {
    name: string;
    middle: number;
}

export interface BuildingConfig {

    name: string
    centralSub: number,
    centralFeatures?: string[]
    floors: FloorConfig[]

}

export interface FloorConfig {

    floor: string
    centralSub?: number
    rooms: RoomsConfig[]
}

export interface RoomsConfig {

    room: string
    centralSub?: number
    things: ThingsConfig[]

    groupadresses?: GroupAdressConfig
}

export interface ThingsConfig {
    feature: string | string[]
    description: string
    sub: number
}

export interface GroupAdressConfig {
    description: string
    main: number
    middle: number
    sub: number
}
