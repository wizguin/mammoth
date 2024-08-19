import { addressConnectsPerSecond, addressEventsPerSecond, userEventsPerSecond } from '@Config'
import Logger from '@Logger'

import { RateLimiterMemory } from 'rate-limiter-flexible'

export default class RateLimiter {

    addressConnects: RateLimiterMemory
    addressEvents: RateLimiterMemory
    userEvents: RateLimiterMemory

    constructor() {
        Logger.success('Enabling rate limiting')

        this.addressConnects = this.createLimiter(addressConnectsPerSecond)
        this.addressEvents = this.createLimiter(addressEventsPerSecond)
        this.userEvents = this.createLimiter(userEventsPerSecond)
    }

    createLimiter(points: number) {
        return new RateLimiterMemory({
            points: points,
            duration: 1
        })
    }

}
