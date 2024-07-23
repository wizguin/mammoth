import BaseCollection from '../BaseCollection'

import Database from '@Database'
import Logger from '@Logger'
import type User from '@objects/user/User'

interface InventoryRecord {
    userId: number,
    itemId: number
}

export default class InventoryCollection extends BaseCollection<InventoryRecord> {

    constructor(user: User, records: InventoryRecord[]) {
        super(user, records, 'itemId')
    }

    async add(itemId: number) {
        try {
            const record = await Database.inventory.create({
                data: {
                    userId: this.user.id,
                    itemId: itemId
                }
            })

            this.updateCollection(record)

            await this.user.update({ coins: this.user.coins - 100 })

            this.user.send('ai', itemId, this.user.coins)

        } catch (error) {
            Logger.error(error)
        }
    }

}
