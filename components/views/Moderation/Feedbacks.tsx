import { TFeedback } from '../../../src/types/TFeedback'

export const Feedbacks = (props: { feedbacks: TFeedback[] }): JSX.Element => {
  console.log('feedbacks: ', props.feedbacks)
  return <div>Test Feedbacks</div>
}

export default Feedbacks
