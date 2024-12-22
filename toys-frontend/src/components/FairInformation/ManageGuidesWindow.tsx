import React, { useContext, useEffect, useState } from "react";
import { Modal, Loader, Text, ScrollArea, Button, Group, Divider, Progress } from "@mantine/core";
import { UserContext } from "../../context/UserContext";
import { SimpleGuideData } from "../../types/data.ts";
import { ManageGuidesWindowPropsFair } from "../../types/designed.ts";
import {notifications} from "@mantine/notifications";

const ManageGuidesWindow: React.FC<ManageGuidesWindowPropsFair> = ({
  opened,
  onClose,
  fair,
}) => {
  const [guides, setGuides] = useState<SimpleGuideData[]>([]);
  const [selectedGuides, setSelectedGuides] = useState<SimpleGuideData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeStage, setActiveStage] = useState<"GUIDE">("GUIDE");
  const userContext = useContext(UserContext);

  // Fetch available guides
  const fetchGuides = async (type: "GUIDE") => {
    setLoading(true);
    try {
      const url = new URL(import.meta.env.VITE_BACKEND_API_ADDRESS + "/internal/user/available-guides");
      url.searchParams.append("time", fair.accepted_time);
      url.searchParams.append("type", type);
      url.searchParams.append("auth", await userContext.getAuthToken());

      const response = await fetch(url, { method: "GET" });
      if (!response.ok)
        notifications.show({ title: "Error", message: "Failed to fetch available guides.", color: "red" });

      const data: SimpleGuideData[] = await response.json();

      if (type === "GUIDE") {
        setGuides(data);
        setSelectedGuides(fair.guides.map((guide) => ({ id: guide.id, name: guide.full_name } as SimpleGuideData)));
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
  }, [opened, fair.accepted_time]);

  // Toggle guide selection
  const toggleGuideSelection = (guide: SimpleGuideData) => {
    setSelectedGuides((prev) => {
      if (prev.some((g) => g.id === guide.id)) {
        return prev.filter((g) => g.id !== guide.id); // Deselect guide
      } else {
        return [...prev, guide]; // Select guide
      }
    });
  };


  // Handle save
  const handleSave = async () => {
    setLoading(true);
    try {
      const urlRemove = new URL(import.meta.env.VITE_BACKEND_API_ADDRESS + "/internal/people/invite");
      const urlInvite = new URL(import.meta.env.VITE_BACKEND_API_ADDRESS + "/internal/people/invite");
      console.log(fair);
    const guideIdsToRemove = fair.guides
      .map((g) => g.id)
      .filter((g) => !selectedGuides.some((s) => s.id === g))
      .join(",");
      console.log("GUIDE IDS: ", guideIdsToRemove);
      const guideIdsToInvite = [...selectedGuides.map((g) => g.id)].join(",");

      // Remove previous guides
      urlRemove.searchParams.append("fid", fair.fair_id);
      urlRemove.searchParams.append("guides", guideIdsToRemove);
      urlRemove.searchParams.append("auth", await userContext.getAuthToken());

      await fetch(urlRemove.toString(), { method: "POST" });

      // Add new guides
      urlInvite.searchParams.append("tid", fair.fair_id);
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

  console.log("ManageGuidesWindow", { guides, selectedGuides });
  console.log("tour_id", fair.fair_id);
  return (
    <Modal opened={opened} onClose={onClose} title="Rehberleri Yönet" centered size="md">
      <Progress value={activeStage === "GUIDE" ? 50 : 100} size="sm" mb="lg" />
      <Text mb="md">
        {activeStage === "GUIDE"
          ? `1. Aşama: Bu tur için 0 tane rehber seçin.`
          : "2. Aşama: Bu tur için amatör rehberleri seçin."}
      </Text>

      {loading ? (
        <Loader color="violet" />
      ) : error ? (
        <Text c="red">{error}</Text>
      ) : (
        <ScrollArea h={400}>
          {guides.map((guide) => (
            <Button
              key={guide.id}
              variant={selectedGuides.some((g) => g.id === guide.id) ? "filled" : "light"}
              fullWidth
              justify="start"
              onClick={() => toggleGuideSelection(guide)}
              mb="xs"
              disabled={
            selectedGuides.length >= 1 &&
            !selectedGuides.some((g) => g.id === guide.id)
              }
            >
              <Group justify="space-between" w="100%">
            <Text fw={500}>
              {guide.name} {guide.id === userContext.user.id && "(You)"}
            </Text>
              </Group>
            </Button>
          ))}
        </ScrollArea>
    )}

    <Divider my="sm" />

    <Button
      fullWidth
      onClick={handleSave}
      color="violet"
    >
      Kaydet
    </Button>
    </Modal>
  );
};

export default ManageGuidesWindow;
