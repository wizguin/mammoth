import Database from '@Database'
import Logger from '@Logger'
import { pets } from '@Data'

import type { Pet as PrismaPet } from '@prisma/client'

export default class Pet implements PrismaPet {

    x = 0
    y = 0
    maxHealth: number
    maxHunger: number
    maxRest: number

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
    }

    get happy() {
        const statTotal = this.health + this.hunger + this.rest
        const maxTotal = this.maxHealth + this.maxHunger + this.maxRest

        return Math.round(statTotal / maxTotal * 100)
    }

    setPosition(x: number, y: number) {
        this.x = x
        this.y = y
    }

    async decreaseStats() {
        const newStats = {
            health: this.decreaseStat(this.health),
            hunger: this.decreaseStat(this.hunger),
            rest: this.decreaseStat(this.rest)
        }

        try {
            await Database.pet.update({
                where: {
                    id: this.id
                },
                data: newStats
            })

            this.health = newStats.health
            this.hunger = newStats.hunger
            this.rest = newStats.rest

        } catch (error) {
            if (error instanceof Error) {
                Logger.error(`Could not update pet: ${this.id}, data: %O, error: ${error.stack}`, newStats)
            }
        }
    }

    decreaseStat(stat: number) {
        return Math.max(0, stat - 1)
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
