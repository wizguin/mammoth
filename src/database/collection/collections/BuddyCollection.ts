import BaseCollection from '../BaseCollection'

import type User from '@objects/user/User'

interface BuddyRecord {
    userId: number,
    buddyId: number,
    buddy: {
        username: string
    }
}

export default class BuddyCollection extends BaseCollection<BuddyRecord> {

    constructor(user: User, records: BuddyRecord[]) {
        super(user, records, 'buddyId')
    }

    add() {
        //
    }

    toString() {
        return this.values.map(record =>
            `${record.buddyId}|${record.buddy.username}`
        ).join('%')
    }

}
