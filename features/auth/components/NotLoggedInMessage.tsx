import { AuthButton } from './AuthButton';

export const NotLoggedInMessage = () => {
  return (
    <div className="grid xs:h-[calc(100dvh-64px)] h-[calc(100dvh-72px-76px)] place-content-center">
      <div>Du måste vara inloggad för att skapa en annons</div>
      <AuthButton>
        <div className="text-center text-accent">Logga in eller registrera dig</div>
      </AuthButton>
    </div>
  );
};
