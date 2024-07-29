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
        if (this.includes(buddyId)) {
            return
        }

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

    async remove(buddyId: number) {
        if (!this.includes(buddyId)) {
            return
        }

        await Database.buddy.delete({
            where: {
                userId_buddyId: {
                    userId: this.user.id,
                    buddyId: buddyId
                }
            }
        })

        delete this.collection[buddyId]
    }

    toString() {
        return this.values.map(record =>
            `${record.buddyId}|${record.buddy.username}`
        ).join('%')
    }

}
