export class Utils {
  static uniqByReduce<T>(array: T[]): T[] {
    return array.reduce((acc: T[], cur: T) => {
      if (!acc.includes(cur)) {
        acc.push(cur)
      }
      return acc
    }, [])
  }

  static removeElementFromArray(arrayElements: unknown[], element: unknown): unknown[] {
    arrayElements.forEach((value, index) => {
      if (value == element) arrayElements.splice(index, 1)
    })
    return arrayElements
  }
}
