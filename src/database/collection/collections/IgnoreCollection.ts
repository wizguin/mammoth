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
        if (this.includes(ignoreId)) {
            return
        }

        const record = await Database.ignore.create({
            data: {
                userId: this.user.id,
                ignoreId: ignoreId
            },
            include: {
                ignore: { select: { username: true } }
            }
        })

        this.updateCollection(record)
    }

    async remove(ignoreId: number) {
        if (!this.includes(ignoreId)) {
            return
        }

        await Database.ignore.delete({
            where: {
                userId_ignoreId: {
                    userId: this.user.id,
                    ignoreId: ignoreId
                }
            }
        })

        delete this.collection[ignoreId]
    }

    toString() {
        return this.values.map(record =>
            `${record.ignoreId}|${record.ignore.username}`
        ).join('%')
    }

}
