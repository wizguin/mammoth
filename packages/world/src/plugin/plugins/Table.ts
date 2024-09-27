import BasePlugin, { type Num } from '../BasePlugin'

import type User from '@objects/user/User'

export default class Table extends BasePlugin {

    events = {
        gt: this.getTables,
        jt: this.joinTable
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

    joinTable(user: User, tableId: Num) {
        if (!user.room || user.table || user.waddle) {
            return
        }

        if (tableId in user.room.tables) {
            user.room.tables[tableId].add(user)
        }
    }

}
