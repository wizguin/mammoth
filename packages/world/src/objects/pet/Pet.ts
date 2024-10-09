import { Database, Logger } from '@mammoth/shared'
import { pets } from '@mammoth/shared/data'

import type { Pet as PrismaPet } from '@prisma/client'

export interface Updates {
    health?: number,
    hunger?: number,
    rest?: number
}

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

    async updateStats(updates: Updates) {
        this.health = this.getNewStat(this.health, updates.health, this.maxHealth)
        this.hunger = this.getNewStat(this.hunger, updates.hunger, this.maxHunger)
        this.rest = this.getNewStat(this.rest, updates.rest, this.maxRest)

        try {
            await Database.pet.update({
                where: {
                    id: this.id
                },
                data: {
                    health: this.health,
                    hunger: this.hunger,
                    rest: this.rest
                }
            })

        } catch (error) {
            Logger.error(error)
        }
    }

    getNewStat(currentValue: number, update: number | undefined, maxValue: number) {
        if (!update) {
            return currentValue
        }

        return Math.min(Math.max(0, currentValue + update), maxValue)
    }

    async decreaseStats(updateMultiplier = 1) {
        if (this.health === 0 && this.hunger === 0 && this.rest === 0) {
            return
        }

        await this.updateStats({
            health: -1 * updateMultiplier,
            hunger: -1 * updateMultiplier,
            rest: -1 * updateMultiplier
        })
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
