import React, { useContext, useEffect, useState } from "react";
import { Modal, Loader, Text, ScrollArea, Button, Group, Divider } from "@mantine/core";
import { UserContext } from "../../context/UserContext";
import { SimpleGuideData } from "../../types/data.ts";
import { ManageGuidesWindowProps } from "../../types/designed.ts";

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
      url.searchParams.append("auth", userContext.authToken);

      const response = await fetch(url, { method: "GET" });
      if (!response.ok) throw new Error("Failed to fetch guides.");

      const data: SimpleGuideData[] = await response.json();

      if (type === "GUIDE") {
        setGuides(data);
        // Pre-select existing guides
        setSelectedGuides(tour.guides.map((guide) => ({ id: guide.id, name: guide.full_name } as SimpleGuideData)));
      } else {
        setTrainees(data);
        // Pre-select existing trainee guides
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
  }, [opened, tour.accepted_time, userContext.authToken]);

  // Toggle guide selection
  const toggleGuideSelection = (guide: SimpleGuideData) => {
    setSelectedGuides((prev) =>
      prev.some((g) => g.id === guide.id)
        ? prev.filter((g) => g.id !== guide.id) // Deselect guide
        : [...prev, guide] // Select guide
    );
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

      const guideIdsToRemove = [...tour.guides.map((g) => g.id), ...tour.trainee_guides.map((t) => t.id)];
      const guideIdsToInvite = [...selectedGuides.map((g) => g.id), ...selectedTrainees.map((t) => t.id)];

      // Remove previous guides and trainees
      await fetch(urlRemove.toString(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tid: tour.tour_id, guid: guideIdsToRemove, auth: userContext.authToken }),
      });

      // Add new guides and trainees
      await fetch(urlInvite.toString(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tid: tour.tour_id, guid: guideIdsToInvite, auth: userContext.authToken }),
      });

      onClose();
    } catch (error) {
      setError("An error occurred while saving guides.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal opened={opened} onClose={onClose} title="Available Guides" centered size="md">
      <Group mb="sm">
        <Button
          size="xs"
          variant="outline"
          disabled={activeStage === "GUIDE"}
          onClick={() => {
            fetchGuides("GUIDE");
            setActiveStage("GUIDE");
          }}
        >
          Back to Guides
        </Button>
        {activeStage === "GUIDE" && (
          <Button
            size="xs"
            onClick={() => {
              fetchGuides("TRAINEE");
              setActiveStage("TRAINEE");
            }}
          >
            Next: Trainee Guides
          </Button>
        )}
      </Group>
      <Divider mb="sm" />

      {loading ? (
        <Loader color="violet" />
      ) : error ? (
        <Text color="red">{error}</Text>
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
      {selectedGuides.length < totalGuidesNeeded && (
        <Text color="red" mb="sm">
          Please select {totalGuidesNeeded - selectedGuides.length} more guide(s) to continue.
        </Text>
      )}
      <Button
        fullWidth
        onClick={handleSave}
        color="violet"
        disabled={selectedGuides.length < totalGuidesNeeded}
      >
        Save
      </Button>
    </Modal>
  );
};

export default ManageGuidesWindow;
