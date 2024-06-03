import { Main } from './Main'
import { MFA } from './MFA'
import { Password } from './Password'
import { ESettingPage } from '../../../src/types/ESettingPage'
import { TAccount } from '../../../src/types/TAccount'

const settingPages: any[] = [Main, Password, MFA]
export const Settings = (props: { currentPage: ESettingPage; account: TAccount }): JSX.Element => {
  const Component = settingPages[props.currentPage]
  return Component && <Component account={props.account} />
}
