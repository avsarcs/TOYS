import {Button} from "@mantine/core";
import {IconCircleX, IconLoader2} from "@tabler/icons-react";
import React, {useContext, useState} from "react";
import {UserContext} from "../../context/UserContext.tsx";
import {notifications} from "@mantine/notifications";
import {TourButtonProps} from "../../types/designed.ts";

const CANCEL_URL = new URL(import.meta.env.VITE_BACKEND_API_ADDRESS + "/apply/cancel");

const TourCancelButton: React.FC<TourButtonProps> = (props: TourButtonProps) => {
  const userContext = useContext(UserContext);
  const [working, setWorking] = useState(false);

  const setStatus = async () => {
    const cancelUrl = new URL(CANCEL_URL);
    cancelUrl.searchParams.append("auth", userContext.authToken);
    cancelUrl.searchParams.append("event_id", props.tour.tour_id);

    try {
      const res = await fetch(cancelUrl, {
        method: "POST",
        headers: new Headers({"Content-Type": "application/json"}),
        body: `{ reason: "balls" }`
      });
      setWorking(true);

      if(res.ok) {
        notifications.show({
          color: "green",
          title: "İşlem başarılı.",
          message: "Tur iptal edildi."
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
    <Button className={working ? "brightness-75" : ""} disabled={working} size="md" leftSection={working ? <IconLoader2 /> : <IconCircleX/>} onClick={setStatus}>
      İptal Et
    </Button>
  );
}

export default TourCancelButton;