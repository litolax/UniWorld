import { Main } from './Main'
import { ESettingPage } from '../../../src/types/ESettingPage'

const settingPages: any[] = [Main]
export const Settings = (props: { currentPage: ESettingPage }): JSX.Element => {
  const Component = settingPages[props.currentPage]
  return Component && <Component />
}
