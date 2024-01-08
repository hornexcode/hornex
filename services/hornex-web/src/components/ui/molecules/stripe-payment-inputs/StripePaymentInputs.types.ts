export enum StripeInputType {
  CardNumber = 'CARD_NUMBER',
  CardExp = 'CARD_EXP',
  CardCvc = 'CARD_CVC',
}

/** See also: https://stripe.com/docs/js/element/events/on_change?type=cardNumberElement#element_on_change-handler */
export type StripeChangeEvent = {
  empty: boolean
  error:
    | undefined
    | {
        type: 'validation_error'
        code: string
        message: string
      }
}

export interface StripePaymentInputProps {
  type: StripeInputType
  className?: string
}
