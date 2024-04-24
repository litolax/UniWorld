import React from 'react'
import { localStorageStoreInstance } from './localStorage/LocalStorageStore'
import { accountStoreInstance } from './accountStore/AccountStore'

export const stores = {
  localStorage: localStorageStoreInstance,
  accountStore: accountStoreInstance,
}

export const StoreContext = React.createContext<typeof stores>(stores)
