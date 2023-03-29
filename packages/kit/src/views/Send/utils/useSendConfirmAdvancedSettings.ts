import { useEffect, useState } from 'react';

import backgroundApiProxy from '../../../background/instance/backgroundApiProxy';

import type { SendConfirmAdvancedSettings } from '../types';

function useSendConfirmAdvancedSettings({
  accountId,
  networkId,
}: {
  accountId: string;
  networkId: string;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [advancedSettings, setAdvancedSettings] =
    useState<SendConfirmAdvancedSettings>({ nonce: '' });
  const { serviceTransaction } = backgroundApiProxy;

  useEffect(() => {
    setIsLoading(true);
    const initNonce = async () => {
      const nextNonce = await serviceTransaction.getNextTransactionNonce({
        accountId,
        networkId,
      });
      setAdvancedSettings((prev) => ({
        ...prev,
        nonce: String(nextNonce),
      }));
      setIsLoading(false);
    };
    initNonce();
  }, [accountId, networkId, serviceTransaction]);

  return {
    isLoading,
    advancedSettings,
    setAdvancedSettings,
  };
}

export { useSendConfirmAdvancedSettings };
