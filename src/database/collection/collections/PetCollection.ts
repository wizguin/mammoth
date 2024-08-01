import BaseCollection from '../BaseCollection'

import Pet from '@objects/pet/Pet'
import type User from '@objects/user/User'

import type { Pet as PrismaPet } from '@prisma/client'

export default class PetCollection extends BaseCollection<Pet> {

    constructor(user: User, records: PrismaPet[]) {
        const pets = records.map(record => createPet(record))

        super(user, pets, 'id')
    }

    add(...args: (number | string)[]): void {
        throw new Error('Method not implemented.')
    }

    toString() {
        return this.values.join('%')
    }

}

function createPet(record: PrismaPet) {
    const { id, userId, typeId, name, adoptionDate, health, hunger, rest } = record

    return new Pet(id, userId, typeId, name, adoptionDate, health, hunger, rest)
}
