import BasePlugin, { type Num } from '../BasePlugin'

import Database from '@Database'
import type User from '@objects/user/User'

export default class Buddy extends BasePlugin {

    events = {
        bq: this.buddyRequest,
        ba: this.buddyAccept,
        bd: this.buddyDecline
    }

    buddyRequest(user: User, buddyId: Num) {
        if (!(buddyId in this.usersById)) return

        this.usersById[buddyId].addBuddyRequest(user.id, user.username)
    }

    async buddyAccept(user: User, buddyId: Num) {
        if (!user.buddyRequests.includes(buddyId)) return

        user.removeBuddyRequest(buddyId)
        user.addBuddy(buddyId)

        if (buddyId in this.usersById) {
            const buddy = this.usersById[buddyId]

            buddy.addBuddy(user.id)
            buddy.send('ba', user.id, user.username)

            return
        }

        await Database.buddy.create({
            data: {
                userId: buddyId,
                buddyId: user.id
            }
        })
    }

    buddyDecline(user: User, buddyId: Num) {
        if (!user.buddyRequests.includes(buddyId)) return

        user.removeBuddyRequest(user.id)

        if (!(buddyId in this.usersById)) return

        this.usersById[buddyId].send('bd', user.id, user.username)
    }

}
