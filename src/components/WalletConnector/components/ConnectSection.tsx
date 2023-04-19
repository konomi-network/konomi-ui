import { Button } from 'components';

type TProps = {
  toggleConnectModal: () => void;
};

const ConnectSection: React.FC<TProps> = ({ toggleConnectModal }) => {
  return (
    <Button className="w-full border-2 font-bold px-0" onClick={toggleConnectModal}>
      Connect To Wallet
    </Button>
  );
};

export default ConnectSection;
