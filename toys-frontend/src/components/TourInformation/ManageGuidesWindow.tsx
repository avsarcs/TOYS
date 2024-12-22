import React, { useContext, useEffect, useState } from "react";
import { Modal, Loader, Text, ScrollArea, Button, Group, Divider, Progress } from "@mantine/core";
import { UserContext } from "../../context/UserContext";
import { SimpleGuideData } from "../../types/data.ts";
import { ManageGuidesWindowProps } from "../../types/designed.ts";
import {notifications} from "@mantine/notifications";

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
  const userContext = useContext(UserContext);

  // Fetch available guides or trainees
  const fetchGuides = async (type: "GUIDE" | "TRAINEE") => {
    setLoading(true);
    try {
      const url = new URL(import.meta.env.VITE_BACKEND_API_ADDRESS + "/internal/user/available-guides");
      url.searchParams.append("time", tour.accepted_time);
      url.searchParams.append("type", type);
      url.searchParams.append("auth", await userContext.getAuthToken());

      const response = await fetch(url, { method: "GET" });
      if (!response.ok)
        notifications.show({ title: "Error", message: "Failed to fetch available guides.", color: "red" });

      const data: SimpleGuideData[] = await response.json();

      if (type === "GUIDE") {
        setGuides(data);
        setSelectedGuides(tour.guides.map((guide) => ({ id: guide.id, name: guide.full_name } as SimpleGuideData)));
      } else {
        setTrainees(data);
        setSelectedTrainees(
          tour.trainee_guides.map((trainee) => ({ id: trainee.id, name: trainee.full_name } as SimpleGuideData))
        );
      }
    } catch (err) {
      setError("Unable to fetch available guides.");
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

  // Toggle guide selection
  const toggleGuideSelection = (guide: SimpleGuideData) => {
    setSelectedGuides((prev) => {
      if (prev.some((g) => g.id === guide.id)) {
        return prev.filter((g) => g.id !== guide.id); // Deselect guide
      } else if (prev.length < totalGuidesNeeded) {
        return [...prev, guide]; // Select guide
      }
      return prev; // Do not allow more than totalGuidesNeeded
    });
  };

  // Toggle trainee selection
  const toggleTraineeSelection = (trainee: SimpleGuideData) => {
    setSelectedTrainees((prev) =>
      prev.some((t) => t.id === trainee.id)
        ? prev.filter((t) => t.id !== trainee.id) // Deselect trainee
        : [...prev, trainee] // Select trainee
    );
  };

  // Handle save
  const handleSave = async () => {
    setLoading(true);
    try {
      const urlRemove = new URL(import.meta.env.VITE_BACKEND_API_ADDRESS + "/internal/tours/remove");
      const urlInvite = new URL(import.meta.env.VITE_BACKEND_API_ADDRESS + "/internal/tours/invite");
      console.log(tour);
      const guideIdsToRemove = [...tour.guides
          .map((g) => g.id)
          .filter((g) => !selectedGuides.some((s) => s.id === g)),
        ...tour.trainee_guides
            .map((g) => g.id)
            .filter((g) => !selectedGuides.some((s) => s.id === g)),].join(",");
      console.log("GUIDE IDS: ", guideIdsToRemove);
      const guideIdsToInvite = [...selectedGuides.map((g) => g.id), ...selectedTrainees.map((t) => t.id)].join(",");

      // Remove previous guides and trainees
      urlRemove.searchParams.append("tid", tour.tour_id);
      urlRemove.searchParams.append("guides", guideIdsToRemove);
      urlRemove.searchParams.append("auth", await userContext.getAuthToken());

      await fetch(urlRemove.toString(), { method: "POST" });

      // Add new guides and trainees
      urlInvite.searchParams.append("tid", tour.tour_id);
      urlInvite.searchParams.append("guides", guideIdsToInvite);
      urlInvite.searchParams.append("auth", await userContext.getAuthToken());

      await fetch(urlInvite.toString(), { method: "POST" });

      onClose();
    } catch (error) {
      setError("An error occurred while saving guides.");
    } finally {
      setLoading(false);
    }
  };

  console.log("ManageGuidesWindow", { guides, trainees, selectedGuides, selectedTrainees });
  console.log("tour_id", tour.tour_id);
  return (
    <Modal opened={opened} onClose={onClose} title="Rehberleri Yönet" centered size="md">
      <Progress value={activeStage === "GUIDE" ? 50 : 100} size="sm" mb="lg" />
      <Text mb="md">
        {activeStage === "GUIDE"
          ? `1. Aşama: Bu tur için ${totalGuidesNeeded} tane rehber seçin.`
          : "2. Aşama: Bu tur için amatör rehberleri seçin."}
      </Text>

      {loading ? (
        <Loader color="violet" />
      ) : error ? (
        <Text c="red">{error}</Text>
      ) : (
        <ScrollArea h={400}>
          {activeStage === "GUIDE"
            ? guides.map((guide) => (
                <Button
                  key={guide.id}
                  variant={selectedGuides.some((g) => g.id === guide.id) ? "filled" : "light"}
                  fullWidth
                  justify="start"
                  onClick={() => toggleGuideSelection(guide)}
                  mb="xs"
                  disabled={
                    selectedGuides.length >= totalGuidesNeeded &&
                    !selectedGuides.some((g) => g.id === guide.id)
                  }
                >
                  <Group justify="space-between" w="100%">
                    <Text fw={500}>
                      {guide.name} {guide.id === userContext.user.id && "(You)"}
                    </Text>
                  </Group>
                </Button>
              ))
            : trainees.map((trainee) => (
                <Button
                  key={trainee.id}
                  variant={selectedTrainees.some((t) => t.id === trainee.id) ? "filled" : "light"}
                  fullWidth
                  justify="start"
                  onClick={() => toggleTraineeSelection(trainee)}
                  mb="xs"
                >
                  <Text fw={500}>{trainee.name}</Text>
                </Button>
              ))}
        </ScrollArea>
      )}

      <Divider my="sm" />

      {activeStage === "GUIDE" ? (
        <Button
          fullWidth
          onClick={() => setActiveStage("TRAINEE")}
          color="violet"
          disabled={selectedGuides.length < totalGuidesNeeded}
        >
          Sonraki Aşama
        </Button>
      ) : (
        <Button
          fullWidth
          onClick={handleSave}
          color="violet"
        >
          Kaydet
        </Button>
      )}
    </Modal>
  );
};

export default ManageGuidesWindow;
