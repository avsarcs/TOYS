import React, { useCallback, useContext, useEffect, useState } from "react";
import { Box, Divider, Flex, Space, Stack, Title, Text, Button, Group, Modal, Textarea } from "@mantine/core";
import { useParams } from "react-router-dom";
import { FairData } from "../../types/data.ts";
import StatusInformation from "../../components/FairInformation/StatusInformation.tsx";
import GeneralInformation from "../../components/FairInformation/GeneralInformation.tsx";
import ApplicantInformation from "../../components/FairInformation/ApplicantInformation.tsx";
import GuideInformation from "../../components/FairInformation/GuideInformation.tsx";
import { UserContext } from "../../context/UserContext.tsx";
import { isObjectEmpty } from "../../lib/utils.tsx";
import { FairStatus, UserRole } from "../../types/enum.ts";

const FAIR_URL = new URL(import.meta.env.VITE_BACKEND_API_ADDRESS + "/internal/event/fair");
const ACTION_URL = new URL(import.meta.env.VITE_BACKEND_API_ADDRESS + "/respond/application/fair");
const CANCEL_URL = new URL(import.meta.env.VITE_BACKEND_API_ADDRESS + "/apply/cancel");
const INVITED_URL = new URL(import.meta.env.VITE_BACKEND_API_ADDRESS + "/internal/user/am-invited");

const FairPage: React.FC = () => {
  const userContext = useContext(UserContext);
  const [error, setError] = useState<Error | undefined>(undefined);
  const params = useParams();
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [fair, setFair] = useState<FairData>({} as FairData);
  const [cancelReason, setCancelReason] = useState("");
  if (!params.fairId) throw new Error("Fair ID is required");

  const isCoordinator = userContext.user.role === UserRole.COORDINATOR;

  const handleAcceptFair = useCallback(async () => {
    const actionUrl = new URL(ACTION_URL);
    actionUrl.searchParams.append("application_id", params.fairId as string);
    actionUrl.searchParams.append("auth", await userContext.getAuthToken());
    actionUrl.searchParams.append("response", "true");

    const res = await fetch(actionUrl, {
      method: "POST",
    });

    if (!res.ok) {
      throw new Error("Something went wrong");
    }

    setFair({ ...fair, status: FairStatus.CONFIRMED });
  }, []);

  const handleRejectFair = useCallback(async () => {
    const actionUrl = new URL(ACTION_URL);
    actionUrl.searchParams.append("application_id", params.fairId as string);
    actionUrl.searchParams.append("auth", await userContext.getAuthToken());
    actionUrl.searchParams.append("response", "false");

    const res = await fetch(actionUrl, {
      method: "POST",
    });

    if (!res.ok) {
      throw new Error("Something went wrong");
    }

    setFair({ ...fair, status: FairStatus.REJECTED });
  }, []);
  
  const getFair = useCallback(async (fairId: string) => {
    console.log(fairId);
    const fairUrl = new URL(FAIR_URL);
    fairUrl.searchParams.append("fair_id", fairId);
    fairUrl.searchParams.append("auth", await userContext.getAuthToken());

    const res = await fetch(fairUrl, {
      method: "GET",
    });

    if (!res.ok) {
      throw new Error("Something went wrong");
    }

    const fairText = await res.text();
    if (fairText.length === 0) {
      throw new Error("Fair not found");
    }

    setFair(JSON.parse(fairText));
  }, []);

  const handleCancelFair = useCallback(async () => {
    const actionUrl = new URL(CANCEL_URL);
    actionUrl.searchParams.append("event_id", params.fairId as string);
    actionUrl.searchParams.append("auth", await userContext.getAuthToken());
  
    try {
      const res = await fetch(actionUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reason: cancelReason }),
      });
  
      if (!res.ok) {
        const errorMessage = await res.text();
        throw new Error(errorMessage || "Something went wrong");
      }
  
      await getFair(params.fairId as string);
  
      setIsCancelModalOpen(false);
      setCancelReason("");
    } catch (error) {
      console.error("Error cancelling the fair:", error);
      alert("Failed to cancel the fair. Please try again.");
    }
  }, [cancelReason, params.fairId, userContext, getFair]);
  
  useEffect(() => {
    getFair(params.fairId as string).catch((reason) => {
      setError(reason);
    });

    return () => {
      setFair({} as FairData);
    }
  }, [params.fairId, getFair]);
  
  useEffect(() => {
    findUserInvitation().catch((reason) => {
      setError(reason);
    });
  }, [findUserInvitation]);

  if (error) {
    throw error;
  }

  const refreshFair = () => { getFair(params.fairId as string).catch(console.error); }

  return (
    <Flex direction="column" mih="100vh" className="overflow-y-clip">
      <Box className="flex-grow-0 flex-shrink-0">
        <Title p="xl" pb="0" order={1} className="text-blue-700 font-bold font-main">
          Fuar Bilgileri
        </Title>
        <Title pl="xl" order={3} className="text-gray-400 font-bold font-main">
          Kim, ne, nerede, ne zaman, nasıl?
        </Title>
        <Space h="xl"/>
        <Divider className="border-gray-400" />
        {
          isObjectEmpty(fair)
            ? <Text p="lg">Detaylar alınıyor...</Text>
            :
            <>
              <Space h="lg" />
              <StatusInformation fair={fair} refreshFair={refreshFair} />
              <Divider className="border-gray-300" />
              <Stack gap="0" className="bg-gray-50">
                <GeneralInformation fair={fair} refreshFair={refreshFair} />
                <Divider className="border-gray-200" />
                <ApplicantInformation fair={fair} refreshFair={refreshFair} />
                <Divider className="border-gray-200" />
                {
                  fair.status === FairStatus.CONFIRMED || fair.status === FairStatus.FINISHED
                  ?
                  <GuideInformation fair={fair} refreshFair={refreshFair} />
                  : null
                }
                <Divider className="border-gray-200" />
                <Group p="lg" align="center">
                {fair.status === FairStatus.RECEIVED && isCoordinator && (
                  <>
                    <Button color="green" onClick={handleAcceptFair}>
                      Fuara Katılmayı Kabul Et
                    </Button>
                    <Button color="red" onClick={handleRejectFair}>
                      Fuara Katılamayacağını Bildir
                    </Button>
                  </>
                )}
                {fair.status === FairStatus.CONFIRMED && isCoordinator && (
                  <Button color="orange" onClick={() => setIsCancelModalOpen(true)}>
                    Fuarı İptal Et
                  </Button>
                )}
                </Group>
                <Divider className="border-gray-200" />
              </Stack>
            </>
        }
      </Box>
      <Modal
        opened={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        title="Cancel Fair"
        centered
      >
        <Textarea
          label="Fuarı İptal Etme Sebebi"
          placeholder="Buraya başvurana ulaşacak fuarı iptal etme sebebini yazınız"
          value={cancelReason}
          onChange={(e) => setCancelReason(e.currentTarget.value)}
        />
        <Group align="right" mt="md">
          <Button variant="default" onClick={() => setIsCancelModalOpen(false)}>
           Kapat
          </Button>
          <Button
            color="orange"
            onClick={handleCancelFair}
            disabled={!cancelReason.trim()}
          >
            Gönder
          </Button>
        </Group>
      </Modal>
    </Flex>
  );
}

export default FairPage;