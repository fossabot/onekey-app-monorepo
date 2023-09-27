/* eslint-disable @typescript-eslint/no-unused-vars */

import { getUtxoAccountPrefixPath } from '@onekeyhq/engine/src/managers/derivation';
import type { ICurveName } from '@onekeyhq/engine/src/secret';
import { encrypt } from '@onekeyhq/engine/src/secret/encryptors/aes256';
import type {
  IAdaUTXO,
  IEncodedTxADA,
} from '@onekeyhq/engine/src/vaults/impl/ada/types';
import { NetworkId } from '@onekeyhq/engine/src/vaults/impl/ada/types';
import type { ISignedTxPro } from '@onekeyhq/engine/src/vaults/types';
import bufferUtils from '@onekeyhq/shared/src/utils/bufferUtils';

import { CoreChainApiBase } from '../../base/CoreChainApiBase';

import {
  batchGetShelleyAddressByRootKey,
  batchGetShelleyAddresses,
  decodePrivateKeyByXprv,
  encodePrivateKey,
  generateExportedCredential,
  getPathIndex,
  getXprvString,
  sdk,
} from './sdkAda';

import type {
  ICoreApiGetAddressItem,
  ICoreApiGetAddressQueryImported,
  ICoreApiGetAddressQueryPublicKey,
  ICoreApiGetAddressesQueryHd,
  ICoreApiGetAddressesResult,
  ICoreApiGetPrivateKeysMapHdQuery,
  ICoreApiPrivateKeysMap,
  ICoreApiSignBasePayload,
  ICoreApiSignMsgPayload,
  ICoreApiSignTxPayload,
} from '../../types';
import type { IAdaBaseAddressInfo, IAdaStakingAddressInfo } from './sdkAda';

const curve: ICurveName = 'ed25519';

export default class CoreChainSoftware extends CoreChainApiBase {
  override async baseGetPrivateKeysHd({
    password,
    account,
    hdCredential,
  }: ICoreApiGetPrivateKeysMapHdQuery & {
    curve: ICurveName;
  }): Promise<ICoreApiPrivateKeysMap> {
    const { seed, entropy } = hdCredential;
    const { path, address } = account;

    const xprv = await generateExportedCredential(
      password,
      bufferUtils.toBuffer(entropy),
      path,
    );
    const privateKey = decodePrivateKeyByXprv(xprv);
    const privateKeyEncrypt = encrypt(password, privateKey);

    const map: ICoreApiPrivateKeysMap = {
      [path]: bufferUtils.bytesToHex(privateKeyEncrypt),
    };
    return map;
  }

  override async getPrivateKeys(
    payload: ICoreApiSignBasePayload,
  ): Promise<ICoreApiPrivateKeysMap> {
    // throw new Error('Method not implemented.');
    return this.baseGetPrivateKeys({
      payload,
      curve,
    });
  }

  override async signTransaction(
    payload: ICoreApiSignTxPayload,
  ): Promise<ISignedTxPro> {
    // throw new Error('Method not implemented.');
    const { unsignedTx, account } = payload;
    const encodedTx = unsignedTx.encodedTx as IEncodedTxADA;
    const signer = await this.baseGetSingleSigner({
      payload,
      curve,
    });
    const privateKey = await signer.getPrvkey();
    const encodeKey = encodePrivateKey(privateKey);
    const xprv = await getXprvString(encodeKey.rootKey);
    const accountIndex = getPathIndex(account.path);

    const CardanoApi = await sdk.getCardanoApi();
    const { signedTx, txid } = await CardanoApi.signTransaction(
      encodedTx.tx.body,
      account.address,
      Number(accountIndex),
      encodedTx.inputs as unknown as IAdaUTXO[],
      xprv,
      !!encodedTx.signOnly,
      false,
    );

    return {
      rawTx: signedTx,
      txid,
      encodedTx: unsignedTx.encodedTx,
    };
  }

  override async signMessage(payload: ICoreApiSignMsgPayload): Promise<string> {
    // throw new Error('Method not implemented.');
    // eslint-disable-next-line prefer-destructuring
    const unsignedMsg = payload.unsignedMsg;
    const signer = await this.baseGetSingleSigner({
      payload,
      curve,
    });
    const msgBytes = bufferUtils.toBuffer('');
    const [signature] = await signer.sign(msgBytes);
    return '';
  }

  private buildAdaAddressItem({
    baseAddress,
    stakingAddress,
  }: {
    baseAddress: IAdaBaseAddressInfo;
    stakingAddress: IAdaStakingAddressInfo;
  }) {
    const { address, path, xpub } = baseAddress;

    // path:         "m/1852'/1815'/2'/0/0"
    // accountPath:  "m/1852'/1815'/2'"
    const accountPath = getUtxoAccountPrefixPath({
      fullPath: path,
    });

    const firstAddressRelPath = '0/0';
    const stakingAddressPath = '2/0';

    const result: ICoreApiGetAddressItem = {
      address,
      publicKey: '',
      path: accountPath,
      xpub,
      addresses: {
        [firstAddressRelPath]: address,
        [stakingAddressPath]: stakingAddress.address,
      },
    };
    return result;
  }

  override async getAddressFromPrivate(
    query: ICoreApiGetAddressQueryImported,
  ): Promise<ICoreApiGetAddressItem> {
    // throw new Error('Method not implemented.');
    const { privateKeyRaw } = query;
    const privateKey = bufferUtils.toBuffer(privateKeyRaw);

    const encodeKey = encodePrivateKey(privateKey);

    const index = parseInt(encodeKey.index);
    const addressInfos = batchGetShelleyAddressByRootKey(
      encodeKey.rootKey,
      [index],
      NetworkId.MAINNET,
    );
    const { baseAddress, stakingAddress } = addressInfos[0];

    const result: ICoreApiGetAddressItem = this.buildAdaAddressItem({
      baseAddress,
      stakingAddress,
    });
    return result;
  }

  override async getAddressFromPublic(
    query: ICoreApiGetAddressQueryPublicKey,
  ): Promise<ICoreApiGetAddressItem> {
    throw new Error(
      'Method not implemented. use getAddressFromPrivate instead.',
    );
  }

  override async getAddressesFromHd(
    query: ICoreApiGetAddressesQueryHd,
  ): Promise<ICoreApiGetAddressesResult> {
    const { hdCredential, password, indexes } = query;
    const { entropy } = hdCredential;

    // const { pathPrefix, pathSuffix } = slicePathTemplate(query.template);
    // const indexFormatted = indexes.map((index) =>
    //   pathSuffix.replace('{index}', index.toString()),
    // );

    const addressInfos = await batchGetShelleyAddresses(
      bufferUtils.toBuffer(entropy),
      password,
      indexes,
      NetworkId.MAINNET,
    );

    const addresses = addressInfos.map((info) => {
      const { baseAddress, stakingAddress } = info;

      const result: ICoreApiGetAddressItem = this.buildAdaAddressItem({
        baseAddress,
        stakingAddress,
      });
      return result;
    });
    return { addresses };
  }
}
