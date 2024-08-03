import BasePlugin, { type Num, type Str } from '../BasePlugin'

import type User from '@objects/user/User'

export default class Pet extends BasePlugin {

    events = {
        cw: this.checkWord,
        n: this.namePet,
        a: this.addPet,
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

    }

    addPet(user: User) {

    }

    getPets(user: User, userId: number) {
        user.send('p', 'g', user.pets)
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
        user.room?.send('p', 'm', petId, x, y)
    }

}
