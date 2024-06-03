import Create from './Create'
import { EEventPage } from '../../../src/types/EEventPage'
import { TAccount } from '../../../src/types/TAccount'

const eventPages: any[] = [Create]
export const Event = (props: { currentPage: EEventPage; account: TAccount }): JSX.Element => {
  const Component = eventPages[props.currentPage]
  return Component && <Component account={props.account} />
}
