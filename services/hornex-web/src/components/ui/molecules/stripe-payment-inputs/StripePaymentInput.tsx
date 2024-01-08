import {
  ExternalPaymentInputValidationResponse,
  ExternalPaymentInputValidationState,
} from '../ExternalPaymentInput';
import ExternalPaymentInput from '../ExternalPaymentInput/ExternalPaymentInput';
import {
  StripeChangeEvent,
  StripeInputType,
  StripePaymentInputProps,
} from './StripePaymentInputs.types';
import { colors } from '@/theme/colors';
import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
} from '@stripe/react-stripe-js';
import { FC } from 'react';

const StripePaymentInput: FC<StripePaymentInputProps> = ({
  type,
  className,
}) => {
  // See: https://stripe.com/docs/js/appendix/style#style_object
  const style = {
    base: {
      color: colors['soft-black'].core,
    },
    invalid: {
      color: colors.red.core,
    },
  };

  const validate = (
    changeEvent: StripeChangeEvent
  ): ExternalPaymentInputValidationResponse => {
    const externalErrorMessage = changeEvent.error?.message;
    const isEmpty = changeEvent.empty;

    switch (true) {
      case !!externalErrorMessage:
        return {
          state: ExternalPaymentInputValidationState.Invalid,
          message: externalErrorMessage,
        };
      case isEmpty:
        return { state: ExternalPaymentInputValidationState.Empty };
      default:
        return { state: ExternalPaymentInputValidationState.Valid };
    }
  };

  switch (type) {
    case StripeInputType.CardNumber:
      return (
        <ExternalPaymentInput
          name="number"
          containerClassName={className}
          label="Credit card number"
          component={CardNumberElement}
          required="Your credit card number is required."
          style={style}
          validate={validate}
        />
      );
    case StripeInputType.CardExp:
      return (
        <ExternalPaymentInput
          name="expiry"
          containerClassName={className}
          label="Expiration date"
          component={CardExpiryElement}
          required="Your card's expiration date is required."
          style={style}
          validate={validate}
        />
      );
    case StripeInputType.CardCvc:
      return (
        <ExternalPaymentInput
          name="cvc"
          containerClassName={className}
          label="CVC"
          component={CardCvcElement}
          required="Your card's security code is required."
          style={style}
          validate={validate}
        />
      );
    default:
      console.warn('unspecified Stripe input type');
      return <></>;
  }
};

export default StripePaymentInput;
