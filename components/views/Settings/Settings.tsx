import { Main } from './Main'
import { ESettingPage } from '../../../src/types/ESettingPage'
import { TAccount } from '../../../src/types/TAccount'

const settingPages: any[] = [Main]
export const Settings = (props: { currentPage: ESettingPage; account: TAccount }): JSX.Element => {
  const Component = settingPages[props.currentPage]
  return Component && <Component account={props.account} />
}
