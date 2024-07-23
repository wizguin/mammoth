import BasePlugin, { type Num } from '../BasePlugin'

import type User from '@objects/user/User'

export default class Buddy extends BasePlugin {

    events = {
        bq: this.buddyRequest
    }

    buddyRequest(user: User, buddyId: Num) {
        if (buddyId in this.usersById) {
            this.usersById[buddyId].addBuddyRequest(user)
        }
    }

}
