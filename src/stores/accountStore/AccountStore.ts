import { action, makeObservable, observable } from 'mobx'
import { TAccount } from '../../types/TAccount'

export default class AccountStore {
  constructor() {
    makeObservable(this)
  }

  @observable account?: TAccount

  @action
  setAccount(account?: TAccount): void {
    this.account = account
  }
}

export const accountStoreInstance = new AccountStore()
