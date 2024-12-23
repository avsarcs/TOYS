import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Box, Button, Group, Alert, Text, Modal, ThemeIcon } from '@mantine/core';
import { IconInfoCircle, IconCheck, IconX, IconAlertCircle } from '@tabler/icons-react';
import { UserContext } from '../../context/UserContext';
import { UserRole } from '../../types/enum';
import { FairData } from '../../types/data';
import { notifications } from '@mantine/notifications';
import { Stack } from '@mantine/core';

interface GuideStatusProps {
  fair: FairData;
  refreshFair: () => void;
}

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  title: string;
  message: string;
  confirmText: string;
  loading: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  loading
}) => {
  const handleConfirm = async () => {
    try {
      await onConfirm();
      setTimeout(() => {
        onClose();
      }, 500);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      title={
        <Group gap="sm">
          <ThemeIcon 
            size="lg" 
            radius="xl" 
            variant="light" 
            color="blue"
            className="bg-blue-50"
          >
            <IconAlertCircle size={20} />
          </ThemeIcon>
          <Text fw={600} size="lg">{title}</Text>
        </Group>
      }
      centered
      padding="lg"
      classNames={{
        header: 'border-b border-gray-200 pb-3',
        body: 'pt-4'
      }}
    >
      <Stack gap="md">
        <Text size="sm" className="leading-relaxed">
          {message}
        </Text>
        
        <Group justify="flex-end" gap="md" w="100%" pt="md">
          <Button
            variant="subtle"
            color="gray"
            onClick={onClose}
            disabled={loading}
            leftSection={<IconX size={16} />}
            className="hover:bg-gray-50"
          >
            İptal
          </Button>
          <Button
            color="blue"
            onClick={handleConfirm}
            loading={loading}
            leftSection={<IconCheck size={16} />}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {confirmText}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};

const FairGuideStatus: React.FC<GuideStatusProps> = ({ fair, refreshFair }) => {
  const userContext = useContext(UserContext);
  const [isEnrolled, setIsEnrolled] = useState<boolean>(false);
  const [isInvited, setIsInvited] = useState<boolean>(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText: string;
    onConfirm: () => Promise<void>;
  }>({
    isOpen: false,
    title: '',
    message: '',
    confirmText: '',
    onConfirm: async () => {},
  });

  const handleModalClose = () => {
    setModalConfig(prev => ({ ...prev, isOpen: false }));
  };

  const checkEnrollmentStatus = useCallback(async () => {
    if (userContext.user.role !== UserRole.GUIDE && userContext.user.role !== UserRole.ADVISOR) {
      setIsCheckingStatus(false);
      return;
    }

    try {
      const enrolledUrl = new URL(import.meta.env.VITE_BACKEND_API_ADDRESS + "/internal/user/am-enrolled");
      enrolledUrl.searchParams.append("auth", await userContext.getAuthToken());
      enrolledUrl.searchParams.append("event_id", fair.fair_id);

      const enrolledRes = await fetch(enrolledUrl);
      if (enrolledRes.ok) {
        const enrolled = await enrolledRes.json();
        setIsEnrolled(enrolled);

        if (!enrolled) {
          const invitedUrl = new URL(import.meta.env.VITE_BACKEND_API_ADDRESS + "/internal/user/am-invited");
          invitedUrl.searchParams.append("auth", await userContext.getAuthToken());
          invitedUrl.searchParams.append("event_id", fair.fair_id);

          const invitedRes = await fetch(invitedUrl);
          if (invitedRes.ok) {
            const invited = await invitedRes.json();
            setIsInvited(invited);
          }
        }
      }
    } catch (error) {
      console.error('Error checking enrollment status:', error);
    } finally {
      setIsCheckingStatus(false);
    }
  }, [userContext.user.role, fair.fair_id]);

  const handleWithdraw = async () => {
    setModalConfig({
      isOpen: true,
      title: 'Fuardan Ayrılma Onayı',
      message: 'Bu fuardan ayrılmak istediğinizden emin misiniz?',
      confirmText: 'Evet, Ayrılmak İstiyorum',
      onConfirm: async () => {
        setIsLoading(true);
        try {
          const withdrawUrl = new URL(import.meta.env.VITE_BACKEND_API_ADDRESS + "/internal/event/withdraw");
          withdrawUrl.searchParams.append("auth", await userContext.getAuthToken());
          withdrawUrl.searchParams.append("event_id", fair.fair_id);

          const res = await fetch(withdrawUrl, { method: 'POST' });

          if (res.ok) {
            notifications.show({
              title: 'Başarılı',
              message: 'Fuardan başarıyla ayrıldınız',
              color: 'green',
              icon: <IconCheck />,
              autoClose: 5000,
            });
            await refreshFair();
            await checkEnrollmentStatus();
          } else {
            throw new Error('Failed to withdraw from fair');
          }
        } catch (error) {
          notifications.show({
            title: 'Hata',
            message: 'Fuardan ayrılma işlemi başarısız oldu',
            color: 'red',
            icon: <IconX />,
            autoClose: 5000,
          });
          throw error;
        } finally {
          setIsLoading(false);
        }
      },
    });
  };

  const handleAcceptInvite = async () => {
    setModalConfig({
      isOpen: true,
      title: 'Davet Kabul Onayı',
      message: 'Bu fuar davetini kabul etmek istediğinizden emin misiniz?',
      confirmText: 'Evet, Daveti Kabul Et',
      onConfirm: async () => {
        setIsLoading(true);
        try {
          const acceptUrl = new URL(import.meta.env.VITE_BACKEND_API_ADDRESS + "/respond/guide/fair-invite");
          acceptUrl.searchParams.append("auth", await userContext.getAuthToken());
          acceptUrl.searchParams.append("request_id", fair.fair_id);
          acceptUrl.searchParams.append("response", "true");

          const res = await fetch(acceptUrl, { method: 'POST' });

          if (res.ok) {
            notifications.show({
              title: 'Başarılı',
              message: 'Fuar daveti kabul edildi',
              color: 'green',
              icon: <IconCheck />,
              autoClose: 5000,
            });
            await refreshFair();
            await checkEnrollmentStatus();
          } else {
            throw new Error('Failed to accept invite');
          }
        } catch (error) {
          notifications.show({
            title: 'Hata',
            message: 'Davet kabul edilemedi',
            color: 'red',
            icon: <IconX />,
            autoClose: 5000,
          });
          throw error;
        } finally {
          setIsLoading(false);
        }
      },
    });
  };

  const handleRejectInvite = async () => {
    setModalConfig({
      isOpen: true,
      title: 'Davet Red Onayı',
      message: 'Bu fuar davetini reddetmek istediğinizden emin misiniz?',
      confirmText: 'Evet, Daveti Reddet',
      onConfirm: async () => {
        setIsLoading(true);
        try {
          const rejectUrl = new URL(import.meta.env.VITE_BACKEND_API_ADDRESS + "/respond/guide/fair-invite");
          rejectUrl.searchParams.append("auth", await userContext.getAuthToken());
          rejectUrl.searchParams.append("request_id", fair.fair_id);
          rejectUrl.searchParams.append("response", "false");

          const res = await fetch(rejectUrl, { method: 'POST' });

          if (res.ok) {
            notifications.show({
              title: 'Başarılı',
              message: 'Fuar daveti reddedildi',
              color: 'blue',
              icon: <IconCheck />,
              autoClose: 5000,
            });
            await refreshFair();
            await checkEnrollmentStatus();
          } else {
            throw new Error('Failed to reject invite');
          }
        } catch (error) {
          notifications.show({
            title: 'Hata',
            message: 'Davet reddedilemedi',
            color: 'red',
            icon: <IconX />,
            autoClose: 5000,
          });
          throw error;
        } finally {
          setIsLoading(false);
        }
      },
    });
  };

  useEffect(() => {
    checkEnrollmentStatus();
  }, [checkEnrollmentStatus]);

  if (userContext.user.role !== UserRole.GUIDE && userContext.user.role !== UserRole.ADVISOR) {
    return null;
  }

  if (isCheckingStatus) {
    return null;
  }

  const renderContent = () => {
    if (isEnrolled) {
      return (
        <>
          <Text size="sm" c="blue" mb="md">Bu fuarın rehberlerinden birisiniz!</Text>
          <Button
            leftSection={<IconX size={16} />}
            variant="subtle"
            color="red"
            w="fit-content"
            onClick={handleWithdraw}
            loading={isLoading}
          >
            Bu Fuardan Çekil
          </Button>
        </>
      );
    }

    if (isInvited) {
      return (
        <>
          <Text size="sm" className="text-slate-900" mb="md">
            Bu fuara rehber olmaya davet edildiniz!
          </Text>
          <Group>
            <Button
              leftSection={<IconCheck size={16} />}
              variant="filled"
              color="blue"
              onClick={handleAcceptInvite}
              loading={isLoading}
            >
              Fuara Katılmayı Kabul Et
            </Button>
            <Button
              leftSection={<IconX size={16} />}
              variant="subtle"
              color="slate"
              onClick={handleRejectInvite}
              loading={isLoading}
            >
              Fuara Katılmayı Reddet
            </Button>
          </Group>
        </>
      );
    }

    return null;
  };

  const content = renderContent();
  if (!content) {
    return null;
  }

  return (
    <>
      <ConfirmationModal
        isOpen={modalConfig.isOpen}
        onClose={handleModalClose}
        onConfirm={modalConfig.onConfirm}
        title={modalConfig.title}
        message={modalConfig.message}
        confirmText={modalConfig.confirmText}
        loading={isLoading}
      />
      
      <Box p="lg" w="100%">
        <Alert
          variant="light"
          color="blue"
          radius="md"
          icon={<IconInfoCircle />}
          title="Rehber Durumu"
          className="bg-slate-100"
        >
          {content}
        </Alert>
      </Box>
    </>
  );
};

export default FairGuideStatus;