import BaseCollection from '../BaseCollection'

import Database from '@Database'
import Errors from '@objects/user/Errors'
import { furniture } from '@Data'
import Logger from '@Logger'
import type User from '@objects/user/User'

interface FurnitureRecord {
    userId: number,
    furnitureId: number,
    quantity: number
}

export default class FurnitureCollection extends BaseCollection<FurnitureRecord> {

    constructor(user: User, records: FurnitureRecord[]) {
        super(user, records, 'furnitureId')
    }

    async add(furnitureId: number) {
        if (!(furnitureId in furniture)) {
            this.user.sendError(Errors.ItemNotFound)
            return
        }

        const furnitureData = furniture[furnitureId]
        const cost = furnitureData.cost

        if (this.user.coins < cost) {
            this.user.sendError(Errors.InsufficientCoins)
            return
        }

        try {
            const record = this.includes(furnitureId)
                ? await this.updateExisting(furnitureId)
                : await this.createNew(furnitureId)

            this.updateCollection(record)

            await this.user.update({ coins: this.user.coins - furnitureData.cost })

            this.user.send('af', furnitureId, this.user.coins)

        } catch (error) {
            Logger.error(error)
        }
    }

    async updateExisting(furnitureId: number) {
        return Database.furniture.update({
            data: {
                quantity: { increment: 1 }
            },
            where: {
                userId_furnitureId: {
                    userId: this.user.id,
                    furnitureId: furnitureId
                }
            }
        })
    }

    async createNew(furnitureId: number) {
        return Database.furniture.create({
            data: {
                userId: this.user.id,
                furnitureId: furnitureId
            }
        })
    }

    getQuantity(furnitureId: number) {
        return this.collection[furnitureId].quantity
    }

    toString() {
        const furnitureList = []

        for (const furniture of this.values) {
            for (let i = 0; i < furniture.quantity; i++) {
                furnitureList.push(furniture.furnitureId)
            }
        }

        return furnitureList.join('%')
    }

}
