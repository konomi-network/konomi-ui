import { useNavigate } from 'react-router-dom';
import { Button, Dropdown } from 'components';
import { displayAddress } from 'utils/formatter';
import NetworkLogo from './NetworkLogo';

type TProps = {
  address: string;
  onDisconnect: () => void | {};
};

const ConnectedDropdownMenu: React.FC<TProps> = (props) => {
  const { address, onDisconnect } = props;
  const navigate = useNavigate();

  return (
    <Dropdown
      className="w-full h-full flex items-center"
      options={[
        {
          label: 'Dashboard',
          onChange: () => navigate('/summary'),
          key: 0
        },
        {
          label: 'Disconnect',
          key: 1,
          onChange: onDisconnect
        }
      ]}>
      <Button className="w-full border-2 font-bold relative">
        <NetworkLogo />
        {displayAddress(address)}
      </Button>
    </Dropdown>
  );
};

export default ConnectedDropdownMenu;
