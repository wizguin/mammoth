import BasePlugin, { type Num, type StrBetween } from '../BasePlugin'

import type User from '@objects/user/User'

export default class Chat extends BasePlugin {

    events = {
        sm: this.sendMessage,
        ss: this.sendSafe,
        se: this.sendEmote,
        sj: this.sendJoke
    }

    sendMessage(user: User, userId: Num, message: StrBetween<1, 80>) {
        user.sendRoom('sm', user.id, message)
    }

    sendSafe(user: User, messageId: Num) {
        user.sendRoom('ss', user.id, messageId)
    }

    sendEmote(user: User, emoteId: Num) {
        user.sendRoom('se', user.id, emoteId)
    }

    sendJoke(user: User, jokeId: Num) {
        user.sendRoom('sj', user.id, jokeId)
    }

}
