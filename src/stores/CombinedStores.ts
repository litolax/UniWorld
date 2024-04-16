import React from 'react'
import { localStorageStoreInstance } from './localStorage/LocalStorageStore'

export const stores = {
  localStorage: localStorageStoreInstance,
}

export const StoreContext = React.createContext<typeof stores>(stores)
