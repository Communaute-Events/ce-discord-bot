import loaderConfig from "@config/loader.json"
import { load } from "js-yaml"
import{ readFileSync } from "fs"
import { join, dirname } from "path"

global.loadYaml = (file: string) => {
    return load(readFileSync(join(dirname(dirname(__dirname)),loaderConfig.configDirectory,file),"utf-8"))
}