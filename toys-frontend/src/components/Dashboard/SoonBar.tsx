import {DashboardUrgentBarProps} from "../../types/designed.ts";
import {Button, Group, Text} from "@mantine/core";
import React, {useContext, useEffect, useMemo, useState} from "react";
import {IconAlertCircle} from "@tabler/icons-react";
import {UserContext} from "../../context/UserContext.tsx";
import {SimpleEventData} from "../../types/data.ts";
import {notifications} from "@mantine/notifications";
import {DashboardCategory, EventType, TourStatus} from "../../types/enum.ts";
import dayjs from "dayjs";
import {Link} from "react-router-dom";

const SOON_URL = new URL(import.meta.env.VITE_BACKEND_API_ADDRESS + "/internal/event/soon");
const TOUR_URL = new URL(import.meta.env.VITE_BACKEND_API_ADDRESS + "/internal/event/tour/");

const SoonBar: React.FC<DashboardUrgentBarProps> = (props: DashboardUrgentBarProps) => {
  const userContext =   useContext(UserContext);
  const [item, setItem] = useState<SimpleEventData | null>(null);

  const fetchSoon = async () => {
    const soonUrl = new URL(SOON_URL);
    soonUrl.searchParams.append("auth", await userContext.getAuthToken());

    try {
      const soonRes = await fetch(soonUrl, {
        method: "GET"
      });

      if(soonRes.ok) {
        const resObj = (await soonRes.json())[0];
        if(resObj !== undefined) {
          setItem(resObj);
        }
      }
      else {
        notifications.show({
          color: "red",
          title: "Hay aksi!",
          message: "Bir şeyler yanlış gitti. Sayfayı yenileyin veya site yöneticisine haber verin."
        });
      }
    } catch (e) {
      console.error(e);
      notifications.show({
        color: "red",
        title: "Hay aksi!",
        message: "Bir şeyler yanlış gitti. Sayfayı yenileyin veya site yöneticisine durumu haber edin."
      });
    }
  }

  const sendTourTimeRequest = async (endpoint: string) => {
    if(item === null) {
      return;
    }

    const tourStartUrl = new URL(TOUR_URL + endpoint);
    tourStartUrl.searchParams.append("auth", await userContext.getAuthToken());
    tourStartUrl.searchParams.append("tour_id", item.event_id);
    tourStartUrl.searchParams.append("timestamp", dayjs().toISOString());

    try {
      const res = await fetch(endpoint, {
        method: "POST",
      });

      if(res.ok) {
        notifications.show({
          color: "green",
          title: "İşlem başarılı.",
          message: item?.event_status === TourStatus.CONFIRMED
            ? "Tur başatıldı."
            : "Tur bitirildi."
        });
      }
      else {
        notifications.show({
          color: "red",
          title: "Hay aksi!",
          message: "Bir şeyler yanlış gitti. Tekrar deneyin veya site yöneticisine haber verin."
        });
      }

    } catch(e) {
      console.log(e);
      notifications.show({
        color: "red",
        title: "Hay aksi!",
        message: "Bir şeyler yanlış gitti. Tekrar deneyin veya site yöneticisine haber verin."
      });
    }
  }

  const buttons = useMemo(() => {
    if(item === null) return;

    switch (item.event_status) {
      case TourStatus.ONGOING:
        return (
          <Button onClick={() => sendTourTimeRequest("end-tour")}>
            Turu Bitir
          </Button>
        )
      case TourStatus.CONFIRMED:
        {
          const acceptedTime = dayjs(item.accepted_time);
          if(dayjs().isAfter(acceptedTime)) {
            return (
              <Button onClick={() => sendTourTimeRequest("start-tour")}>
                Turu Başlat
              </Button>
            )
          }
          else return null;
        }
      default: return null;
    }
  }, [item]);

  useEffect(() => {
    fetchSoon().catch(console.error);
  }, []);

  if(item === null) {
    return null;
  }

  return (
    <Group p="md" className="bg-gray-300 border border-black" justify="space-between">
      <Group>
        <IconAlertCircle size={36} /><Text span>Şu an devam eden bir turunuz var</Text>
      </Group>
      <Group gap="xs">
        <Group gap="xs">
          {buttons}
        </Group>
        <Button onClick={() => { props.setItem(item); props.setCategory(DashboardCategory.OWN_EVENT); }}>
          Göster
        </Button>
        <Button component={Link} to={`/${item.event_type.toLowerCase()}/${item.event_id}`}>
          {
            item.event_type === EventType.TOUR
              ? "Tura Git"
              : "Fuara Git"
          }
        </Button>
      </Group>
    </Group>
  );
}

export default SoonBar;