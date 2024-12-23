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
  Transition,
  Box
} from "@mantine/core";
import { UserContext } from "../../context/UserContext";
import { SimpleGuideData } from "../../types/data.ts";
import { ManageGuidesWindowProps } from "../../types/designed.ts";
import { notifications } from "@mantine/notifications";
import { 
  IconUserCheck, 
  IconUsers, 
  IconArrowRight, 
  IconCheck, 
  IconAlertCircle,
  IconUserPlus,
  IconChevronRight 
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
  const userContext = useContext(UserContext);

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
        message: "Rehberler başarıyla atandı ve davet edildi.",
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

  return (
    <Modal 
      opened={opened} 
      onClose={onClose} 
      title={
        <Group gap="xs">
          {activeStage === "GUIDE" ? <IconUserCheck size={24} /> : <IconUserPlus size={24} />}
          <Title order={3}>
            {activeStage === "GUIDE" ? "Rehber Seçimi" : "Amatör Rehber Seçimi"}
          </Title>
        </Group>
      }
      centered 
      size="lg"
    >
      <Stack>
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
                  <Button
                    key={guide.id}
                    variant={selectedGuides.some((g) => g.id === guide.id) ? "filled" : "light"}
                    color={selectedGuides.some((g) => g.id === guide.id) ? "blue" : "gray"}
                    fullWidth
                    justify="space-between"
                    onClick={() => toggleGuideSelection(guide)}
                    disabled={selectedGuides.length >= totalGuidesNeeded && !selectedGuides.some((g) => g.id === guide.id)}
                    rightSection={selectedGuides.some((g) => g.id === guide.id) && <IconCheck size={16} />}
                  >
                    <Group gap="sm">
                      <Text fw={500}>
                        {guide.name}
                      </Text>
                      {guide.id === userContext.user.id && (
                        <Badge color="blue" variant="light" size="sm">Siz</Badge>
                      )}
                    </Group>
                  </Button>
                )) : <EmptyState type="GUIDE" />
              ) : (
                trainees.length > 0 ? trainees.map((trainee) => (
                  <Button
                    key={trainee.id}
                    variant={selectedTrainees.some((t) => t.id === trainee.id) ? "filled" : "light"}
                    color={selectedTrainees.some((t) => t.id === trainee.id) ? "violet" : "gray"}
                    fullWidth
                    justify="space-between"
                    onClick={() => toggleTraineeSelection(trainee)}
                    rightSection={selectedTrainees.some((t) => t.id === trainee.id) && <IconCheck size={16} />}
                  >
                    <Text fw={500}>{trainee.name}</Text>
                  </Button>
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
                  disabled={selectedGuides.length < totalGuidesNeeded}
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