import Create from './Create'
import { EEventPage } from '../../../src/types/EEventPage'

const eventPages: any[] = [Create]
export const Event = (props: { currentPage: EEventPage }): JSX.Element => {
  const Component = eventPages[props.currentPage]
  return Component && <Component />
}
