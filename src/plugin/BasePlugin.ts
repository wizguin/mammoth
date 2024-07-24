import type { Rooms, Users, UsersById } from '../handler/Handler'
import type Handler from '../handler/Handler'
import type PlayerRooms from '@objects/room/PlayerRooms'
import type User from '@objects/user/User'

export type { Num, NumArray, NumBetween, Str, StrArray, StrBetween } from './ArgTypes'

type EventHandler = (user: User, ...args: any) => void | Promise<void>

export default class BasePlugin {

    handler: Handler
    users: Users
    usersById: UsersById
    rooms: Rooms
    playerRooms: PlayerRooms
    events!: Record<string, EventHandler>

    constructor(handler: Handler) {
        this.handler = handler

        this.users = handler.users
        this.usersById = handler.usersById
        this.rooms = handler.rooms
        this.playerRooms = handler.playerRooms
    }

}
