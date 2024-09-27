import Joi from 'joi'

export interface Body {
    Username: string,
    Email: string,
    Password: string,
    Colour: number,
    IsSafeMode: number,
    ParentPassword?: string,
    ParentHint?: string,
    NameKey: string,
    AffiliateId: number,
    AgeGroup: number
}

// Letters, numbers, spaces, at least one letter, no extra whitespace
const validUsername = /^(?=.*[a-zA-Z])[a-zA-Z0-9]+( [a-zA-Z0-9]+)*$/

const invalidUsername = /^penguin/i

const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const username = Joi.string()
    .trim()
    .regex(validUsername)
    .min(4)
    .max(12)
    .regex(invalidUsername, { invert: true })
    .required()

const email = Joi.string()
    .trim()
    .regex(validEmail)
    .max(60)
    .required()

export const password = Joi.string()
    .min(5)
    .max(32)
    .required()

const color = Joi.number()
    .integer()
    .min(1)
    .max(12)
    .required()

export const safeMode = Joi.number()
    .integer()
    .valid(0, 1)
    .required()

const parentPassword = Joi.string()
    .empty('')
    .min(5)
    .max(32)

const parentHint = Joi.string()
    .trim()
    .empty('')
    .max(48)

export const schema = Joi.object<Body, true>({
    Username: username,
    Email: email,
    Password: password,
    Colour: color,
    IsSafeMode: safeMode,
    ParentPassword: parentPassword,
    ParentHint: parentHint,
    NameKey: Joi.string(),
    AffiliateId: Joi.number(),
    AgeGroup: Joi.number()
})
