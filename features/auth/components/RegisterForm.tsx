'use client';

import { Input, Checkbox } from '@/components/form';
import { RegisterFormSchema, RegisterFormValues } from '@/features/auth/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { useRegister } from '@/features/auth/hooks/useRegister';

export const RegisterForm = () => {
  const handleRegisterErrors = (error: string) =>
    error === 'email-already-registered' && setError('email', { message: 'Emailen är redan registrerad' });

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegisterFormValues>({ resolver: zodResolver(RegisterFormSchema) });

  const registerUser = useRegister(handleRegisterErrors);
  const onSubmit = (data: RegisterFormValues) =>
    registerUser.mutateAsync({ data: { email: data.email, displayName: data.displayName, password: data.password } });

  return (
    <motion.form
      initial={{ translateX: -32 }}
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
        registration={register('displayName')}
        error={errors.displayName}
        isRequired
        label="Användarnamn"
        placeholder="Enter your displayname"
      />
      <Input
        registration={register('password')}
        error={errors.password}
        isRequired
        type="password"
        label="Lösenord"
        placeholder="Skriv ditt lösenord"
      />
      <Input
        registration={register('confirmPassword')}
        error={errors.confirmPassword}
        isRequired
        type="password"
        label="Bekräfta lösenord"
        placeholder="Upprepa ditt lösenord"
      />
      <Checkbox
        registation={register('agreeToTerms')}
        error={errors.agreeToTerms}
        label={
          <div className="py-1 text-sm">
            Jag godkänner{' '}
            <button type="button" className="font-medium text-accent hover:underline">
              användarvillkoren
            </button>
          </div>
        }
      />
      <button className="grid h-10 rounded-full place-content-center bg-accent text-secondary">
        {registerUser.isPending ? <span className="icon-[svg-spinners--3-dots-scale] text-3xl" /> : 'Registrera'}
      </button>
    </motion.form>
  );
};
