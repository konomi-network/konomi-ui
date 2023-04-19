import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getSelectedAccount } from 'modules/account/reducer';
import { EmptyConnection, EmptyData } from 'components';

type TProps = {
  content?: string;
};

const Empty: React.FC<TProps> = () => {
  const selectedAccount = useSelector(getSelectedAccount);

  if (!selectedAccount) {
    return <EmptyConnection content="view subscription" />;
  }

  return (
    <EmptyData
      content={
        <>
          There is no subscription yet. Explore our <Link to="/oracle">Oracles</Link> to make
          subscription
        </>
      }
    />
  );
};

export default Empty;
