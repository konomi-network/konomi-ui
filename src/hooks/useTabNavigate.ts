import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

type TTabOption = {
  label: JSX.Element | React.FC | React.Component | string;
  value: string;
};

const useTabNavigate = (tabOptions: TTabOption[]) => {
  const [tabSelected, setTabSelected] = useState<string>(tabOptions[0].value);
  const [searchParams, setSearchParams] = useSearchParams();

  const changeTab = (value: string) => {
    setSearchParams({ tab: value }, { replace: true });
  };

  useEffect(() => {
    const tab = new URLSearchParams(searchParams).get('tab');
    if (tab) {
      setTabSelected(tab);
    } else {
      setTabSelected(tabOptions[0].value);
    }
  }, [searchParams, setTabSelected, tabOptions]);

  return { tabSelected, changeTab };
};

export default useTabNavigate;
