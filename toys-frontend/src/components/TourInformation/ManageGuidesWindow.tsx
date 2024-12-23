import React, { useContext, useEffect, useState } from "react";
import {
  Modal,
  Loader,
  Text,
  ScrollArea,
  Button,
  Group,
  Divider,
  Stack,
  Title,
  Progress,
  Badge,
  Alert,
  Paper,
  ThemeIcon,
  Box,
  ActionIcon,
  Tooltip
} from "@mantine/core";
import { UserContext } from "../../context/UserContext";
import { SimpleGuideData } from "../../types/data.ts";
import { ManageGuidesWindowProps } from "../../types/designed.ts";
import { notifications } from "@mantine/notifications";
import {
  IconUserCheck,
  IconUsers,
  IconCheck,
  IconAlertCircle,
  IconUserPlus,
  IconChevronRight,
  IconX
} from '@tabler/icons-react';

const ManageGuidesWindow: React.FC<ManageGuidesWindowProps> = ({
  opened,
  onClose,
  tour,
  totalGuidesNeeded,
}) => {
  const [guides, setGuides] = useState<SimpleGuideData[]>([]);
  const [trainees, setTrainees] = useState<SimpleGuideData[]>([]);
  const [selectedGuides, setSelectedGuides] = useState<SimpleGuideData[]>([]);
  const [selectedTrainees, setSelectedTrainees] = useState<SimpleGuideData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeStage, setActiveStage] = useState<"GUIDE" | "TRAINEE">("GUIDE");
  const [isSaving, setIsSaving] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const userContext = useContext(UserContext);

  const handleRemoveGuide = async (guideId: string) => {
    setIsRemoving(true);
    try {
      const urlRemove = new URL(import.meta.env.VITE_BACKEND_API_ADDRESS + "/internal/event/remove");
      urlRemove.searchParams.append("event_id", tour.tour_id);
      urlRemove.searchParams.append("guides", guideId);
      urlRemove.searchParams.append("auth", await userContext.getAuthToken());

      const response = await fetch(urlRemove.toString(), { method: "POST" });

      if (!response.ok) {
        throw new Error("Failed to remove guide");
      }

      notifications.show({
        title: "Başarılı",
        message: "Rehber başarıyla kaldırıldı.",
        color: "green",
        icon: <IconCheck size={16} />,
      });

      // Update local state to reflect the removal
      if (activeStage === "GUIDE") {
        setSelectedGuides(prev => prev.filter(g => g.id !== guideId));
      } else {
        setSelectedTrainees(prev => prev.filter(t => t.id !== guideId));
      }
    } catch (error) {
      notifications.show({
        title: "Hata",
        message: "Rehber kaldırılırken bir hata oluştu.",
        color: "red",
        icon: <IconAlertCircle size={16} />,
      });
    } finally {
      setIsRemoving(false);
    }
  };

  const fetchGuides = async (type: "GUIDE" | "TRAINEE") => {
    setLoading(true);
    setError(null);
    try {
      const url = new URL(import.meta.env.VITE_BACKEND_API_ADDRESS + "/internal/user/available-guides");
      url.searchParams.append("time", tour.accepted_time);
      url.searchParams.append("type", type);
      url.searchParams.append("auth", await userContext.getAuthToken());

      const response = await fetch(url);
      if (!response.ok) throw new Error("Rehberler getirilemedi.");

      const data: SimpleGuideData[] = await response.json();

      if (type === "GUIDE") {
        setGuides(data);
        setSelectedGuides(tour.guides.map(guide => ({
          id: guide.id,
          name: guide.full_name
        } as SimpleGuideData)));
      } else {
        setTrainees(data);
        setSelectedTrainees(tour.trainee_guides.map(trainee => ({
          id: trainee.id,
          name: trainee.full_name
        } as SimpleGuideData)));
      }
    } catch (err) {
      setError(type === "GUIDE"
        ? "Rehberler şu anda getirilemedi. Lütfen daha sonra tekrar deneyin."
        : "Amatör rehberler şu anda getirilemedi. Lütfen daha sonra tekrar deneyin."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (opened) {
      fetchGuides("GUIDE");
      setActiveStage("GUIDE");
    }
  }, [opened, tour.accepted_time]);

  const toggleGuideSelection = (guide: SimpleGuideData) => {
    setSelectedGuides((prev) => {
      if (prev.some((g) => g.id === guide.id)) {
        return prev.filter((g) => g.id !== guide.id);
      } else if (prev.length < totalGuidesNeeded) {
        return [...prev, guide];
      }
      return prev;
    });
  };

  const toggleTraineeSelection = (trainee: SimpleGuideData) => {
    setSelectedTrainees((prev) =>
      prev.some((t) => t.id === trainee.id)
        ? prev.filter((t) => t.id !== trainee.id)
        : [...prev, trainee]
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const urlRemove = new URL(import.meta.env.VITE_BACKEND_API_ADDRESS + "/internal/event/remove");
      const urlInvite = new URL(import.meta.env.VITE_BACKEND_API_ADDRESS + "/internal/event/invite");
      const urlEnroll = new URL(import.meta.env.VITE_BACKEND_API_ADDRESS + "/internal/event/enroll");

      const guideIdsToRemove = [
        ...tour.guides.map((g) => g.id).filter((g) => !selectedGuides.some((s) => s.id === g)),
        ...tour.trainee_guides.map((g) => g.id).filter((g) => !selectedGuides.some((s) => s.id === g)),
      ].join(",");

      const guideIdsToInvite = [
        ...selectedGuides.map((g) => g.id),
        ...selectedTrainees.map((t) => t.id)
      ].join(",");

      urlRemove.searchParams.append("event_id", tour.tour_id);
      urlRemove.searchParams.append("guides", guideIdsToRemove);
      urlRemove.searchParams.append("auth", await userContext.getAuthToken());

      await fetch(urlRemove.toString(), { method: "POST" });

      const isCurrentUserSelected = selectedGuides.some((g) => g.id === userContext.user.id);

      if (isCurrentUserSelected) {
        urlEnroll.searchParams.append("event_id", tour.tour_id);
        urlEnroll.searchParams.append("auth", await userContext.getAuthToken());
        await fetch(urlEnroll.toString(), { method: "POST" });
      } else {
        urlInvite.searchParams.append("event_id", tour.tour_id);
        urlInvite.searchParams.append("guides", guideIdsToInvite);
        urlInvite.searchParams.append("auth", await userContext.getAuthToken());
        await fetch(urlInvite.toString(), { method: "POST" });
      }

      notifications.show({
        title: "Başarılı",
        message: "Rehberlerdeki değişiklikler yapıldı",
        color: "green",
        icon: <IconCheck size={16} />,
      });

      setTimeout(onClose, 1500);
    } catch (error) {
      notifications.show({
        title: "Hata",
        message: "Rehberler atanırken bir hata oluştu. Lütfen tekrar deneyin.",
        color: "red",
        icon: <IconAlertCircle size={16} />,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const EmptyState = ({ type }: { type: "GUIDE" | "TRAINEE" }) => (
    <Paper p="xl" radius="md" withBorder className="bg-gray-50">
      <Stack align="center" justify="center" gap="md">
        <ThemeIcon size={50} radius="xl" color="gray">
          <IconUsers size={30} />
        </ThemeIcon>
        <Text size="lg" fw={500} ta="center" c="dimmed">
          {type === "GUIDE"
            ? "Bu saat için müsait rehber bulunmuyor."
            : "Bu saat için müsait amatör rehber bulunmuyor."}
        </Text>
        <Text size="sm" c="dimmed" ta="center">
          {type === "GUIDE"
            ? "Lütfen farklı bir saat seçin veya daha sonra tekrar deneyin."
            : "Şu anda amatör rehber ataması yapılamıyor."}
        </Text>
      </Stack>
    </Paper>
  );

  const renderProgress = () => {
    const progress = (selectedGuides.length / totalGuidesNeeded) * 100;
    return (
      <Box className="mb-4">
        <Group justify="space-between" mb={5}>
          <Text size="sm" fw={500}>Rehber seçimi ilerlemesi</Text>
          <Text size="sm" c="dimmed">{selectedGuides.length}/{totalGuidesNeeded}</Text>
        </Group>
        <Progress
          value={progress}
          color={progress === 100 ? "green" : "blue"}
          animated
          size="md"
          radius="xl"
        />
      </Box>
    );
  };

  const GuideCard = ({ guide, isCurrentUser = false, variant = "detailed", showRemove = false }: {
    guide: any,
    isCurrentUser?: boolean,
    variant?: "detailed" | "compact",
    showRemove?: boolean
  }) => {
    const getRoleBadgeColor = (role: string) => {
      switch (role) {
        case "ADVISOR": return "green";
        case "GUIDE": return "blue";
        case "TRAINEE": return "violet";
        default: return "gray";
      }
    };

    const getRoleText = (role: string) => {
      switch (role) {
        case "ADVISOR": return "Danışman";
        case "GUIDE": return "Rehber";
        case "TRAINEE": return "Amatör";
        default: return role;
      }
    };

    return (
      <Paper withBorder p="sm" radius="md" className={variant === "detailed" ? "bg-white" : ""}>
        <Group justify="space-between">
          <Stack gap="xs" style={{ flex: 1 }}>
            <Group justify="space-between">
              <Group gap="xs">
                <Text fw={500} size={variant === "detailed" ? "md" : "sm"}>
                  {guide.full_name || guide.name}
                </Text>
                {isCurrentUser && (
                  <Badge size="sm" variant="dot" color="blue">Siz</Badge>
                )}
              </Group>
              <Group gap="xs">
                <Badge
                  size="sm"
                  color={getRoleBadgeColor(guide.role)}
                  variant="light"
                >
                  {getRoleText(guide.role)}
                </Badge>
                {showRemove && (
                  <Tooltip label="Rehberi Kaldır">
                    <ActionIcon
                      color="red"
                      variant="light"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveGuide(guide.id);
                      }}
                      loading={isRemoving}
                      disabled={isRemoving}
                    >
                      <IconX size={16} />
                    </ActionIcon>
                  </Tooltip>
                )}
              </Group>
            </Group>
            {guide.experience && (
              <Text size="sm" c="dimmed" className="italic">
                Deneyim: {guide.experience}
              </Text>
            )}
          </Stack>
        </Group>
      </Paper>
    );
  };

  const renderCurrentGuides = () => {
    const currentGuides = activeStage === "GUIDE" ? tour.guides : tour.trainee_guides;

    if (currentGuides.length === 0) return null;

    return (
      <Paper withBorder p="md" radius="md" className="bg-gray-50">
        <Stack gap="xs">
          <Group>
            <ThemeIcon size="md" color={activeStage === "GUIDE" ? "blue" : "violet"} variant="light">
              <IconUserCheck size={16} />
            </ThemeIcon>
            <Text fw={500} size="sm">
              {activeStage === "GUIDE" ? "Mevcut Rehberler" : "Mevcut Amatör Rehberler"}
            </Text>
          </Group>
          <Divider />
          <Stack gap="xs">
            {currentGuides.map((guide) => (
              <GuideCard
                key={guide.id}
                guide={guide}
                isCurrentUser={guide.id === userContext.user.id}
                variant="detailed"
                showRemove={true}
              />
            ))}
          </Stack>
        </Stack>
      </Paper>
    );
  };



  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={<Group gap="xs">
        {activeStage === "GUIDE" ? <IconUserCheck size={24} /> : <IconUserPlus size={24} />}
        <Title order={3}>
          {activeStage === "GUIDE" ? "Rehber Seçimi" : "Amatör Rehber Seçimi"}
        </Title>
      </Group>}
      centered
      size="lg"
    >
      <Stack>
        {renderCurrentGuides()}
        <Divider my="sm" variant="dashed" label="Yeni Seçim" labelPosition="center" />
        {!error && activeStage === "GUIDE" && renderProgress()}

        {!error && (
          <Alert
            color={activeStage === "GUIDE" ? "blue" : "violet"}
            variant="light"
            icon={activeStage === "GUIDE" ? <IconUserCheck /> : <IconUserPlus />}
          >
            {activeStage === "GUIDE"
              ? `Bu tur için ${totalGuidesNeeded} rehber seçmeniz gerekmektedir.`
              : "İsterseniz tura amatör rehber ekleyebilirsiniz."}
          </Alert>
        )}

        {loading ? (
          <Stack align="center" p="xl">
            <Loader color="violet" size="lg" />
            <Text c="dimmed">Rehberler yükleniyor...</Text>
          </Stack>
        ) : error ? (
          <Alert color="red" variant="filled" icon={<IconAlertCircle />}>
            {error}
          </Alert>
        ) : (
          <ScrollArea.Autosize mah={400} type="scroll">
            <Stack gap="xs">
              {activeStage === "GUIDE" ? (
                guides.length > 0 ? guides.map((guide) => (
                  <Paper
                    key={guide.id}
                    className="cursor-pointer transition-all duration-200 hover:shadow-md"
                    onClick={() => toggleGuideSelection(guide)}
                    style={{
                      opacity: selectedGuides.length >= totalGuidesNeeded &&
                        !selectedGuides.some((g) => g.id === guide.id) ? 0.5 : 1
                    }}
                  >
                    <Group wrap="nowrap" justify="space-between">
                      <GuideCard
                        guide={guide}
                        isCurrentUser={guide.id === userContext.user.id}
                        variant="compact"
                      />
                      <ThemeIcon
                        size="xl"
                        radius="xl"
                        variant={selectedGuides.some((g) => g.id === guide.id) ? "filled" : "light"}
                        color={selectedGuides.some((g) => g.id === guide.id) ? "blue" : "gray"}
                      >
                        <IconCheck size={20} />
                      </ThemeIcon>
                    </Group>
                  </Paper>
                )) : <EmptyState type="GUIDE" />
              ) : (
                trainees.length > 0 ? trainees.map((trainee) => (
                  <Paper
                    key={trainee.id}
                    className="cursor-pointer transition-all duration-200 hover:shadow-md"
                    onClick={() => toggleTraineeSelection(trainee)}
                  >
                    <Group wrap="nowrap" justify="space-between">
                      <GuideCard
                        guide={trainee}
                        isCurrentUser={trainee.id === userContext.user.id}
                        variant="compact"
                      />
                      <ThemeIcon
                        size="xl"
                        radius="xl"
                        variant={selectedTrainees.some((t) => t.id === trainee.id) ? "filled" : "light"}
                        color={selectedTrainees.some((t) => t.id === trainee.id) ? "violet" : "gray"}
                      >
                        <IconCheck size={20} />
                      </ThemeIcon>
                    </Group>
                  </Paper>
                )) : <EmptyState type="TRAINEE" />
              )}
            </Stack>
          </ScrollArea.Autosize>
        )}

        {!error && !loading && (
          <>
            <Divider my="md" />
            <Group justify="flex-end">
              {activeStage === "GUIDE" ? (
                <Button
                  onClick={() => {
                    setActiveStage("TRAINEE");
                    fetchGuides("TRAINEE");
                  }}
                  rightSection={<IconChevronRight size={16} />}
                  color="blue"
                >
                  Amatör Rehber Seçimine Geç
                </Button>
              ) : (
                <Group>
                  <Button
                    variant="light"
                    onClick={() => setActiveStage("GUIDE")}
                    disabled={isSaving}
                  >
                    Geri Dön
                  </Button>
                  <Button
                    onClick={handleSave}
                    loading={isSaving}
                    color="green"
                    leftSection={<IconCheck size={16} />}
                  >
                    Seçimi Tamamla
                  </Button>
                </Group>
              )}
            </Group>
          </>
        )}
      </Stack>
    </Modal>
  );
};

export default ManageGuidesWindow;