import BasePlugin, { type Num } from '../BasePlugin'

import type User from '@objects/user/User'

export default class Buddy extends BasePlugin {

    events = {
        bq: this.buddyRequest,
        bd: this.buddyDecline
    }

    buddyRequest(user: User, buddyId: Num) {
        if (buddyId in this.usersById) {
            this.usersById[buddyId].addBuddyRequest(user)
        }
    }

    buddyDecline(user: User, buddyId: Num) {
        if (!user.buddyRequests.includes(buddyId)) return

        user.removeBuddyRequest(user)

        if (buddyId in this.usersById) {
            this.usersById[buddyId].send('bd', user.id, user.username)
        }
    }

}
