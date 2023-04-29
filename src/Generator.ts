import * as path from "path";
import {ConfigParser} from "./config/ConfigParser";
import {ActionGroupService} from "./domain/action/ActionGroupService";
import {Building} from "./domain/Building";
import {KnxExporter} from "./knx/KnxExporter";
import {GroupAddress} from "./knx/GroupAddress";
import {FileWriter} from "./knx/FileWriter";
import * as fs from "fs";


export class Generator {

    static readonly DEFAULT_CONFIG_FILE = 'simple-example.yaml'

    public async generate(source: string, destination: string) {
        // move to IOC
        const actionGroupService = new ActionGroupService()
        const configParser = new ConfigParser(actionGroupService)
        const exporter = new KnxExporter()


        const sourceFile = path.resolve(source)
        const destFile = path.resolve(destination)
        try {
            const building: Building = configParser.parse(sourceFile)
            const generatedAddresses: GroupAddress[] = exporter.createGroupAdressesFrom(building)
            const writer = new FileWriter(destFile)
            await writer.write(generatedAddresses)

            console.log("Finished")
        } catch (e) {
            console.log("Something went wrong")
            console.log(e)
            //process.exit(1)
        }
    }

    public async createExample(destination: string) {

        fs.copyFile(Generator.exampleConfigPath, destination, (err) => {
            if (err) throw err;
            console.log(`Saved example to ${destination}`);
        });
    }


    static get projectPath(): string {
        return path.resolve(`${this.rootPath}/..`)
    }

    static get rootPath(): string {
        return __dirname;
    }

    static get assetsPath(): string {
        return path.resolve(`${this.projectPath}/assets`)
    }

    static get exampleConfigPath(): string {
        return path.resolve(`${this.assetsPath}/${this.DEFAULT_CONFIG_FILE}`)
    }

    run(): void {
    }
}

