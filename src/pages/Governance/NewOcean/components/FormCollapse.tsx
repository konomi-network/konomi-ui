import { Collapse } from 'components';

type TProps = {
  className?: string;
  title: string;
  options: any[];
  children?: any;
};

const FormCollapse: React.FC<TProps> = (props) => {
  return <Collapse showCollapse editable {...props} />;
};

export default FormCollapse;
