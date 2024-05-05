import { web3Errors } from '@onekeyfe/cross-inpage-provider-errors';
import { IInjectedProviderNames } from '@onekeyfe/cross-inpage-provider-types';

import type {
  INostrEvent,
  INostrRelays,
} from '@onekeyhq/core/src/chains/nostr/types';
import {
  backgroundClass,
  providerApiMethod,
} from '@onekeyhq/shared/src/background/backgroundDecorators';
import {
  EDAppConnectionModal,
  EModalRoutes,
} from '@onekeyhq/shared/src/routes';
import accountUtils from '@onekeyhq/shared/src/utils/accountUtils';

import ProviderApiBase from './ProviderApiBase';

import type { IProviderBaseBackgroundNotifyInfo } from './ProviderApiBase';
import type {
  IJsBridgeMessagePayload,
  IJsonRpcRequest,
} from '@onekeyfe/cross-inpage-provider-types';

@backgroundClass()
class ProviderApiNostr extends ProviderApiBase {
  public providerName = IInjectedProviderNames.nostr;

  public override notifyDappAccountsChanged(
    info: IProviderBaseBackgroundNotifyInfo,
  ): void {
    const data = () => {
      const result = {
        method: 'wallet_events_accountChanged',
        params: {
          accounts: undefined,
        },
      };
      return result;
    };
    info.send(data, info.targetOrigin);
  }

  public override notifyDappChainChanged(): void {
    // throw new Error('Method not implemented.');
  }

  public async rpcCall(): Promise<any> {
    return Promise.resolve();
  }

  _getAccountsInfo = async (request: IJsBridgeMessagePayload) => {
    const accountsInfo =
      await this.backgroundApi.serviceDApp.dAppGetConnectedAccountsInfo(
        request,
      );
    if (!accountsInfo) {
      throw web3Errors.provider.unauthorized();
    }
    return accountsInfo;
  };

  @providerApiMethod()
  async nostr_account(
    request: IJsBridgeMessagePayload,
  ): Promise<{ npub: string; pubkey: string } | null> {
    const accountsInfo =
      await this.backgroundApi.serviceDApp.dAppGetConnectedAccountsInfo(
        request,
      );
    if (accountsInfo && accountsInfo.length) {
      return Promise.resolve({
        npub: accountsInfo[0].account.address,
        pubkey: accountsInfo[0].account.pub ?? '',
      });
    }
    return Promise.resolve(null);
  }

  // Nostr API
  @providerApiMethod()
  async getPublicKey(request: IJsBridgeMessagePayload): Promise<string> {
    const account = await this.nostr_account(request);
    if (account) {
      return account.pubkey;
    }
    await this.backgroundApi.serviceDApp.openConnectionModal(request);
    const result = await this.nostr_account(request);
    return result?.pubkey ?? '';
  }

  @providerApiMethod()
  public async getRelays(): Promise<INostrRelays> {
    // TODO: move to backend
    return {
      'wss://relay.relayable.org': { read: true, write: true },
      'wss://relay.nostrassets.com': { read: true, write: true },
      'wss://relay.damus.io': { read: true, write: true },
      'wss://nostr1.tunnelsats.com': { read: true, write: true },
      'wss://nostr-pub.wellorder.net': { read: true, write: true },
      'wss://relay.nostr.info': { read: true, write: true },
      'wss://nostr-relay.wlvs.space': { read: true, write: true },
      'wss://nostr.bitcoiner.social': { read: true, write: true },
      'wss://nostr-01.bolt.observer': { read: true, write: true },
      'wss://relayer.fiatjaf.com': { read: true, write: true },
    };
  }

  @providerApiMethod()
  public async signEvent(
    request: IJsBridgeMessagePayload,
  ): Promise<INostrEvent> {
    const params = (request.data as IJsonRpcRequest)?.params as {
      event: INostrEvent;
    };
    if (!params.event) {
      throw web3Errors.rpc.invalidInput();
    }

    const { accountInfo: { accountId, networkId, walletId } = {} } = (
      await this._getAccountsInfo(request)
    )[0];

    const cachedPassword =
      await this.backgroundApi.servicePassword.getCachedPassword();
    if (
      cachedPassword &&
      accountUtils.isHwWallet({ walletId: walletId ?? '' })
    ) {
      const shouldAutoSign =
        await this.backgroundApi.serviceNostr.getAutoSignStatus(
          accountId ?? '',
          new URL(request.origin ?? '').origin,
        );
      if (shouldAutoSign) {
        const result = await this.backgroundApi.serviceNostr.signEvent({
          networkId: networkId ?? '',
          accountId: accountId ?? '',
          walletId: walletId ?? '',
          event: params.event,
        });
        return (result?.data ?? {}) as INostrEvent;
      }
    }

    try {
      const signedEvent = await this.backgroundApi.serviceDApp.openModal({
        request,
        screens: [
          EModalRoutes.DAppConnectionModal,
          EDAppConnectionModal.NostrSignEventModal,
        ],
        params: {
          event: params.event,
          walletId: walletId ?? '',
          accountId: accountId ?? '',
          networkId: networkId ?? '',
        },
        fullScreen: true,
      });
      console.log('====> signEvent: ===>: ', signedEvent);
      return signedEvent as INostrEvent;
    } catch (e) {
      console.error('====> signEvent error: ', e);
      throw e;
    }
  }

  @providerApiMethod()
  public async encrypt(request: IJsBridgeMessagePayload): Promise<string> {
    const { accountInfo: { accountId, networkId } = {} } = (
      await this._getAccountsInfo(request)
    )[0];

    const params = (request.data as IJsonRpcRequest)?.params as {
      pubkey: string;
      plaintext: string;
    };
    if (!params.pubkey || !params.plaintext) {
      throw web3Errors.rpc.invalidInput();
    }

    try {
      const encrypted = await this.backgroundApi.serviceNostr.encrypt({
        networkId: networkId ?? '',
        accountId: accountId ?? '',
        pubkey: params.pubkey,
        plaintext: params.plaintext,
      });
      await this.backgroundApi.serviceNostr.saveEncryptedData({
        pubkey: params.pubkey,
        plaintext: params.plaintext,
        encryptedData: encrypted.data,
      });
      return encrypted.data;
    } catch (e) {
      console.error('====> encrypt error: ', e);
      throw e;
    }
  }

  @providerApiMethod()
  public async decrypt(request: IJsBridgeMessagePayload): Promise<string> {
    return this.decryptRequest(request);
  }

  private async decryptRequest(
    request: IJsBridgeMessagePayload,
  ): Promise<string> {
    const { accountInfo: { accountId, networkId } = {} } = (
      await this._getAccountsInfo(request)
    )[0];
    const params = (request.data as IJsonRpcRequest)?.params as {
      pubkey: string;
      ciphertext: string;
    };
    if (!params.pubkey || !params.ciphertext) {
      throw web3Errors.rpc.invalidInput();
    }

    const decrypted = await this.backgroundApi.serviceNostr.decrypt({
      networkId: networkId ?? '',
      accountId: accountId ?? '',
      pubkey: params.pubkey,
      ciphertext: params.ciphertext,
    });

    return decrypted.data;
  }
}

export default ProviderApiNostr;
