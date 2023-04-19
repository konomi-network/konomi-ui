import { getSelectedAccount } from 'modules/account/reducer';
import { useSelector } from 'react-redux';
import { displayFloat } from 'utils/formatter';

type TProps = {
  tab: string | null;
  balance: number;
};
const BalanceSection: React.FC<TProps> = ({ tab, balance }) => {
  const selectedAccount = useSelector(getSelectedAccount);

  const renderContent = () => {
    if (tab === 'withdraw' || !selectedAccount) {
      return null;
    }
    return <>{displayFloat(balance, 2)} Available in Wallet </>;
  };

  return (
    <span className="relative text-white text-md font-light font-rubik mt-12 mb-2 flex items-center justify-center h-6">
      {renderContent()}
    </span>
  );
};

export default BalanceSection;
