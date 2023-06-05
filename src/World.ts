import config from './config/config.json'

import { Server } from 'net'


export default class World extends Server {

    constructor(id: string) {
        super()

        console.log(id)
    }

}

const args: string[] = process.argv.slice(2)

for (const id of args) {
    if (id in config.worlds) new World(id)
}
