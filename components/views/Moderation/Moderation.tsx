import { EModerationPage } from '../../../src/types/EModerationPage'
import Feedbacks from './Feedbacks'
import Accounts from './Accounts'
import Events from './Events'
import { TFeedback } from '../../../src/types/TFeedback'
import { TAccount } from '../../../src/types/TAccount'
import { TEvent } from '../../../src/types/TEvent'

const moderationPages: any[] = [Feedbacks, Accounts, Events]
export const Moderation = (props: {
  currentPage: EModerationPage
  feedbacks: TFeedback[]
  accounts: TAccount[]
  events: TEvent[]
}): JSX.Element => {
  const Component = moderationPages[props.currentPage]
  return (
    Component && (
      <Component feedbacks={props.feedbacks} accounts={props.accounts} events={props.events} />
    )
  )
}
