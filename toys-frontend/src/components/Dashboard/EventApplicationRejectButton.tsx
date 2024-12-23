import {DashboardInfoBoxButtonProps} from "../../types/designed.ts";
import React, {useContext, useState} from "react";
import {Button} from "@mantine/core";
import {IconCircleX, IconLoader2} from "@tabler/icons-react";
import {EventType} from "../../types/enum.ts";
import {notifications} from "@mantine/notifications";
import {UserContext} from "../../context/UserContext.tsx";

const TOUR_URL = new URL(import.meta.env.VITE_BACKEND_API_ADDRESS + "/respond/application/tour");
const FAIR_URL = new URL(import.meta.env.VITE_BACKEND_API_ADDRESS + "/respond/application/fair");
const EventApplicationRejectButton: React.FC<DashboardInfoBoxButtonProps> = (props: DashboardInfoBoxButtonProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const userContext = useContext(UserContext);

  const reject = async () => {
    setLoading(true);

    const rejectUrl = props.item.event_type === EventType.TOUR
      ? new URL(TOUR_URL)
      : new URL(FAIR_URL);

    rejectUrl.searchParams.append("auth", await userContext.getAuthToken());
    rejectUrl.searchParams.append("application_id", props.item.event_id);
    if(props.item.event_type === EventType.TOUR) {
      rejectUrl.searchParams.append("timeslot", "");
    }
    else {
      rejectUrl.searchParams.append("response", "false");
    }

    try {
      const rejectRes = await fetch(rejectUrl, {
        method: "POST",
      });
      if(rejectRes.ok) {
        notifications.show({
          color: "green",
          title: "İşlem başarılı!",
          message: "Başvuru reddedildi."
        });
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
    <Button size="lg"
            radius="md"
            fullWidth
            leftSection={loading ? <IconLoader2 className="animate-spin" /> : <IconCircleX />}
            onClick={reject}
            disabled={loading}
            className={`${loading ? "brightness-75" : ""} text-center border-white bg-blue-600 border-2 outline outline-0
              hover:bg-blue-500 hover:border-blue-800 focus:border-blue-800 focus:outline-blue-800 hover:outline-blue-800
              focus:outline-2 hover:outline-2 transition-colors duration-300`}>
      {props.children}
    </Button>
  )
}

export default EventApplicationRejectButton;