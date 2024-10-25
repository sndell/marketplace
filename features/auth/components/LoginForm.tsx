'use client';

import { Input } from '@/components/form';
import { LoginFormSchema, LoginFormValues } from '@/features/auth/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { useLogin } from '@/features/auth/hooks/useLogin';

export const LoginForm = () => {
  const handleRegisterErrors = (error: string) => {
    switch (error) {
      case 'email-not-found':
        setError('email', { message: 'Emailen är inte registrerad' });
        break;
      case 'incorrect-password':
        setError('password', { message: 'Fel lösenord' });
        break;
      default:
        break;
    }
  };

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginFormValues>({ resolver: zodResolver(LoginFormSchema) });

  const login = useLogin(handleRegisterErrors);
  const onSubmit = (data: LoginFormValues) => login.mutateAsync({ data });

  return (
    <motion.form
      initial={{ translateX: 32 }}
      animate={{ translateX: 0 }}
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col w-full gap-3"
    >
      <Input
        registration={register('email')}
        error={errors.email}
        isRequired
        label="Email"
        placeholder="Skriv din email"
      />
      <Input
        registration={register('password')}
        error={errors.password}
        isRequired
        type="password"
        label="Lösenord"
        placeholder="Skriv ditt lösenord"
      />
      <div className="text-sm text-center">
        Glömt ditt lösenord?{' '}
        <button type="button" className="font-medium text-accent hover:underline">
          Återställ
        </button>
      </div>
      <button className="grid h-10 py-2 rounded-full place-content-center bg-accent text-secondary">
        {login.isPending ? <span className="icon-[svg-spinners--3-dots-scale] text-3xl" /> : 'Login'}
      </button>
    </motion.form>
  );
};
