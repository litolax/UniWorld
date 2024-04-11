import { EMainViewTabType } from './EMainViewTabType'

export type TMainViewTab = {
  type: EMainViewTabType
  name: string
  sections?: { title: string; click: () => void }[]
  onClick?: () => void
}
