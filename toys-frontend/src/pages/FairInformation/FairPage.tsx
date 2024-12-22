import React, { useCallback, useContext, useEffect, useState } from "react";
import { Box, Divider, Flex, Space, Stack, Title, Text } from "@mantine/core";
import { useParams } from "react-router-dom";
import { FairData } from "../../types/data.ts";
import StatusInformation from "../../components/FairInformation/StatusInformation.tsx";
import GeneralInformation from "../../components/FairInformation/GeneralInformation.tsx";
import ApplicantInformation from "../../components/FairInformation/ApplicantInformation.tsx";
import GuideInformation from "../../components/FairInformation/GuideInformation.tsx";
import { UserContext } from "../../context/UserContext.tsx";
import { isObjectEmpty } from "../../lib/utils.tsx";
import {FairStatus} from "../../types/enum.ts";

const FAIR_URL = new URL(import.meta.env.VITE_BACKEND_API_ADDRESS + "/internal/event/fair");

const FairPage: React.FC = () => {
  const userContext = useContext(UserContext);
  const [error, setError] = useState<Error | undefined>(undefined);
  const params = useParams();

  const [fair, setFair] = useState<FairData>({} as FairData);

  if (!params.fairId) throw new Error("Fair ID is required");

  const getFair = useCallback(async (fairId: string) => {
    console.log(fairId);
    const fairUrl = new URL(FAIR_URL);
    fairUrl.searchParams.append("fid", fairId);
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

  useEffect(() => {
    getFair(params.fairId as string).catch((reason) => {
      setError(reason);
    });

    return () => {
      setFair({} as FairData);
    }
  }, [params.fairId, getFair]);

  if (error) {
    throw error;
  }

  const refreshFair = () => { getFair(params.fairId as string).catch(console.error); }
  console.log(fair);

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
                <Divider className="border-gray-200" />
              </Stack>
            </>
        }
      </Box>
    </Flex>
  );
}

export default FairPage;