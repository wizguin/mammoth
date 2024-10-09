import BaseCollection from '../BaseCollection'

import { consts, items, whitelist } from '@vanilla/shared/data'
import { Database, Logger } from '@vanilla/shared'
import Errors from '@objects/user/Errors'
import type User from '@objects/user/User'

import type { Inventory } from '@prisma/client'

export default class InventoryCollection extends BaseCollection<Inventory> {

    constructor(user: User, records: Inventory[]) {
        super(user, records, 'itemId')
    }

    collect(records: Inventory[]) {
        // Filter out items that don't exist
        const exists = records.filter(r => r.itemId in items)

        super.collect(exists)
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

        if (consts.whitelistEnabled && !whitelist.items.includes(itemId)) {
            this.user.sendError(Errors.ItemNotFound)
            return
        }

        const cost = items[itemId].cost

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
