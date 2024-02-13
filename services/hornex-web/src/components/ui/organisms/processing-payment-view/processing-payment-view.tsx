import Loader from '../../atoms/loader';

const ProcessingPaymentView = () => {
  return (
    <div className="bg-medium-dark flex flex-col justify-center rounded p-6">
      <div className="mb-4">Aguarde enquanto processamos seu pagamento...</div>
      <div className="mx-auto">
        <Loader variant="blink" />
      </div>
    </div>
  );
};

export default ProcessingPaymentView;
