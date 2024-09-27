import type Handler from '../handler/Handler'
import type PlayerRooms from '@objects/room/PlayerRooms'
import type { Rooms } from '../handler/Handler'
import type User from '@objects/user/User'

export type { Num, NumArray, NumBetween, Str, StrArray, StrBetween } from './ArgTypes'

type EventHandler = (user: User, ...args: any) => void | Promise<void>

export default class BasePlugin {

    handler: Handler
    rooms: Rooms
    playerRooms: PlayerRooms
    events!: Record<string, EventHandler>

    constructor(handler: Handler) {
        this.handler = handler

        this.rooms = handler.rooms
        this.playerRooms = handler.playerRooms
    }

    get users() {
        return this.handler.users
    }

    get usersLength() {
        return this.handler.usersLength
    }

}
