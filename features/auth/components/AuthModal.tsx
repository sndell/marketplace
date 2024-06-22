'use client';

import { Modal } from '@/components/elements';
import { LoginForm } from './LoginForm';
import { useState } from 'react';
import { RegisterForm } from './RegisterForm';
import { AnimatePresence } from 'framer-motion';

type Props = {
  close: () => void;
};

export const AuthModal = ({ close }: Props) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');

  const changeMode = () => setMode((state) => (state === 'login' ? 'register' : 'login'));

  return (
    <Modal close={close} className="max-w-sm w-full rounded-3xl overflow-hidden">
      <div className="p-3 bg-primary/85">
        <div className="grid grid-cols-[1fr_auto_1fr]">
          <div />
          <div>{mode === 'login' ? 'Inloggning' : 'Registrering'}</div>
          <button onClick={close} className="justify-self-end icon-[clarity--close-line] text-2xl"></button>
        </div>
        <AnimatePresence initial={false}>{mode === 'login' ? <LoginForm /> : <RegisterForm />}</AnimatePresence>
        <div className="text-sm text-center pt-4 pb-1">
          {mode === 'login' ? 'Inget konto?' : 'Redan registrerad?'}{' '}
          <button onClick={changeMode} type="button" className="text-accent font-medium hover:underline">
            {mode === 'login' ? 'Nytt konto' : 'Logga in'}{' '}
          </button>
        </div>
      </div>
    </Modal>
  );
};
