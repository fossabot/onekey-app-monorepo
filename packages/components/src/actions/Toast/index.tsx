import type { RefObject } from 'react';
import { createRef } from 'react';

import { ToastProvider } from '@tamagui/toast';
import { toast } from 'burnt';
import { SizableText, YStack, getTokens } from 'tamagui';

import platformEnv from '@onekeyhq/shared/src/platformEnv';

import { Portal } from '../../hocs';
import { Icon } from '../../primitives';

import { ShowToaster, ShowToasterClose } from './ShowToaster';

import type { IShowToasterInstance, IShowToasterProps } from './ShowToaster';
import type { IPortalManager } from '../../hocs';

export interface IToastProps {
  title: string;
  message?: string;
  /**
   * Duration in seconds.
   */
  duration?: number;
}

export interface IToastBaseProps extends IToastProps {
  title: string;
  message?: string;
  /**
   * Duration in seconds.
   */
  duration?: number;
  haptic?: 'success' | 'warning' | 'error' | 'none';
  preset?: 'done' | 'error' | 'none' | 'custom';
}

const iconMap = {
  success: {
    ios: {
      name: 'checkmark.circle.fill',
      color: getTokens().color.iconSuccessLight.val,
    },
    web: <Icon name="CheckRadioSolid" color="$iconSuccess" size="$5" />,
  },
  error: {
    ios: {
      name: 'x.circle.fill',
      color: getTokens().color.iconCriticalLight.val,
    },
    web: <Icon name="XCircleSolid" color="$iconCritical" size="$5" />,
  },
};

const renderLines = (text?: string) => {
  if (platformEnv.isNativeIOS) {
    return text;
  }
  if (!text) {
    return text;
  }
  const lines = text?.split('\n') || [];
  return lines.length > 1 ? (
    <YStack flex={1}>
      {lines.map((v, index) => (
        <SizableText wordWrap="break-word" width="100%" key={index}>
          {v}
        </SizableText>
      ))}
    </YStack>
  ) : (
    text
  );
};

function burntToast({
  title,
  message,
  duration = 2,
  haptic,
  preset = 'custom',
}: IToastBaseProps) {
  toast({
    title: renderLines(title) as any,
    message: renderLines(message) as any,
    duration,
    haptic,
    preset,
    icon: iconMap[haptic as keyof typeof iconMap],
  });
}

export { default as Toaster } from './Toaster';

export type IToastShowResult = {
  close: (extra?: { flag?: string }) => void | Promise<void>;
};
export const Toast = {
  success: (props: IToastProps) => {
    burntToast({ haptic: 'success', ...props });
  },
  error: (props: IToastProps) => {
    burntToast({ haptic: 'error', ...props });
  },
  message: (props: IToastProps) => {
    burntToast({ haptic: 'warning', preset: 'none', ...props });
  },
  show: ({
    onClose,
    children,
    ...others
  }: IShowToasterProps): IToastShowResult => {
    let instanceRef: RefObject<IShowToasterInstance> | undefined =
      createRef<IShowToasterInstance>();
    let portalRef:
      | {
          current: IPortalManager;
        }
      | undefined;

    const handleClose = (extra?: { flag?: string }) =>
      new Promise<void>((resolve) => {
        // Remove the React node after the animation has finished.
        setTimeout(() => {
          if (instanceRef) {
            instanceRef = undefined;
          }
          if (portalRef) {
            portalRef.current.destroy();
            portalRef = undefined;
          }
          void onClose?.(extra);
          resolve();
        }, 300);
      });
    portalRef = {
      current: Portal.Render(
        Portal.Constant.TOASTER_OVERLAY_PORTAL,
        <ShowToaster ref={instanceRef} onClose={handleClose} {...others}>
          {children}
        </ShowToaster>,
      ),
    };
    const r: IToastShowResult = {
      close: async (extra?: { flag?: string }) =>
        instanceRef?.current?.close(extra),
    };
    return r;
  },
  Close: ShowToasterClose,
};

export { useToaster } from './ShowToaster';
export type { IShowToasterProps } from './ShowToaster';

export function ShowToastProvider() {
  return (
    <ToastProvider swipeDirection="up">
      <Portal.Container name={Portal.Constant.TOASTER_OVERLAY_PORTAL} />
    </ToastProvider>
  );
}
