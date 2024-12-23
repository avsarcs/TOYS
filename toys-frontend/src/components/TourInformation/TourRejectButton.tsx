import {Button} from "@mantine/core";
import {IconCircleX, IconLoader2} from "@tabler/icons-react";
import React, {useContext, useState} from "react";
import {UserContext} from "../../context/UserContext.tsx";
import {notifications} from "@mantine/notifications";
import {TourButtonProps} from "../../types/designed.ts";

const REJECT_URL = new URL(import.meta.env.VITE_BACKEND_API_ADDRESS + "/respond/application/tour");

const TourRejectButton: React.FC<TourButtonProps> = (props: TourButtonProps) => {
  const userContext = useContext(UserContext);
  const [working, setWorking] = useState(false);

  const setStatus = async () => {
    const rejectUrl = new URL(REJECT_URL);
    rejectUrl.searchParams.append("auth",  await userContext.getAuthToken());
    rejectUrl.searchParams.append("application_id", props.tour.tour_id);
    rejectUrl.searchParams.append("timeslot", "");

    try {
      const res = await fetch(rejectUrl, {
        method: "POST",
      });
      setWorking(true);

      if(res.ok) {
        notifications.show({
          color: "green",
          title: "İşlem başarılı.",
          message: "Tur reddedildi."
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
    } catch(e) {
      notifications.show({
        color: "red",
        title: "Hay aksi!",
        message: "Bir şeyler yanlış gitti. Tekrar deneyin veya site yöneticisine durumu haber edin."
      });
    }
    setWorking(false);
  }

  return (
    <Button className={working ? "brightness-75" : ""} size="md" leftSection={working ? <IconLoader2 /> : <IconCircleX/>} onClick={setStatus}>
      Reddet
    </Button>
  );
}

export default TourRejectButton;