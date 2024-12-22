import React, { useContext, useState } from "react";
import { TourSectionProps } from "../../types/designed.ts";
import { Box, Button, Group, Space, Text } from "@mantine/core";
import { IconUserPlus, IconUsers } from "@tabler/icons-react";
import { UserContext } from "../../context/UserContext.tsx";
import {TourStatus, UserRole} from "../../types/enum.ts";
import ManageGuidesWindow from "./ManageGuidesWindow.tsx";
import {notifications} from "@mantine/notifications";

const VISITOR_PER_GUIDE = 60;

const ENROLL_URL = new URL(import.meta.env.VITE_BACKEND_API_ADDRESS + "/internal/tours/enroll");
const GuideInformation: React.FC<TourSectionProps> = (props: TourSectionProps) => {
  const userContext = useContext(UserContext);
  const [manageGuidesOpen, setManageGuidesOpen] = useState(false);

  const totalGuidesNeeded = Math.ceil(props.tour.visitor_count / VISITOR_PER_GUIDE);
  const missingGuides = totalGuidesNeeded - props.tour.guides.length;
  const userAssignedToTour = props.tour.guides.some((value) => value.id === userContext.user.id);

  const guideListText =
    props.tour.guides.length > 0
      ? props.tour.guides.map((value) => value.full_name).join(", ")
      : "Kimse";

  const guideListColor = props.tour.guides.length > 0 ? "dark" : "red";

  const enrollInTour = async () => {
    const enrollUrl = new URL(ENROLL_URL);

    enrollUrl.searchParams.append("auth", userContext.authToken);
    enrollUrl.searchParams.append("tid", props.tour.tour_id);

    try {
      const enrollRes = await fetch(enrollUrl, {
        method: "POST",
      });

      if (!enrollRes.ok) {
        notifications.show({
          color: "green",
          title: "İşlem başarılı.",
          message: "Başarıyla tura katıldınız."
        });
        props.refreshTour();
      }
      else {
        notifications.show({
          color: "red",
          title: "Hay aksi!",
          message: "Bir şeyler yanlış gitti. Tekrar deneyin veya site yöneticisine durumu haber edin."
        });
      }
    }
    catch (e) {
      console.error(e);
      notifications.show({
        color: "red",
        title: "Hay aksi!",
        message: "Bir şeyler yanlış gitti. Tekrar deneyin veya site yöneticisine durumu haber edin."
      });
    }
  }

  //TODO CHECK IF USER IS INVITED TO TOUR WITH DASHBOARD
  //// MOVE THAT STUFF OUTSIDE POSSBLY MAYBBE

  return (
    <>
      <Group p="lg" className="bg-gray-100" justify="space-between" align="flex-start">
        <Box>
          <Text size="md" fw={700}>
            Rehberler:
            <Text c={guideListColor} span>
              &nbsp;{guideListText}
            </Text>
          </Text>
          <Text size="md" fw={700}>
          {
            userAssignedToTour ? "Bu turda bir rehbersiniz." :
              (missingGuides > 0 ? `Bu tura rehber olabilirsiniz.` :
                "Bu turda rehber olmanız için yer yok.")
          }
          </Text>
          <Space h="sm" />
          {
            !userAssignedToTour && missingGuides > 0
              ?
              <Button size="md" leftSection={<IconUserPlus />} onClick={enrollInTour}>
                {
                  //TODO ADD WORKING ANIMATION TO ENROLL BUTTON
                }
                Rehber Ol
              </Button>
              : null
          }
        </Box>
        <Box>
          {userContext.user.role === UserRole.ADVISOR && props.tour.status === TourStatus.CONFIRMED && (
            <Button
              size="md"
              leftSection={<IconUsers />}
              onClick={() => setManageGuidesOpen(true)}
            >
              Rehberleri Yönet
            </Button>
          )}
        </Box>
      </Group>

      {/* Manage Guides Popup */}
      <ManageGuidesWindow
        opened={manageGuidesOpen}
        onClose={() => setManageGuidesOpen(false)}
        tour = {props.tour}
        totalGuidesNeeded={totalGuidesNeeded}
      />
    </>
  );
};

export default GuideInformation;
