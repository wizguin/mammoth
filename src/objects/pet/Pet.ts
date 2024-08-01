import { pets } from '@Data'

import type { Pet as PrismaPet } from '@prisma/client'

export default class Pet implements PrismaPet {

    x = 0
    y = 0
    maxHealth: number
    maxHunger: number
    maxRest: number
    happy: number

    constructor(
        public id: number,
        public userId: number,
        public typeId: number,
        public name: string,
        public adoptionDate: Date,
        public health: number,
        public hunger: number,
        public rest: number
    ) {
        const data = pets[typeId]

        this.maxHealth = data.maxHealth
        this.maxHunger = data.maxHunger
        this.maxRest = data.maxRest

        this.happy = 100
    }

    toString() {
        return [
            this.id,
            this.name,
            this.typeId,
            this.health,
            this.hunger,
            this.rest,
            this.maxHealth,
            this.maxHunger,
            this.maxRest,
            this.happy,
            this.x,
            this.y
        ].join('|')
    }

}
