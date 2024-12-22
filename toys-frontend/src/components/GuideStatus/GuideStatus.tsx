import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Box, Button, Group, Alert, Text, Space, Stack } from '@mantine/core';
import { IconInfoCircle, IconCheck, IconX, IconUserPlus, IconLogout } from '@tabler/icons-react';
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
const TOUR_ENROLL_URL = new URL(import.meta.env.VITE_BACKEND_API_ADDRESS + "/internal/event/enroll");
const TOUR_WITHDRAW_URL = new URL(import.meta.env.VITE_BACKEND_API_ADDRESS + "/internal/event/withdraw");

const GuideStatus: React.FC<GuideStatusProps> = ({ tour, refreshTour }) => {
  const userContext = useContext(UserContext);
  const [isEnrolled, setIsEnrolled] = useState<boolean>(false);
  const [isInvited, setIsInvited] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [enrollSuccess, setEnrollSuccess] = useState<boolean>(false);
  const [withdrawSuccess, setWithdrawSuccess] = useState<boolean>(false);
  const [inviteResponseSuccess, setInviteResponseSuccess] = useState<boolean>(false);

  const checkEnrollmentStatus = useCallback(async () => {
    if (userContext.user.role !== UserRole.GUIDE && userContext.user.role !== UserRole.ADVISOR) return;

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
        setInviteResponseSuccess(true);
        notifications.show({
          title: 'Başarılı',
          message: 'Tur daveti kabul edildi',
          color: 'green',
          icon: <IconCheck />,
          autoClose: 5000,
        });
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
        setInviteResponseSuccess(true);
        notifications.show({
          title: 'Başarılı',
          message: 'Tur daveti reddedildi',
          color: 'blue',
          icon: <IconCheck />,
          autoClose: 5000,
        });
        refreshTour();
        await checkEnrollmentStatus();
      }
    } catch (error) {
      console.error('Error rejecting invite:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEnroll = async () => {
    setIsLoading(true);
    try {
      const enrollUrl = new URL(TOUR_ENROLL_URL);
      enrollUrl.searchParams.append("auth", await userContext.getAuthToken());
      enrollUrl.searchParams.append("event_id", tour.tour_id);

      const res = await fetch(enrollUrl, {
        method: 'POST'
      });

      if (res.ok) {
        setEnrollSuccess(true);
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
      console.error('Error enrolling in tour:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleWithdraw = async () => {
    setIsLoading(true);
    try {
      const withdrawUrl = new URL(TOUR_WITHDRAW_URL);
      withdrawUrl.searchParams.append("auth", await userContext.getAuthToken());
      withdrawUrl.searchParams.append("event_id", tour.tour_id);

      const res = await fetch(withdrawUrl, {
        method: 'POST'
      });

      if (res.ok) {
        setWithdrawSuccess(true);
        notifications.show({
          title: 'Başarılı',
          message: 'Turdan başarıyla ayrıldınız',
          color: 'green',
          icon: <IconCheck />,
          autoClose: 5000,
        });
        refreshTour();
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
      console.error('Error withdrawing from tour:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkEnrollmentStatus();
  }, [checkEnrollmentStatus]);

  if (userContext.user.role !== UserRole.GUIDE && userContext.user.role !== UserRole.ADVISOR) {
    return null;
  }

  if (!isEnrolled && !isInvited) {
    return (
      <Box p="lg" w="100%">
        <Alert
          variant="light"
          color="blue"
          radius="md"
          icon={<IconInfoCircle />}
          title="Rehber Durumu"
          className="bg-slate-100"
        >
          {enrollSuccess ? (
            <Text size="sm" className="text-green-600 font-medium">
              Tura başarıyla kaydoldunuz!
            </Text>
          ) : (
            <>
              <Text size="sm" className="text-slate-900" mb="md">
                Bu tura rehber olarak kaydolabilirsiniz.
              </Text>
              <Button
                leftSection={<IconUserPlus size={16} />}
                variant="filled"
                color="blue"
                onClick={handleEnroll}
                loading={isLoading}
              >
                Bu Turun Rehberi Ol
              </Button>
            </>
          )}
        </Alert>
      </Box>
    );
  }

  if (isEnrolled) {
    return (
      <Box p="lg" w="100%">
        <Alert
          variant="light"
          color="blue"
          radius="md"
          icon={<IconInfoCircle />}
          title="Rehber Durumu"
          className="bg-blue-50"
        >
          {withdrawSuccess ? (
            <Text size="sm" className="text-green-600 font-medium">
              Turdan başarıyla ayrıldınız!
            </Text>
          ) : (
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
                )}
                {tour.status !== "ONGOING" && tour.status !== "FINISHED" && (
                  <Button
                    leftSection={<IconLogout size={16} />}
                    variant="subtle"
                    color="red"
                    w="fit-content"
                    onClick={handleWithdraw}
                    loading={isLoading}
                  >
                    Bu Turun Rehberi Olmaktan Vazgeç
                  </Button>
                )}
              </Stack>
            </>
          )}
        </Alert>
      </Box>
    );
  }

  if (isInvited) {
    return (
      <Box p="lg" w="100%">
        <Alert
          variant="light"
          color="blue"
          radius="md"
          icon={<IconInfoCircle />}
          title="Rehber Daveti"
          className="bg-slate-100"
        >
          {inviteResponseSuccess ? (
            <Text size="sm" className="text-green-600 font-medium">
              Davetiye yanıtınız iletildi!
            </Text>
          ) : (
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
            </>
          )}
        </Alert>
      </Box>
    );
  }

  return null;
};

export default GuideStatus;