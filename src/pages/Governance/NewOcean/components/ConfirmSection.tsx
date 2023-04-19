import { PLATFORM } from 'config/settings';
import { displayFloat } from 'utils/formatter';

type TProps = {
  finalStep: number;
  currentStep: number;
  confirmButton: React.ReactNode;
  errorMsg: string;
  price: string | number;
};

const ConfirmSection: React.FC<TProps> = ({
  finalStep,
  currentStep,
  confirmButton,
  errorMsg,
  price
}) => {
  if (finalStep === currentStep)
    return (
      <div className="w-[400px] flex justify-end mt-4 ml-auto">
        <div className="flex flex-col w-full">
          <div className="text-error text-sm text-left w-full mb-2 break-all">{errorMsg}</div>
          <div className="relative mb-2 h-[70px] border border-primary border-solid rounded-md">
            <div className="absolute top-2 left-3 font-normal text-sm text-primary">
              Estimated operation fee:
            </div>
            <div className="absolute right-3 bottom-2 font-bold text-primary">{`${displayFloat(
              +price,
              4
            )} ${PLATFORM.tokenName}`}</div>
          </div>
          {confirmButton}
        </div>
      </div>
    );

  return null;
};

export default ConfirmSection;
