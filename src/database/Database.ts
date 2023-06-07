import Logger from '../logger/Logger'

import { PrismaClient } from '@prisma/client'


class Database extends PrismaClient {

    constructor() {
        super()

        this.authenticate()
    }

    async authenticate() {
        try {
            await this.$queryRaw`SELECT 1`

            console.log('Sucessfully connected to database')

        } catch (error) {
            console.log(`${error}`)
        }
    }

}

export default new Database()
