import {Button} from "@mantine/core";
import {IconLoader2, IconUsers} from "@tabler/icons-react";
import React, {useContext, useState} from "react";
import { default as ManageTourGuides } from "../TourInformation/ManageGuidesWindow.tsx";
import { default as ManageFairGuides } from "../FairInformation/ManageGuidesWindow.tsx";
import {DashboardInfoBoxButtonProps} from "../../types/designed.ts";
import {EventType} from "../../types/enum.ts";
import {FairData, TourData} from "../../types/data.ts";
import {VISITOR_PER_GUIDE} from "../TourInformation/GuideInformation.tsx";
import {UserContext} from "../../context/UserContext.tsx";
import {notifications} from "@mantine/notifications";

const TOUR_URL = new URL(import.meta.env.VITE_BACKEND_API_ADDRESS + "/internal/event/tour");
const FAIR_URL = new URL(import.meta.env.VITE_BACKEND_API_ADDRESS + "/internal/event/fair");
const ManageGuidesButton: React.FC<DashboardInfoBoxButtonProps> = (props) => {
  const userContext = useContext(UserContext);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [eventData, setEventData] = useState<TourData | FairData | null>(null);

  const fetchEventData = async () => {
    setLoading(true);
    const eventUrl = props.item.event_type === EventType.TOUR
      ? new URL(TOUR_URL)
      : new URL(FAIR_URL);

    eventUrl.searchParams.append("auth", await userContext.getAuthToken());
    eventUrl.searchParams.append(`${props.item.event_type.toLowerCase()}_id`, props.item.event_id);

    try {
      const eventRes = await fetch(eventUrl, {
        method: "GET",
      });

      if(eventRes.ok) {
        setEventData(await eventRes.json());
      }
      else {
        notifications.show({
          color: "red",
          title: "Hay aksi!",
          message: "Bir şeyler yanlış gitti. Tekrar deneyin veya site yöneticisine durumu haber edin."
        });
      }

    } catch(e) {
      console.error(e);
      notifications.show({
        color: "red",
        title: "Hay aksi!",
        message: "Bir şeyler yanlış gitti. Tekrar deneyin veya site yöneticisine durumu haber edin."
      });
    }

    setLoading(false);
  }

  return (
    <>
      <Button size="lg"
              radius="md"
              fullWidth
              leftSection={loading ? <IconLoader2 className="animate-spin" /> : <IconUsers />}
              disabled={loading}
              onClick={() => fetchEventData().then(() => setIsOpen(true))}
              className={`${loading ? "brightness-75" : ""} text-center border-white bg-blue-600 border-2 outline outline-0
              hover:bg-blue-500 hover:border-blue-800 focus:border-blue-800 focus:outline-blue-800 hover:outline-blue-800
              focus:outline-2 hover:outline-2 transition-colors duration-300`}>
        {props.children}
      </Button>
      {
        eventData &&
        (
        props.item.event_type === EventType.TOUR
          ?
          <ManageTourGuides
            opened={isOpen}
            onClose={() => { setIsOpen(false); props.updateDashboard(); }}
            tour={eventData as TourData}
            totalGuidesNeeded={Math.ceil((eventData as TourData).visitor_count / VISITOR_PER_GUIDE)}
            refreshTour={() => {}}
          />
          :
          <ManageFairGuides
            opened={isOpen}
            onClose={() => { setIsOpen(false); props.updateDashboard() }}
            fair={eventData as FairData}
          />
        )
      }
    </>
  );
}

export default ManageGuidesButton;