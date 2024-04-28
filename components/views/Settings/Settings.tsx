import { Main } from './Main'
import { MFA } from './MFA'
import { ESettingPage } from '../../../src/types/ESettingPage'

const settingPages: any[] = [Main, MFA]
export const Settings = (props: { currentPage: ESettingPage }): JSX.Element => {
  const Component = settingPages[props.currentPage]
  return Component && <Component />
}
