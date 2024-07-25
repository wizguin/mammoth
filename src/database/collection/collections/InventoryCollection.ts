import BaseCollection from '../BaseCollection'

import Database from '@Database'
import { items } from '../../../data/Data'
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

    collect(records: InventoryRecord[]): void {
        // Filter out items that don't exist
        const filteredRecords = records.filter(r => r.itemId in items)

        super.collect(filteredRecords)
    }

    async add(itemId: number) {
        if (this.includes(itemId)) return

        if (!(itemId in items)) return

        const itemData = items[itemId]

        try {
            const record = await Database.inventory.create({
                data: {
                    userId: this.user.id,
                    itemId: itemId
                }
            })

            this.updateCollection(record)

            await this.user.update({ coins: this.user.coins - itemData.cost })

            this.user.send('ai', itemId, this.user.coins)

        } catch (error) {
            Logger.error(error)
        }
    }

}
