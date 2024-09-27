import PlayerRoom from '@objects/room/PlayerRoom'
import type User from '@objects/user/User'

/**
 * Only allow decorated function to be called once per user.
 */
export function handleOnce(
    originalMethod: any,
    _context: ClassMethodDecoratorContext
) {
    const handledUsers: User[] = []

    return function(this: any, ...args: any[]): any {
        const user = args[0] as User

        if (handledUsers.includes(user)) {
            return
        }

        handledUsers.push(user)
        originalMethod.call(this, ...args)
    }
}

/**
 * Only allow decorated function to be called when room matches.
 *
 * @param roomName - Allowed room name
 */
export function inRoom(roomName: string) {
    return function(
        originalMethod: any,
        _context: ClassMethodDecoratorContext
    ) {
        return function(this: any, ...args: any[]): any {
            const user = args[0] as User

            if (user.room?.name.toLowerCase() === roomName.toLowerCase()) {
                originalMethod.call(this, ...args)
            }
        }
    }
}

/**
 * Only allow decorated function to be called when in owned player room.
 */
export function inOwnedRoom(
    originalMethod: any,
    _context: ClassMethodDecoratorContext
) {
    return function(this: any, ...args: any[]): any {
        const user = args[0] as User

        if (user.room instanceof PlayerRoom && user.room.userId === user.id) {
            originalMethod.call(this, ...args)
        }
    }
}
