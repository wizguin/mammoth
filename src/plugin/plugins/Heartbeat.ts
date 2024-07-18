import BasePlugin from '../BasePlugin'

import type User from '@objects/user/User'

export default class Heartbeat extends BasePlugin {

    events = {
        h: this.heartbeat
    }

    heartbeat(user: User) {
        user.send('h')
    }

}
