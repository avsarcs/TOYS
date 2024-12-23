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
  Badge,
  Alert,
  Paper,
  ThemeIcon,
  ActionIcon,
  Tooltip
} from "@mantine/core";
import { UserContext } from "../../context/UserContext";
import { SimpleGuideData } from "../../types/data.ts";
import { ManageGuidesWindowPropsFair } from "../../types/designed.ts";
import { notifications } from "@mantine/notifications";
import {
  IconUserCheck,
  IconUsers,
  IconCheck,
  IconAlertCircle,
  IconX
} from '@tabler/icons-react';

const ManageGuidesWindow: React.FC<ManageGuidesWindowPropsFair> = ({
                                                                     opened,
                                                                     onClose,
                                                                     fair,
                                                                   }) => {
  const [guides, setGuides] = useState<SimpleGuideData[]>([]);
  const [selectedGuides, setSelectedGuides] = useState<SimpleGuideData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const userContext = useContext(UserContext);

  const handleRemoveGuide = async (guideId: string) => {
    setIsRemoving(true);
    try {
      const urlRemove = new URL(import.meta.env.VITE_BACKEND_API_ADDRESS + "/internal/event/remove");
      urlRemove.searchParams.append("event_id", fair.fair_id);
      urlRemove.searchParams.append("guides[]", guideId);
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

      setSelectedGuides(prev => prev.filter(g => g.id !== guideId));
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

  const fetchGuides = async () => {
    setLoading(true);
    setError(null);
    try {
      const url = new URL(import.meta.env.VITE_BACKEND_API_ADDRESS + "/internal/user/available-guides");

      url.searchParams.append("auth", await userContext.getAuthToken());
      url.searchParams.append("time", fair.start_time);
      url.searchParams.append("type", "GUIDE");

      const response = await fetch(url);
      if (!response.ok) throw new Error("Rehberler getirilemedi.");
      const data: SimpleGuideData[] = await response.json();

      setGuides(data);
      setSelectedGuides(fair.guides.map(guide => ({
        id: guide.id,
        name: guide.full_name
      } as SimpleGuideData)));
    } catch (err) {
      setError("Rehberler şu anda getirilemedi. Lütfen daha sonra tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (opened) {
      fetchGuides();
    }
  }, [opened, fair.start_time]);

  const toggleGuideSelection = (guide: SimpleGuideData) => {
    setSelectedGuides((prev) => {
      if (prev.some((g) => g.id === guide.id)) {
        return prev.filter((g) => g.id !== guide.id);
      } else {
        return [...prev, guide];
      }
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const urlRemove = new URL(import.meta.env.VITE_BACKEND_API_ADDRESS + "/internal/event/remove");
      const urlInvite = new URL(import.meta.env.VITE_BACKEND_API_ADDRESS + "/internal/event/invite");

      // Prepare guides to remove
      const guideIdsToRemove = fair.guides.map((g) => g.id).filter((g) => !selectedGuides.some((s) => s.id === g));

      // Prepare guides to invite
      const guideIdsToInvite = selectedGuides.map((g) => g.id);

      // Remove guides
      if (guideIdsToRemove.length > 0) {
        urlRemove.searchParams.append("event_id", fair.fair_id);
        urlRemove.searchParams.append("auth", await userContext.getAuthToken());
        guideIdsToRemove.forEach(id => {
          urlRemove.searchParams.append("guides[]", id);
        });
        await fetch(urlRemove.toString(), { method: "POST" });
      }

      // Invite other guides
      if (guideIdsToInvite.length > 0) {
        urlInvite.searchParams.append("event_id", fair.fair_id);
        urlInvite.searchParams.append("auth", await userContext.getAuthToken());
        guideIdsToInvite.forEach(id => {
          urlInvite.searchParams.append("guides[]", id);
        });
        await fetch(urlInvite.toString(), { method: "POST" });
      }

      notifications.show({
        title: "Başarılı",
        message: "Rehberlerdeki değişiklikler yapıldı (yeni eklenen rehberler daveti kabul edene dek gözükmeyecekler).",
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

  const EmptyState = () => (
      <Paper p="xl" radius="md" withBorder className="bg-gray-50">
        <Stack align="center" justify="center" gap="md">
          <ThemeIcon size={50} radius="xl" color="gray">
            <IconUsers size={30} />
          </ThemeIcon>
          <Text size="lg" fw={500} ta="center" c="dimmed">
            Bu saat için müsait rehber bulunmuyor.
          </Text>
          <Text size="sm" c="dimmed" ta="center">
            Lütfen farklı bir saat seçin veya daha sonra tekrar deneyin.
          </Text>
        </Stack>
      </Paper>
  );

  const GuideCard = ({ guide, isCurrentUser = false, showRemove = false }: {
    guide: any,
    isCurrentUser?: boolean,
    showRemove?: boolean
  }) => {
    const getRoleBadgeColor = (role: string) => {
      switch (role) {
        case "ADVISOR": return "green";
        case "GUIDE": return "blue";
        default: return "gray";
      }
    };

    const getRoleText = (role: string) => {
      switch (role) {
        case "ADVISOR": return "Danışman";
        case "GUIDE": return "Rehber";
        default: return role;
      }
    };

    return (
        <Paper withBorder p="sm" radius="md" className="bg-white">
          <Group justify="space-between">
            <Stack gap="xs" style={{ flex: 1 }}>
              <Group justify="space-between">
                <Group gap="xs">
                  <Text fw={500} size="md">
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
    const currentGuides = fair.guides;
    if (currentGuides.length === 0) return null;

    return (
        <Paper withBorder p="md" radius="md" className="bg-gray-50">
          <Stack gap="xs">
            <Group>
              <ThemeIcon size="md" color="blue" variant="light">
                <IconUserCheck size={16} />
              </ThemeIcon>
              <Text fw={500} size="sm">
                Mevcut Rehberler
              </Text>
            </Group>
            <Divider />
            <Stack gap="xs">
              {currentGuides.map((guide) => (
                  <GuideCard
                      key={guide.id}
                      guide={guide}
                      isCurrentUser={guide.id === userContext.user.id}
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
            <IconUserCheck size={24} />
            <Title order={3}>
              Rehber Seçimi
            </Title>
          </Group>}
          centered
          size="lg"
      >
        <Stack>
          {renderCurrentGuides()}
          <Divider my="sm" variant="dashed" label="Yeni Seçim" labelPosition="center" />
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
                  {guides.length > 0 ? guides.map((guide) => (
                      <Paper
                          key={guide.id}
                          className="cursor-pointer transition-all duration-200 hover:shadow-md"
                          onClick={() => toggleGuideSelection(guide)}
                      >
                        <Group wrap="nowrap" justify="space-between">
                          <GuideCard
                              guide={guide}
                              isCurrentUser={guide.id === userContext.user.id}
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
                  )) : <EmptyState />}
                </Stack>
              </ScrollArea.Autosize>
          )}
          {!error && !loading && (
              <>
                <Divider my="md" />
                <Group justify="flex-end">
                  <Button
                      onClick={handleSave}
                      loading={isSaving}
                      color="green"
                      leftSection={<IconCheck size={16} />}
                  >
                    Seçimi Tamamla
                  </Button>
                </Group>
              </>
          )}
        </Stack>
      </Modal>
  );
};

export default ManageGuidesWindow;