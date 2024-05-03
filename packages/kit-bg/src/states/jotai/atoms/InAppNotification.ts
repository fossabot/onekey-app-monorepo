import type { ISwapTxHistory } from '@onekeyhq/shared/types/swap/types';

import { EAtomNames } from '../atomNames';
import { globalAtom } from '../utils';

export type IInAppNotificationAtom = {
  swapHistoryPendingList: ISwapTxHistory[];
};
export const { target: inAppNotificationAtom, use: useInAppNotificationAtom } =
  globalAtom<IInAppNotificationAtom>({
    persist: false,
    name: EAtomNames.inAppNotificationAtom,
    initialValue: {
      swapHistoryPendingList: [],
    },
  });
