import { useEffect, useState } from 'react';

export type Config = {
  name: string;
  type: 'BOOLEAN' | 'STRING' | 'NUMBER';
  value: string | number | boolean;
};

const useConfig = ({ name }: { name: string }) => {
  const [config, setConfig] = useState<Config | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchConfig = async () => {
    setLoading(true);
    // const { data } = await getConfig({ name });
    const config: Config = {
      name: '',
      type: 'BOOLEAN',
      value: '1',
    };

    const data: {
      name: string;
      type: 'BOOLEAN' | 'NUMBER' | 'STRING';
      value: string;
    } = {
      name: 'tournament_registration_open',
      type: 'BOOLEAN',
      value: '1',
    };

    config.name = data.name;
    config.type = data.type as Config['type'];

    switch (data.type) {
      case 'BOOLEAN':
        config.value = data.value === '1';
        break;
      case 'NUMBER':
        config.value = Number(data.value);
        break;
      default:
        config.value = data.value;
    }

    setConfig({
      name: data.name,
      type: data.type,
      value: data.value,
    });

    setLoading(false);
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  return { config, loading };
};

export { useConfig };
