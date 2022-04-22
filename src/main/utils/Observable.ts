interface ISubject {
  subscribe(observer: Observer): void
  unsubscribe(observer: Observer): void
  notify(): void
}

interface IObserver {
  update(): void
}

export class Subject implements ISubject {
  private observers: Observer[] = []
  subscribe(observer: Observer) {
    this.observers.push(observer)
  }
  unsubscribe(observer: Observer) {
    this.observers = this.observers.filter((element) => {
      return observer.id === element.id
    })
  }
  notify() {
    this.observers.forEach((observer) => {
      observer.update()
    })
  }
}

export class Observer implements IObserver {
  constructor(public readonly id: number) {}
  update() {
    console.log(`Observer ${this.id} is updating...`)
  }
}
