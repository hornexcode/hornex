import { Elements } from '@stripe/react-stripe-js'
import { Meta, Story } from '@storybook/react'

import StripePaymentInputs from './StripePaymentInputs'
import { StripePaymentInputProps } from './StripePaymentInputs.types'
import Form from '@/components/organisms/Form'

const MetaData = {
  component: StripePaymentInputs,
  title: 'molecules/StripePaymentInputs',
} as Meta

const Template: Story<StripePaymentInputProps> = () => (
  <Form onSubmit={(data) => console.log('state:', data)} className={'flex flex-col gap-4'}>
    <Elements stripe={null}>
      <StripePaymentInputs />
    </Elements>
  </Form>
)

const Default = Template.bind({})

export { Default }

export default MetaData
