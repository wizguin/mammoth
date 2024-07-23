import BaseCollection from '../BaseCollection'

import Database from '@Database'
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

    async add(buddyId: number) {
        if (this.includes(buddyId)) return

        const record = await Database.buddy.create({
            data: {
                userId: this.user.id,
                buddyId: buddyId
            },
            include: {
                buddy: { select: { username: true } }
            }
        })

        this.updateCollection(record)
    }

    toString() {
        return this.values.map(record =>
            `${record.buddyId}|${record.buddy.username}`
        ).join('%')
    }

}
