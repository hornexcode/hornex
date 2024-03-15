import { LoginForm } from '@/components/ui/templates/login-form/login-form';
import { Token } from '@/lib/auth/auth-context.types';
import { dataLoader } from '@/lib/request';

const { submit: login } = dataLoader<Token, LoginForm>('login');

const handleLogin = async (data: LoginForm) => {
  const { data: session, error } = await login({}, data);
  if (error) {
    return error;
  }
  if (!session) {
    return 'Something went wrong';
  }

  return null;
};
