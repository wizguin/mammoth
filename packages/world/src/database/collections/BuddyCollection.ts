import BaseCollection from '../BaseCollection'

import { Database } from '@vanilla/shared'
import type User from '@objects/user/User'

import type { Buddy as PrismaBuddy } from '@prisma/client'

interface Buddy extends PrismaBuddy {
    buddy: {
        username: string
    }
}

export default class BuddyCollection extends BaseCollection<Buddy> {

    constructor(user: User, records: Buddy[]) {
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
