import BaseCollection from '../BaseCollection'

import Pet from '@objects/pet/Pet'
import type User from '@objects/user/User'

import type { Pet as PrismaPet } from '@prisma/client'

const nameRegex = /^[a-z ]+$/i

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

    checkName(name: string) {
        return name.length >= 3 && name.length <= 12 && nameRegex.test(name)
    }

}

function createPet(record: PrismaPet) {
    const { id, userId, typeId, name, adoptionDate, health, hunger, rest } = record

    return new Pet(id, userId, typeId, name, adoptionDate, health, hunger, rest)
}
