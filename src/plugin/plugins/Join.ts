import BasePlugin from '../BasePlugin'

import type User from '@objects/user/User'


export default class Join extends BasePlugin {

    events = {
        js: this.joinServer,
        jr: this.joinRoom
    }

    joinServer(args: any[], user: User) {
        user.send('js')
        user.send('gi', user.inventory.map(i => i.itemId).join('%'))
        user.send('jr', 100)
    }

    joinRoom(args: any[], user: User) {
        user.send('jr', args[1])
    }

}
