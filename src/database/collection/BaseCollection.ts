import Logger from '@Logger'
import type User from '@objects/user/User'

type IndexKey<R> = Extract<keyof R, string>

export default abstract class BaseCollection<R> {

    user: User
    indexKey: IndexKey<R>
    collection: Record<string, R>

    constructor(user: User, records: R[], indexKey: IndexKey<R>) {
        this.user = user
        this.indexKey = indexKey

        this.collection = {}

        this.collect(records)
    }

    get keys() {
        return Object.keys(this.collection)
    }

    get values() {
        return Object.values(this.collection)
    }

    get count() {
        return this.keys.length
    }

    abstract add(...args: (number | string)[]): void

    remove?(...args: (number | string)[]): void

    collect(records: R[]) {
        records.forEach(record => this.updateCollection(record))
    }

    updateCollection(record: R) {
        const indexValue = record[this.indexKey]

        if (typeof indexValue === 'string' || typeof indexValue === 'number') {
            this.collection[indexValue.toString()] = record

        } else {
            Logger.error(`Invalid index key: ${this.indexKey}`)
        }
    }

    includes(key: string) {
        return key in this.collection
    }

    toString() {
        return this.keys.join('%')
    }

}
