import BaseCollection from '../BaseCollection'

import { pets, whitelist } from '@Data'
import Database from '@Database'
import Errors from '@objects/user/Errors'
import Logger from '@Logger'
import Pet from '@objects/pet/Pet'
import type User from '@objects/user/User'
import { whitelistEnabled } from '@Config'

import type { Pet as PrismaPet } from '@prisma/client'

const nameRegex = /^[a-z ]+$/i
const maxPuffles = 8

export default class PetCollection extends BaseCollection<Pet> {

    constructor(user: User, records: PrismaPet[]) {
        const pets = records.map(record => createPet(record))

        super(user, pets, 'id')
    }

    async add(typeId: number, name: string) {
        if (!(typeId in pets)) {
            this.user.sendError(Errors.ItemNotFound)
            return
        }

        if (whitelistEnabled && !whitelist.pets.includes(typeId)) {
            this.user.sendError(Errors.ItemNotFound)
            return
        }

        if (this.count >= maxPuffles) {
            this.user.sendError(Errors.MaxPuffles)
            return
        }

        if (!this.checkName(name)) {
            this.user.sendError(Errors.InvalidName)
            return
        }

        const cost = pets[typeId].cost

        if (this.user.coins < cost) {
            this.user.sendError(Errors.InsufficientCoins)
            return
        }

        try {
            const record = await Database.pet.create({
                data: {
                    userId: this.user.id,
                    typeId: typeId,
                    name: name
                }
            })

            const pet = createPet(record)

            this.updateCollection(pet)

            await this.user.update({ coins: this.user.coins - cost })

            this.user.send('p', 'n', pet)

        } catch (error) {
            Logger.error(error)
        }
    }

    toString() {
        return this.values.join('%')
    }

    checkName(name: string) {
        return name.length >= 3 && name.length <= 12 && nameRegex.test(name)
    }

}

function createPet(record: PrismaPet) {
    const { id, userId, typeId, name, adoptionDate, health, hunger, rest } = record

    return new Pet(id, userId, typeId, name, adoptionDate, health, hunger, rest)
}
