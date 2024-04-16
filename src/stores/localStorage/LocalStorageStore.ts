import { action, makeObservable } from 'mobx'

export default class LocalStorageStore {
  constructor() {
    makeObservable(this)
  }

  @action
  set(key: string, value: any): void {
    localStorage.setItem(key, value)
  }

  @action
  get(key: string): any {
    return localStorage.getItem(key)
  }

  @action
  remove(key: string): void {
    localStorage.removeItem(key)
  }

  @action
  clear(): void {
    localStorage.clear()
  }
}

export const localStorageStoreInstance = new LocalStorageStore()
