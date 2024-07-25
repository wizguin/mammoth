import BaseCollection from '../BaseCollection'

import Database from '@Database'
import Errors from '@objects/user/Errors'
import { items } from '@Data'
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
        if (this.includes(itemId)) {
            this.user.sendError(Errors.ItemOwned)
            return
        }

        if (!(itemId in items)) {
            this.user.sendError(Errors.ItemNotFound)
            return
        }

        const itemData = items[itemId]
        const cost = itemData.cost

        if (this.user.coins < cost) {
            this.user.sendError(Errors.InsufficientCoins)
            return
        }

        try {
            const record = await Database.inventory.create({
                data: {
                    userId: this.user.id,
                    itemId: itemId
                }
            })

            this.updateCollection(record)

            await this.user.update({ coins: this.user.coins - cost })

            this.user.send('ai', itemId, this.user.coins)

        } catch (error) {
            Logger.error(error)
        }
    }

}
