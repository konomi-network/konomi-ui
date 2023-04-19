import { useSelector } from 'react-redux';
import { getSelectedAccount } from 'modules/account/reducer';
import { ReactComponent as KonoLogoIcon } from '../images/konoLogo.svg';
import { PLATFORM } from 'config/settings';

const LogoSection: React.FC = () => {
  const selectedAccount = useSelector(getSelectedAccount);

  return (
    <div
      className={`flex items-center justify-center mt-12 mb-8 relative ${
        !selectedAccount && 'opacity-50'
      }`}>
      <KonoLogoIcon width={40} height={40} className="mr-4" />
      <span className="text-primary font-medium text-3xl letter font-rubik tracking-wider">
        {PLATFORM.tokenName}
      </span>
    </div>
  );
};

export default LogoSection;
