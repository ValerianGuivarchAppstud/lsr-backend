import { ValidationHelper } from '../../../main/domain/helpers/ValidationHelpers'
import Ajv from 'ajv'
import S from 'fluent-json-schema'
import mongoose from 'mongoose'

// beforeAll(async () => {})

// beforeEach(async () => {})

// afterEach(async () => {})

// afterAll(async () => {})

test('FluentSchema.stringNotEmpty()', async () => {
  const schema = S.object().prop('prop', S.string().pattern(ValidationHelper.NON_EMPTY_STRING).required())

  const ajv = new Ajv({ allErrors: true })
  const validate = ajv.compile(schema.valueOf())

  expect(validate({})).toBe(false)

  expect(
    validate({
      prop: ''
    })
  ).toBe(false)

  expect(
    validate({
      prop: '     '
    })
  ).toBe(false)

  expect(
    validate({
      prop: '     qsdqdqd'
    })
  ).toBe(true)

  expect(
    validate({
      prop: 'a'
    })
  ).toBe(true)
})

test('FluentSchema.stringOptionalNotEmpty()', async () => {
  const schema = S.object()
    .prop('required', S.string().pattern(ValidationHelper.NON_EMPTY_STRING).required())
    .prop('optional', S.string().pattern(ValidationHelper.NON_EMPTY_STRING))

  const ajv = new Ajv({ allErrors: true })
  const validate = ajv.compile(schema.valueOf())

  expect(
    validate({
      required: 'a',
      optional: ''
    })
  ).toBe(false)

  expect(
    validate({
      required: 'a'
    })
  ).toBe(true)

  expect(
    validate({
      required: 'a',
      optional: undefined
    })
  ).toBe(true)

  expect(
    validate({
      required: 'a',
      optional: 'a'
    })
  ).toBe(true)
})

test('FluentSchema.mongoId()', async () => {
  const schema = S.object().prop('prop', S.string().pattern(ValidationHelper.REGEX_BSON_ID).required())

  const ajv = new Ajv({ allErrors: true })
  const validate = ajv.compile(schema.valueOf())

  expect(
    validate({
      prop: ''
    })
  ).toBe(false)

  expect(
    validate({
      prop: '     '
    })
  ).toBe(false)

  const id = new mongoose.Types.ObjectId().toString()
  expect(
    validate({
      prop: `${id}f`
    })
  ).toBe(false)

  expect(
    validate({
      prop: id
    })
  ).toBe(true)
})
