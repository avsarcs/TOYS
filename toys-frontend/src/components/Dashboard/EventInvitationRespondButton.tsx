import {EventInvitationRespondButtonProps} from "../../types/designed.ts";
import React, {useContext, useState} from "react";
import {Button} from "@mantine/core";
import {IconCircleCheck, IconCircleX, IconLoader2} from "@tabler/icons-react";
import {notifications} from "@mantine/notifications";
import {UserContext} from "../../context/UserContext.tsx";


const RESPOND_URL = new URL(import.meta.env.VITE_BACKEND_API_ADDRESS + "/respond/guide/tour-invite")
const EventInvitationRespondButton: React.FC<EventInvitationRespondButtonProps> = (props: EventInvitationRespondButtonProps) => {
  const userContext = useContext(UserContext);
  const [loading, setLoading] = useState(false);

  const onClick = async () => {
      setLoading(true);
      const acceptUrl = new URL(RESPOND_URL);

      acceptUrl.searchParams.append("auth", await userContext.getAuthToken());
      acceptUrl.searchParams.append("request_id", props.item.event_id);
      acceptUrl.searchParams.append("response", props.response.toString());

    try {
      const respondRes = await fetch(acceptUrl, {
        method: "POST"
      });

      if(respondRes.ok) {
        notifications.show({
          color: "green",
          title: "İşlem başarılı!",
          message: "Davet kabul edildi."
        });
        props.updateDashboard();
      }
      else {
        notifications.show({
          color: "red",
          title: "Hay aksi!",
          message: "Bir şeyler yanlış gitti. Tekrar deneyin veya site yöneticisine haber verin."
        });
      }
    }
    catch(e) {
      console.error(e);

      notifications.show({
        color: "red",
        title: "Hay aksi!",
        message: "Bir şeyler yanlış gitti. Tekrar deneyin veya site yöneticisine haber verin."
      });
    }
    setLoading(false);
  }

  return (
    <Button size="lg"
            radius="md"
            fullWidth
            leftSection={loading ? <IconLoader2 className="animate-spin" /> :
              props.response ? <IconCircleCheck /> : <IconCircleX />}
            onClick={onClick}
            disabled={loading}
            className={`${loading ? "brightness-75" : ""} text-center border-white bg-blue-600 border-2 outline outline-0
              hover:bg-blue-500 hover:border-blue-800 focus:border-blue-800 focus:outline-blue-800 hover:outline-blue-800
              focus:outline-2 hover:outline-2 transition-colors duration-300`}>
      {props.children}
    </Button>
  );
}

export default EventInvitationRespondButton;