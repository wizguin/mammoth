import type User from '@objects/user/User'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function handleOnce(originalMethod: any, context: ClassMethodDecoratorContext) {
    const handledUsers: User[] = []

    return function replacementMethod(this: any, ...args: any[]) {
        const user = args[0]

        if (handledUsers.includes(user)) return

        handledUsers.push(user)
        originalMethod.call(this, ...args)
    }
}
