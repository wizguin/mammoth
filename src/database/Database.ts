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

            Logger.success('Sucessfully connected to database')

        } catch (error) {
            Logger.error(error)
        }
    }

}

export default new Database()
