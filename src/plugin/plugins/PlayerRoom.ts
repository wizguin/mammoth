import BasePlugin, { type Num, type StrArray } from '../BasePlugin'

import Database from '@Database'
import type User from '@objects/user/User'

const furnitureStringRegex = /^(\d+\|){4}\d+$/

export default class PlayerRoom extends BasePlugin {

    events = {
        // gm: this.getPlayerRoom,
        // g: this.getPets,
        gf: this.getFurnitureList,
        gr: this.getRoomList,
        af: this.addFurniture,
        ur: this.updatePlayerRoom,
        au: this.addPlayerRoomUpgrade,
        or: this.openPlayerRoom,
        cr: this.closePlayerRoom
    }

    getFurnitureList(user: User) {
        if (user.furniture.count) {
            user.send('gf', user.furniture)
        } else {
            user.send('gf')
        }
    }

    getRoomList(user: User) {
        user.send('gr', this.playerRooms.openRooms)
    }

    addFurniture(user: User, furnitureId: Num) {
        user.addFurniture(furnitureId)
    }

    async updatePlayerRoom(user: User, playerRoomId: Num, ...furniture: StrArray) {
        if (!this.playerRooms.includes(user.id)) return

        const playerRoom = await this.playerRooms.get(user.id)
        const quantities: Record<number, number> = {}

        await playerRoom.clearFurniture()

        for (const f of furniture) {
            if (!furnitureStringRegex.test(f)) continue

            const [id, x, y, rotation, frame] = f.split('|').map(i => parseInt(i))

            // Check furniture inventory
            if (!user.furniture.includes(id)) continue

            // Update quantity
            quantities[id] = id in quantities
                ? quantities[id] + 1
                : 1

            // Check quantity
            if (quantities[id] > user.furniture.getQuantity(id)) continue

            playerRoom.addFurniture({ userId: user.id, furnitureId: id, x, y, rotation, frame })
        }

        await Database.playerRoomFurniture.createMany({
            data: playerRoom.furniture
        })
    }

    async addPlayerRoomUpgrade(user: User, playerRoomId: Num) {
        if (!this.playerRooms.includes(user.id)) return

        await Database.playerRoom.update({
            data: {
                playerRoomId: playerRoomId
            },
            where: {
                userId: user.id
            }
        })

        const playerRoom = await this.playerRooms.get(user.id)

        await playerRoom.clearFurniture()

        user.send('au', playerRoomId, user.coins)
    }

    openPlayerRoom(user: User) {
        this.playerRooms.openRoom(user)
    }

    closePlayerRoom(user: User) {
        this.playerRooms.closeRoom(user)
    }

}
