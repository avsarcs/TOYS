import {Button, Card, Center, Image, Space, Stack, Text, Title} from "@mantine/core";
import {DashboardInfoBoxProps} from "../../types/designed.ts";
import React, {useMemo} from "react";
import {DashboardCategory, EventType, EventTypeText, TourType, TourTypeText} from "../../types/enum.ts";
import dayjs from "dayjs";
import {Link} from "react-router-dom";
import EventInvitationRespondButton from "./EventInvitationRespondButton.tsx";
import ManageGuidesButton from "./ManageGuidesButton.tsx";
import EventApplicationAcceptButton from "./EventApplicationAcceptButton.tsx";
import EventApplicationRejectButton from "./EventApplicationRejectButton.tsx";

const InfoBox: React.FC<DashboardInfoBoxProps> = (props: DashboardInfoBoxProps) => {
  const buttons = useMemo(() => {
    switch (props.category) {
      case DashboardCategory.EVENT_INVITATION:
        return (
          <>
            <EventInvitationRespondButton item={props.item} response={true} updateDashboard={props.updateDashboard} key="INVITATION_ACCEPT">
              Kabul Et
            </EventInvitationRespondButton>
            <EventInvitationRespondButton item={props.item} response={false} updateDashboard={props.updateDashboard} key="INVITATION_REJECT">
              Reddet
            </EventInvitationRespondButton>
          </>
        );
      case DashboardCategory.PENDING_APPLICATION:
        return (
          <>
            <EventApplicationAcceptButton item={props.item} updateDashboard={props.updateDashboard} key="APPLICATION_ACCEPT">
              Kabul Et
            </EventApplicationAcceptButton>
            <EventApplicationRejectButton item={props.item} updateDashboard={props.updateDashboard} key="APPLICATION_REJECT">
              Reddet
            </EventApplicationRejectButton>
          </>
        );
      case DashboardCategory.GUIDELESS:
        return (
          <ManageGuidesButton item={props.item} updateDashboard={props.updateDashboard} key="MANAGE_GUIDES_">
            Rehberleri Yönet
          </ManageGuidesButton>
        );
      default: return <></>
    }
  }, [props.item, props.category]);

  const icon = useMemo(() => {
    switch(props.item.event_type) {
      case EventType.TOUR:
        if(props.item.event_subtype === TourType.INDIVIDUAL) {
          return "individual_tour_icon.svg";
        }
        else if (props.item.event_subtype === TourType.GROUP) {
          return "group_tour_icon.svg";
        }
        else {
          return "";
        }
      case EventType.FAIR:
        return "fair_icon.svg";
      default: return "";
    }
  }, [props.item.event_type, props.item.event_subtype]);

  return (
    <Stack justify="flex-start" align="center">
      <Title order={2} fw={700} className="text-blue-700 font-main">
        Detaylı Bilgi
      </Title>
      <Card ta="center" p="xl" withBorder className="w-full bg-blue-200 rounded-xl">
        <Center>
          <Image
            w="auto"
            h="10rem"
            src={icon}
            fallbackSrc="https://placehold.co/600x400?text=Placeholder"
          />
        </Center>
        <Space h="sm"/>
        <Title order={3} fw={700} className="font-main">{ (TourTypeText[props.item.event_subtype]) || EventTypeText[props.item.event_type] }</Title>
        <Space h="sm"/>
        <Card.Section inheritPadding ta="start">
          <Text size="lg" className="text-gray-600 max-w-72 break-all break-words whitespace-break-spaces">
            <Text span fw={700} className="">Lise:</Text> {props.item.highschool.name}
          </Text>
          <Text size="lg" className="text-gray-600">
            <Text span fw={700}>Katılımcı Sayısı:</Text> {props.item.visitor_count}
          </Text>
          <Text size="lg" className="text-gray-600">
            <Text span fw={700}>Rehberler:</Text>
          </Text>
          {
            props.item.accepted_time.length === 0
              ?
              <>
                <Text span size="lg" className="text-gray-600" fw={700}>Zamanlar:</Text>
                {
                  props.item.requested_times.map((value, index) => {
                    const date = dayjs(value);
                    const dateEnd = date.add(1, "h");
                    return (
                      <Text size="md" fw={500} className="text-gray-600" key={index}>
                        &nbsp;{date.format("DD MMMM YYYY")} {date.format("HH:mm")}-{dateEnd.format("HH:mm")}
                      </Text>
                    );
                  })
                }
              </>
              :
              <>
              <Text size="lg" className="text-gray-600">
                <Text span fw={700}>Tarih:</Text> {dayjs(props.item.accepted_time).format('DD MMMM YYYY')}
              </Text>
              <Text size="lg" className="text-gray-600">
                <Text span fw={700}>Saat:</Text> &nbsp;{dayjs(props.item.accepted_time).format("HH.mm")}
              </Text>
              </>
          }
        </Card.Section>
        <Space h="sm"/>
        <Card.Section>
          <Stack gap="xs">
            {buttons}
            <Button size="lg" radius="md" fullWidth component={Link} key="GO_TO_EVENT"
                    to={`/${props.item.event_type.toLowerCase()}/${props.item.event_id}`}
                    className="text-center border-white bg-blue-600 border-2 outline outline-0
            hover:bg-blue-500 hover:border-blue-800 focus:border-blue-800focus:outline-blue-800 hover:outline-blue-800
            focus:outline-2 hover:outline-2 transition-colors duration-300">
              {EventTypeText[props.item.event_type]} Sayfasına Git
            </Button>
          </Stack>
        </Card.Section>
      </Card>
    </Stack>
  );
}

export default InfoBox;