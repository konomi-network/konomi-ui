import { useNavigate } from 'react-router-dom';
import PlusOutlined from '@ant-design/icons/PlusOutlined';
import { Button } from 'components';

const ToNewProposal: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Button className="flex items-center text-sm px-4 py-2" onClick={() => navigate('new-oracle')}>
      New proposal
      <PlusOutlined className="ml-2" />
    </Button>
  );
};

export default ToNewProposal;
