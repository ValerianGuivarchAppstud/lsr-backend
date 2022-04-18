import { pushUnique, uniqueArray } from '../../../../main/domain/helpers/ArraysHelpers'

test('ArrayHelpers.pushUnique()', async () => {
  const arrayIn = ['aaa', 'bbb']
  expect(pushUnique('aaa', arrayIn)).toEqual(arrayIn)
})

test('ArrayHelpers.uniqueArray()', async () => {
  const arrayIn = ['aaa', 'bbb', 'bbb']
  expect(uniqueArray(arrayIn)).toEqual(['aaa', 'bbb'])
})
