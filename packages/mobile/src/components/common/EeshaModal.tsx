import React from 'react';
import {
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from '@/components/ui/gluestack-ui-provider/modal';
import { VStack } from '@/components/ui/gluestack-ui-provider/vstack';
import { HStack } from '@/components/ui/gluestack-ui-provider/hstack';
import { Spinner } from '@/components/ui/gluestack-ui-provider/spinner';
import { Icon } from '@/components/ui/gluestack-ui-provider/icon';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react-native';
import { EeshaText } from './EeshaText';
import { EeshaButton } from './EeshaButton';
import { UI_CONFIG } from '@/config/constants';

export type EeshaModalType = 'loading' | 'success' | 'error' | 'info';

interface EeshaModalProps {
  isOpen: boolean;
  onClose?: () => void;
  type?: EeshaModalType;
  title?: string;
  message?: string;
  showCloseButton?: boolean;
  actionButton?: {
    label: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'coral' | 'golden';
  };
  secondaryButton?: {
    label: string;
    onPress: () => void;
  };
}

export const EeshaModal: React.FC<EeshaModalProps> = ({
  isOpen,
  onClose,
  type = 'info',
  title,
  message,
  showCloseButton = true,
  actionButton,
  secondaryButton,
}) => {
  const renderIcon = () => {
    switch (type) {
      case 'loading':
        return <Spinner size="large" className="text-[#14142b]" />;
      case 'success':
        return (
          <Icon
            as={CheckCircle}
            size={64}
            style={{ color: UI_CONFIG.COLORS.feedback.success }}
          />
        );
      case 'error':
        return (
          <Icon
            as={XCircle}
            size={64}
            style={{ color: UI_CONFIG.COLORS.feedback.error }}
          />
        );
      case 'info':
        return (
          <Icon
            as={AlertCircle}
            size={64}
            style={{ color: UI_CONFIG.COLORS.feedback.info }}
          />
        );
    }
  };

  const getIconColor = () => {
    switch (type) {
      case 'loading':
        return '#14142b';
      case 'success':
        return UI_CONFIG.COLORS.feedback.success;
      case 'error':
        return UI_CONFIG.COLORS.feedback.error;
      case 'info':
        return UI_CONFIG.COLORS.feedback.info;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalBackdrop />
      <ModalContent className="bg-white rounded-2xl p-6">
        {showCloseButton && type !== 'loading' && (
          <ModalCloseButton onPress={onClose} />
        )}

        <ModalBody>
          <VStack space="lg" className="items-center py-4">
            {/* Icon */}
            <VStack className="items-center justify-center">{renderIcon()}</VStack>

            {/* Title */}
            {title && (
              <EeshaText variant="h3" align="center">
                {title}
              </EeshaText>
            )}

            {/* Message */}
            {message && (
              <EeshaText variant="body-regular" color="secondary" align="center">
                {message}
              </EeshaText>
            )}
          </VStack>
        </ModalBody>

        {/* Action Buttons */}
        {(actionButton || secondaryButton) && (
          <ModalFooter>
            <VStack space="md" className="w-full">
              {actionButton && (
                <EeshaButton
                  variant={actionButton.variant || 'primary'}
                  size="large"
                  fullWidth
                  onPress={actionButton.onPress}
                >
                  {actionButton.label}
                </EeshaButton>
              )}
              {secondaryButton && (
                <EeshaButton
                  variant="ghost"
                  size="medium"
                  fullWidth
                  onPress={secondaryButton.onPress}
                >
                  {secondaryButton.label}
                </EeshaButton>
              )}
            </VStack>
          </ModalFooter>
        )}
      </ModalContent>
    </Modal>
  );
};
