import Logger from '@Logger'
import { rateLimit } from '@Config'

import { RateLimiterMemory } from 'rate-limiter-flexible'

export default class RateLimiter {

    addressConnects: RateLimiterMemory
    addressEvents: RateLimiterMemory
    userEvents: RateLimiterMemory

    constructor() {
        Logger.success('Enabling rate limiting')

        this.addressConnects = this.createLimiter(rateLimit.addressConnectsPerSecond)
        this.addressEvents = this.createLimiter(rateLimit.addressEventsPerSecond)
        this.userEvents = this.createLimiter(rateLimit.userEventsPerSecond)
    }

    createLimiter(points: number) {
        return new RateLimiterMemory({
            points: points,
            duration: 1
        })
    }

}
