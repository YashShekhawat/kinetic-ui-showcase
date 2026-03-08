import { useState } from 'react';
import { isProUnlocked, saveLicense, revokeLicense } from '@/config/proConfig';

export const usePro = () => {
  const [isPro, setIsPro] = useState(isProUnlocked());
  const unlock = (key: string) => {
    saveLicense(key);
    setIsPro(true);
  };
  const revoke = () => {
    revokeLicense();
    setIsPro(false);
  };
  return { isPro, unlock, revoke };
};
