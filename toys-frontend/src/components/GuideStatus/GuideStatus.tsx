import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Box, Button, Group, Alert, Text, Stack, Modal, ThemeIcon } from '@mantine/core';
import { IconInfoCircle, IconCheck, IconX, IconUserPlus, IconLogout, IconAlertCircle } from '@tabler/icons-react';
import { UserContext } from '../../context/UserContext';
import { UserRole } from '../../types/enum';
import { TourData } from '../../types/data';
import { notifications } from '@mantine/notifications';

interface GuideStatusProps {
  tour: TourData;
  refreshTour: () => void;
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

const TOUR_START_URL = new URL(import.meta.env.VITE_BACKEND_API_ADDRESS + "/internal/event/tour/start-tour");
const TOUR_END_URL = new URL(import.meta.env.VITE_BACKEND_API_ADDRESS + "/internal/event/tour/end-tour");
const TOUR_ENROLL_URL = new URL(import.meta.env.VITE_BACKEND_API_ADDRESS + "/internal/event/enroll");
const TOUR_WITHDRAW_URL = new URL(import.meta.env.VITE_BACKEND_API_ADDRESS + "/internal/event/withdraw");

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
      <Stack>
        <Text size="sm" className="leading-relaxed">
          {message}
        </Text>
        
        <Group justify="flex-end" gap="md" pt="md">
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

const GuideStatus: React.FC<GuideStatusProps> = ({ tour, refreshTour }) => {
  const userContext = useContext(UserContext);
  const [isEnrolled, setIsEnrolled] = useState<boolean>(false);
  const [isInvited, setIsInvited] = useState<boolean>(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);  // Single loading state
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
      enrolledUrl.searchParams.append("event_id", tour.tour_id);

      const enrolledRes = await fetch(enrolledUrl);
      if (enrolledRes.ok) {
        const enrolled = await enrolledRes.json();
        setIsEnrolled(enrolled);

        if (!enrolled) {
          const invitedUrl = new URL(import.meta.env.VITE_BACKEND_API_ADDRESS + "/internal/user/am-invited");
          invitedUrl.searchParams.append("auth", await userContext.getAuthToken());
          invitedUrl.searchParams.append("event_id", tour.tour_id);

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
  }, [userContext.user.role, tour.tour_id]);

  const handleStartTour = async () => {
    setModalConfig({
      isOpen: true,
      title: 'Tur Başlangıç Onayı',
      message: 'Turun başladığını bildirmek istediğinizden emin misiniz?',
      confirmText: 'Evet, Tur Başladı',
      onConfirm: async () => {
        setIsLoading(true);
        try {
          const startUrl = new URL(TOUR_START_URL);
          startUrl.searchParams.append("auth", await userContext.getAuthToken());
          startUrl.searchParams.append("tour_id", tour.tour_id);
          startUrl.searchParams.append("start_time", "");
  
          const res = await fetch(startUrl, { method: "POST" });
  
          if (res.ok) {
            notifications.show({
              title: 'Başarılı',
              message: 'TURUN BAŞLANGIÇ VAKTİ BAŞARIYLA BİLDİRİLDİ',
              color: 'green',
              icon: <IconCheck />,
              autoClose: 5000,
            });
            await refreshTour();
          } else {
            throw new Error('Failed to start tour');
          }
        } catch (error) {
          notifications.show({
            title: 'Hata',
            message: 'Tur başlangıç vakti bildirilemedi',
            color: 'red',
            icon: <IconX />,
            autoClose: 5000,
          });
          throw error; // Rethrow to prevent modal from closing
        } finally {
          setIsLoading(false);
        }
      },
    });
  };
  
  const handleEndTour = async () => {
    setModalConfig({
      isOpen: true,
      title: 'Tur Bitiş Onayı',
      message: 'Turun bittiğini bildirmek istediğinizden emin misiniz?',
      confirmText: 'Evet, Tur Bitti',
      onConfirm: async () => {
        setIsLoading(true);
        try {
          const endUrl = new URL(TOUR_END_URL);
          endUrl.searchParams.append("auth", await userContext.getAuthToken());
          endUrl.searchParams.append("tour_id", tour.tour_id);
          endUrl.searchParams.append("end_time", "");
  
          const res = await fetch(endUrl, { method: "POST" });
  
          if (res.ok) {
            notifications.show({
              title: 'Başarılı',
              message: 'TURUN BİTİŞ VAKTİ BAŞARIYLA BİLDİRİLDİ',
              color: 'green',
              icon: <IconCheck />,
              autoClose: 5000,
            });
            await refreshTour();
          } else {
            throw new Error('Failed to end tour');
          }
        } catch (error) {
          notifications.show({
            title: 'Hata',
            message: 'Tur bitiş vakti bildirilemedi',
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
  
  const handleEnroll = async () => {
    setModalConfig({
      isOpen: true,
      title: 'Tura Katılım Onayı',
      message: 'Bu turun rehberi olmak istediğinizden emin misiniz?',
      confirmText: 'Evet, Rehber Olmak İstiyorum',
      onConfirm: async () => {
        setIsLoading(true);
        try {
          const enrollUrl = new URL(TOUR_ENROLL_URL);
          enrollUrl.searchParams.append("auth", await userContext.getAuthToken());
          enrollUrl.searchParams.append("event_id", tour.tour_id);
  
          const res = await fetch(enrollUrl, { method: 'POST' });
  
          if (res.ok) {
            notifications.show({
              title: 'Başarılı',
              message: 'Tura başarıyla kaydoldunuz',
              color: 'green',
              icon: <IconCheck />,
              autoClose: 5000,
            });
            refreshTour();
            await checkEnrollmentStatus();
          } else {
            throw new Error('Failed to enroll in tour');
          }
        } catch (error) {
          notifications.show({
            title: 'Hata',
            message: 'Tura kaydolma işlemi başarısız oldu',
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
  
  const handleWithdraw = async () => {
    setModalConfig({
      isOpen: true,
      title: 'Turdan Ayrılma Onayı',
      message: 'Bu turdan ayrılmak istediğinizden emin misiniz?',
      confirmText: 'Evet, Ayrılmak İstiyorum',
      onConfirm: async () => {
        setIsLoading(true);
        try {
          const withdrawUrl = new URL(TOUR_WITHDRAW_URL);
          withdrawUrl.searchParams.append("auth", await userContext.getAuthToken());
          withdrawUrl.searchParams.append("event_id", tour.tour_id);
  
          const res = await fetch(withdrawUrl, { method: 'POST' });
  
          if (res.ok) {
            notifications.show({
              title: 'Başarılı',
              message: 'Turdan başarıyla ayrıldınız',
              color: 'green',
              icon: <IconCheck />,
              autoClose: 5000,
            });
            await refreshTour();
            await checkEnrollmentStatus();
          } else {
            throw new Error('Failed to withdraw from tour');
          }
        } catch (error) {
          notifications.show({
            title: 'Hata',
            message: 'Turdan ayrılma işlemi başarısız oldu',
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
      message: 'Bu tur davetini kabul etmek istediğinizden emin misiniz?',
      confirmText: 'Evet, Daveti Kabul Et',
      onConfirm: async () => {
        setIsLoading(true);
        try {
          const acceptUrl = new URL(import.meta.env.VITE_BACKEND_API_ADDRESS + "/respond/guide/tour-invite");
          acceptUrl.searchParams.append("auth", await userContext.getAuthToken());
          acceptUrl.searchParams.append("request_id", tour.tour_id);
          acceptUrl.searchParams.append("response", "true");
  
          const res = await fetch(acceptUrl, { method: 'POST' });
  
          if (res.ok) {
            notifications.show({
              title: 'Başarılı',
              message: 'Tur daveti kabul edildi',
              color: 'green',
              icon: <IconCheck />,
              autoClose: 5000,
            });
            await refreshTour();
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
      message: 'Bu tur davetini reddetmek istediğinizden emin misiniz?',
      confirmText: 'Evet, Daveti Reddet',
      onConfirm: async () => {
        setIsLoading(true);
        try {
          const rejectUrl = new URL(import.meta.env.VITE_BACKEND_API_ADDRESS + "/respond/guide/tour-invite");
          rejectUrl.searchParams.append("auth", await userContext.getAuthToken());
          rejectUrl.searchParams.append("request_id", tour.tour_id);
          rejectUrl.searchParams.append("response", "false");
  
          const res = await fetch(rejectUrl, { method: 'POST' });
  
          if (res.ok) {
            notifications.show({
              title: 'Başarılı',
              message: 'Tur daveti reddedildi',
              color: 'blue',
              icon: <IconCheck />,
              autoClose: 5000,
            });
            await refreshTour();
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
    if (!isEnrolled && !isInvited) {
      return (
        <>
          <Text size="sm" className="text-slate-900" mb="md">
            Bu tura rehber olarak kaydolabilirsiniz.
          </Text>
          <Button
            leftSection={<IconUserPlus size={16} />}
            variant="filled"
            color="blue"
            onClick={handleEnroll}
            disabled={isLoading}  // Add this
          >
            Bu Turun Rehberi Ol
          </Button>
        </>
      );
    }

    if (isEnrolled) {
      return (
        <>
          <Text size="sm" c="blue" mb="md">Bu turun rehberi sizsiniz!</Text>
          <Stack gap="md">
            {userContext.user.role === UserRole.GUIDE && (
              <Group>
                {tour.status !== "ONGOING" && tour.status !== "FINISHED" && (
                  <Button
                    w="fit-content"
                    color="green"
                    onClick={handleStartTour}
                  >
                    TURUN BAŞLADIĞINI BİLDİR
                  </Button>
                )}
                {tour.status === "ONGOING" && (
                  <Button
                    w="fit-content"
                    color="red"
                    onClick={handleEndTour}
                  >
                    TURUN BİTTİĞİNİ BİLDİR
                  </Button>
                )}
              </Group>
            )}
            {tour.status !== "ONGOING" && tour.status !== "FINISHED" && (
              <Button
                leftSection={<IconLogout size={16} />}
                variant="subtle"
                color="red"
                w="fit-content"
                onClick={handleWithdraw}
              >
                Bu Turun Rehberi Olmaktan Vazgeç
              </Button>
            )}
          </Stack>
        </>
      );
    }

    if (isInvited) {
      return (
        <>
          <Text size="sm" className="text-slate-900" mb="md">
            Bu turun rehberi olmaya davet edildiniz!
          </Text>
          <Group>
            <Button
              leftSection={<IconCheck size={16} />}
              variant="filled"
              color="blue"
              onClick={handleAcceptInvite}
            >
              Kabul Et
            </Button>
            <Button
              leftSection={<IconX size={16} />}
              variant="subtle"
              color="slate"
              onClick={handleRejectInvite}
            >
              Reddet
            </Button>
          </Group>
        </>
      );
    }

    return null;
  };

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
          {renderContent()}
        </Alert>
      </Box>
    </>
  );
};

export default GuideStatus;