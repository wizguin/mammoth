import BasePlugin, { type Num, type Str } from '../BasePlugin'

import { createPet } from '@collections/PetCollection'
import Database from '@Database'
import type PetObject from '@objects/pet/Pet'
import type User from '@objects/user/User'

export default class Pet extends BasePlugin {

    events = {
        cw: this.checkWord,
        n: this.namePet,
        g: this.getPets,
        r: this.sendRest,
        p: this.sendPlay,
        f: this.sendFeed,
        t: this.sendTreat,
        s: this.sendPetFrame,
        m: this.sendMovePet
    }

    checkWord(user: User, word: Str) {
        const result = Number(user.pets.checkName(word))

        user.send('cw', word, result)
    }

    namePet(user: User, typeId: Num, name: Str) {
        user.addPet(typeId, name)
    }

    async getPets(user: User, userId: number) {
        let pets: PetObject[]

        if (userId in this.usersById) {
            pets = this.usersById[userId].pets.values

        } else {
            const records = await Database.pet.findMany({
                where: { userId: userId }
            })

            pets = records.map(record => createPet(record))
        }

        user.send('p', 'g', ...pets)
    }

    sendRest(user: User) {

    }

    sendPlay(user: User) {

    }

    sendFeed(user: User) {

    }

    sendTreat(user: User) {

    }

    sendPetFrame(user: User) {

    }

    sendMovePet(user: User, petId: Num, x: Num, y: Num) {
        if (!user.room) {
            return
        }

        if (user.pets.includes(petId)) {
            user.pets.get(petId).setPosition(x, y)

            user.room.send('p', 'm', petId, x, y)
        }
    }

}
