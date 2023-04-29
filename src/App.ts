#!/usr/bin/env node

import {Generator} from "./Generator";
import {Command} from "commander-ts";



const application = new Command();
application.version('0.0.1').description('Generate GA Adresses')

const generate = new Command('generate')

generate.alias('g')
    .description('Description of generate')
    .requiredOption('-s, --sourceFile <value>', 'This is a required option')
    .requiredOption('-o, --outFile <value>', 'This is a required option', "file.csv")
    .action(
        async (options: { sourceFile: string; outFile: string; }) => {
            const source: string = options.sourceFile
            const destination: string = options.outFile
            await new Generator().generate(source, destination)
        }
    )
application.addCommand(generate)

const createExample = new Command('createExample')
createExample
    .description('Creates an example of valid groupadresses')
    .requiredOption('-o, --outFile <value>', 'where to store the example file (full qualified e.g. c:\meinekonfigu\myconfig.yaml')
    .action((options) => {
        const destination: string = options.outFile
        new Generator().createExample(destination)
    })
application.addCommand(createExample)

if (!process.argv.slice(2).length/* || !/[arudl]/.test(process.argv.slice(2))*/) {
    application.outputHelp()
    process.exit()
}
application.parse(process.argv)


