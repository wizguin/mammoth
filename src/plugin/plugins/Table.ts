import BasePlugin, { type Num } from '../BasePlugin'

import type User from '@objects/user/User'

export default class Table extends BasePlugin {

    events = {
        gt: this.getTables
    }

    getTables(user: User) {
        if (!user.room) {
            return
        }

        const tables = Object.values(user.room.tables)

        if (tables.length) {
            user.send('gt', ...tables)
        }
    }

}
