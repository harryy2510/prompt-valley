import { createStore } from 'zustand-x'
import { trackUpgradeModalOpened } from '@/libs/posthog'

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

export function showBuyDialog(source = 'unknown') {
  trackUpgradeModalOpened(source)
  appStore.set('buyDialog', true)
}
