import coreChainApi from '@onekeyhq/core/src/instance/coreChainApi';
import type { SignedTx } from '@onekeyhq/engine/src/types/provider';

import { AccountType } from '../../../../types/account';
import { KeyringHdBase } from '../../../keyring/KeyringHdBase';
import { signTransactionWithSigner } from '../utils';

import type { ChainSigner } from '../../../../proxy';
import type { DBAccount, DBVariantAccount } from '../../../../types/account';
import type {
  IPrepareHdAccountsParams,
  ISignCredentialOptions,
  ISignedTxPro,
  IUnsignedTxPro,
} from '../../../types';

export class KeyringHd extends KeyringHdBase {
  override coreApi = coreChainApi.cfx.hd;

  override getSigners(): Promise<Record<string, ChainSigner>> {
    throw new Error('getSigners moved to core.');
  }

  override async getPrivateKeys(query: {
    password: string;
    relPaths?: string[] | undefined;
  }): Promise<Record<string, Buffer>> {
    return this.baseGetPrivateKeys(query);
  }

  override async prepareAccounts(
    params: IPrepareHdAccountsParams,
  ): Promise<DBAccount[]> {
    return super.basePrepareAccountsHd(params, {
      accountType: AccountType.VARIANT,
      usedIndexes: params.indexes,
    });
  }

  override async signTransaction(
    unsignedTx: IUnsignedTxPro,
    options: ISignCredentialOptions,
  ): Promise<ISignedTxPro> {
    return this.baseSignTransaction(unsignedTx, options);
  }

  override signMessage(): any {
    throw new Error('Method not implemented.');
  }

  async signTransactionOld(
    unsignedTx: IUnsignedTxPro,
    options: ISignCredentialOptions,
  ): Promise<SignedTx> {
    const dbAccount = await this.getDbAccount();
    const selectedAddress = (dbAccount as DBVariantAccount).addresses[
      this.networkId
    ];

    const signers = await this.getSigners(options.password || '', [
      selectedAddress,
    ]);
    const signer = signers[selectedAddress];
    return signTransactionWithSigner(unsignedTx, signer);
  }
}
