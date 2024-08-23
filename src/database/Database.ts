import Logger from '@Logger'

import { PrismaClient } from '@prisma/client'

class Database extends PrismaClient {

    async connect() {
        try {
            await this.$queryRaw`SELECT 1`

            Logger.success('Connected to database')

        } catch (error) {
            Logger.error(error)
        }
    }

}

export default new Database()
