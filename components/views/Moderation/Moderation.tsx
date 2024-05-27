import { EModerationPage } from '../../../src/types/EModerationPage'
import Feedbacks from './Feedbacks'
import Accounts from './Accounts'
import Events from './Events'

const moderationPages: any[] = [Feedbacks, Accounts, Events]
export const Moderation = (props: { currentPage: EModerationPage }): JSX.Element => {
  const Component = moderationPages[props.currentPage]
  return Component && <Component />
}
