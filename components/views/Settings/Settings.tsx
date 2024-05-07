import { Main } from './Main'
import { MFA } from './MFA'
import { Password } from './Password'
import { ESettingPage } from '../../../src/types/ESettingPage'

const settingPages: any[] = [Main, Password, MFA]
export const Settings = (props: { currentPage: ESettingPage }): JSX.Element => {
  const Component = settingPages[props.currentPage]
  return Component && <Component />
}
