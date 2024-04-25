import type User from '@objects/user/User'

export function handleOnce(originalMethod: any, _context: ClassMethodDecoratorContext) {
    const handledUsers: User[] = []

    return function replacementMethod(this: any, ...args: any[]): any {
        const user = args[0]

        if (handledUsers.includes(user)) return

        handledUsers.push(user)
        originalMethod.call(this, ...args)
    }
}
