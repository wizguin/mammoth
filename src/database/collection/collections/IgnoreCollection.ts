import BaseCollection from '../BaseCollection'

import Database from '@Database'
import type User from '@objects/user/User'

interface IgnoreRecord {
    userId: number,
    ignoreId: number,
    ignore: {
        username: string
    }
}

export default class IgnoreCollection extends BaseCollection<IgnoreRecord> {

    constructor(user: User, records: IgnoreRecord[]) {
        super(user, records, 'ignoreId')
    }

    async add(ignoreId: number) {
        //
    }

    toString() {
        return this.values.map(record =>
            `${record.ignoreId}|${record.ignore.username}`
        ).join('%')
    }

}
