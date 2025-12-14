import { createStore } from 'zustand-x'

export const appStore = createStore(
  {
    signInDialog: false,
    buyDialog: false,
  },
  {
    name: 'app',
    devtools: true,
  },
)

export function showSignInDialog() {
  appStore.set('signInDialog', true)
}

export function showBuyDialog() {
  appStore.set('buyDialog', true)
}
