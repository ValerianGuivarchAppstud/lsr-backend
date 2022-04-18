import { mergeNonNull } from '../../../../main/domain/helpers/EntityUtils'

test('EntityUtils.merge()', async () => {
  class Entity {
    title: string
    description: string
    files: string[]

    constructor(p: Partial<Entity>) {
      this.title = p.title ?? ''
      this.description = p.description ?? ''
    }
  }

  const entityOriginal = new Entity({
    title: 'my title original',
    description: 'my description original',
    files: ['one original', 'two original']
  })

  const entityUpdate: Partial<Entity> = {
    description: 'my description updated',
    files: undefined
  }

  const merged = mergeNonNull(entityOriginal, entityUpdate)

  expect(merged.title).toBe(entityOriginal.title)
  expect(merged.description).toBe(entityUpdate.description)
  expect(merged.files).toStrictEqual(entityOriginal.files)

  const entityUpdateTwo: Partial<Entity> = {
    title: 'my title updated',
    files: ['one updated']
  }

  const mergedTwo = mergeNonNull(entityOriginal, entityUpdateTwo)

  expect(mergedTwo.title).toBe(entityUpdateTwo.title)
  expect(mergedTwo.description).toBe(entityOriginal.description)
  expect(mergedTwo.files).toStrictEqual(entityUpdateTwo.files)
})

test('EntityUtils.merge() - with undefined origin', async () => {
  class Entity {
    title: string
    description: string
    files: string[]

    constructor(p: Partial<Entity>) {
      this.title = p.title ?? ''
      this.description = p.description ?? ''
    }
  }

  const entityUpdate: Partial<Entity> = {
    description: 'my description updated',
    files: undefined
  }

  const merged = mergeNonNull(undefined, entityUpdate)

  expect(merged?.title).toBeUndefined()
  expect(merged?.description).toBe(entityUpdate.description)
  expect(merged?.files).toBeUndefined()
})

test('EntityUtils.merge() - with primitve types', async () => {
  class Entity {
    string?: string
    boolean?: boolean
    number?: number
    files: string[]

    constructor(p: Partial<Entity>) {
      this.string = p.string
      this.boolean = p.boolean
      this.number = p.number
      this.files = p.files ?? []
    }
  }

  const entityOriginal: Entity = {
    string: 'my description',
    boolean: true,
    number: 1,
    files: ['one']
  }
  const entityUpdate: Partial<Entity> = {
    string: 'my description updated',
    boolean: false,
    number: 2,
    files: ['one', 'two']
  }

  const merged = mergeNonNull(entityOriginal, entityUpdate)

  expect(merged?.string).toBe(entityUpdate.string)
  expect(merged?.boolean).toBe(entityUpdate.boolean)
  expect(merged?.number).toBe(entityUpdate.number)
  expect(merged?.files).toStrictEqual(entityUpdate.files)
})
