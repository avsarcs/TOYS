import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Box, Button, Group, Alert, Text, Space } from '@mantine/core';
import { IconInfoCircle, IconCheck, IconX } from '@tabler/icons-react';
import { UserContext } from '../../context/UserContext';
import { UserRole } from '../../types/enum';
import { TourData } from '../../types/data';
import { notifications } from '@mantine/notifications';

interface GuideStatusProps {
  tour: TourData;
  refreshTour: () => void;
}

const TOUR_START_URL = new URL(import.meta.env.VITE_BACKEND_API_ADDRESS + "/internal/event/tour/start-tour");
const TOUR_END_URL = new URL(import.meta.env.VITE_BACKEND_API_ADDRESS + "/internal/event/tour/end-tour");

const GuideStatus: React.FC<GuideStatusProps> = ({ tour, refreshTour }) => {
  const userContext = useContext(UserContext);
  const [isEnrolled, setIsEnrolled] = useState<boolean>(false);
  const [isInvited, setIsInvited] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const checkEnrollmentStatus = useCallback(async () => {
    if (userContext.user.role !== UserRole.GUIDE) return;

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
    }
  }, [userContext.user.role, tour.tour_id]);

  const handleStartTour = useCallback(async () => {
    setIsLoading(true);
    try {
      const startUrl = new URL(TOUR_START_URL);
      startUrl.searchParams.append("auth", await userContext.getAuthToken());
      startUrl.searchParams.append("tour_id", tour.tour_id);
      startUrl.searchParams.append("start_time", "");

      const res = await fetch(startUrl, {
        method: "POST"
      });

      if (res.ok) {
        notifications.show({
          title: 'Başarılı',
          message: 'TURUN BAŞLANGIÇ VAKTİ BAŞARIYLA BİLDİRİLDİ',
          color: 'green',
          icon: <IconCheck />,
          autoClose: 5000,
        });
        refreshTour();
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
      console.error("Failed to start tour:", error);
    } finally {
      setIsLoading(false);
    }
  }, [tour.tour_id, refreshTour]);

  const handleEndTour = useCallback(async () => {
    setIsLoading(true);
    try {
      const endUrl = new URL(TOUR_END_URL);
      endUrl.searchParams.append("auth", await userContext.getAuthToken());
      endUrl.searchParams.append("tour_id", tour.tour_id);
      endUrl.searchParams.append("end_time", "");

      const res = await fetch(endUrl, {
        method: "POST"
      });

      if (res.ok) {
        notifications.show({
          title: 'Başarılı',
          message: 'TURUN BİTİŞ VAKTİ BAŞARIYLA BİLDİRİLDİ',
          color: 'green',
          icon: <IconCheck />,
          autoClose: 5000,
        });
        refreshTour();
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
      console.error("Failed to end tour:", error);
    } finally {
      setIsLoading(false);
    }
  }, [tour.tour_id, refreshTour]);

  const handleAcceptInvite = async () => {
    setIsLoading(true);
    try {
      const acceptUrl = new URL(import.meta.env.VITE_BACKEND_API_ADDRESS + "/respond/guide/tour-invite");
      acceptUrl.searchParams.append("auth", await userContext.getAuthToken());
      acceptUrl.searchParams.append("request_id", tour.tour_id);
      acceptUrl.searchParams.append("response", "true");

      const res = await fetch(acceptUrl, {
        method: 'POST'
      });

      if (res.ok) {
        refreshTour();
        await checkEnrollmentStatus();
      }
    } catch (error) {
      console.error('Error accepting invite:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRejectInvite = async () => {
    setIsLoading(true);
    try {
      const rejectUrl = new URL(import.meta.env.VITE_BACKEND_API_ADDRESS + "/respond/guide/tour-invite");
      rejectUrl.searchParams.append("auth", await userContext.getAuthToken());
      rejectUrl.searchParams.append("request_id", tour.tour_id);
      rejectUrl.searchParams.append("response", "false");

      const res = await fetch(rejectUrl, {
        method: 'POST'
      });

      if (res.ok) {
        refreshTour();
        await checkEnrollmentStatus();
      }
    } catch (error) {
      console.error('Error rejecting invite:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkEnrollmentStatus();
  }, [checkEnrollmentStatus]);

  if ((userContext.user.role !== UserRole.GUIDE && userContext.user.role !== UserRole.ADVISOR) || (!isEnrolled && !isInvited)) {
    return null;
  }

  return (
    <Box p="lg" w="100%">
      {isEnrolled && (
        <Alert
          variant="light"
          color="blue"
          radius="md"
          icon={<IconInfoCircle />}
          title="Rehber Durumu"
          className="bg-blue-50"
        >
          <Text size="sm" c="blue">Bu turun rehberi sizsiniz!</Text>
          {userContext.user.role === UserRole.GUIDE && (
            <>
              <Space h="md" />
              <Group>
                {tour.status !== "ONGOING" && tour.status !== "FINISHED" && (
                  <Button
                    w="fit-content"
                    color="green"
                    onClick={handleStartTour}
                    loading={isLoading}
                  >
                    TURUN BAŞLADIĞINI BİLDİR
                  </Button>
                )}
                {tour.status === "ONGOING" && (
                  <Button
                    w="fit-content"
                    color="red"
                    onClick={handleEndTour}
                    loading={isLoading}
                  >
                    TURUN BİTTİĞİNİ BİLDİR
                  </Button>
                )}
              </Group>
            </>
          )}
        </Alert>
      )}

      {!isEnrolled && isInvited && (
        <Alert
          variant="light"
          color="blue"
          radius="md"
          icon={<IconInfoCircle />}
          title="Rehber Daveti"
          className="bg-slate-100"
        >
          <Text size="sm" className="text-slate-900" mb="md">
            Bu turun rehberi olmaya davet edildiniz!
          </Text>
          <Group>
            <Button
              leftSection={<IconCheck size={16} />}
              variant="filled"
              color="blue"
              onClick={handleAcceptInvite}
              loading={isLoading}
            >
              Kabul Et
            </Button>
            <Button
              leftSection={<IconX size={16} />}
              variant="subtle"
              color="slate"
              onClick={handleRejectInvite}
              loading={isLoading}
            >
              Reddet
            </Button>
          </Group>
        </Alert>
      )}
    </Box>
  );
};

export default GuideStatus;