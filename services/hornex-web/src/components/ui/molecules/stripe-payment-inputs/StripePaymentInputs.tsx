import { FC } from 'react'

import StripePaymentInput from './StripePaymentInput'
import { StripeInputType } from './StripePaymentInputs.types'

/**
 * Convenience component to group together all Stripe Payment Inputs
 */
const StripePaymentInputs: FC<{}> = () => {
  return (
    <>
      <StripePaymentInput type={StripeInputType.CardNumber} className="my-4" />
      <div className="flex flex-row items-start mb-4">
        <StripePaymentInput type={StripeInputType.CardExp} className="w-full" />
        <StripePaymentInput type={StripeInputType.CardCvc} className="w-full ml-2" />
      </div>
    </>
  )
}

export default StripePaymentInputs
