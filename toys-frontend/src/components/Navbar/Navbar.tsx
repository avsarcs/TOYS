import { Group, Code, ScrollArea, Burger } from '@mantine/core';
import {
  IconNotes,
  IconCalendarStats,
  IconGauge,
  IconPresentationAnalytics,
  IconFileAnalytics,
  IconAdjustments,
  IconLock,
} from '@tabler/icons-react';
import { UserButton } from '../UserButton/UserButton';
import { LinksGroup } from './NavbarLinksGroup';
import { useDisclosure } from "@mantine/hooks";
import classes from './Navbar.module.css';

const mockdata = [
  { label: 'Dashboard', icon: IconGauge },
  {
    label: 'Market news',
    icon: IconNotes,
    initiallyOpened: true,
    links: [
      { label: 'Overview', link: '/' },
      { label: 'Forecasts', link: '/' },
      { label: 'Outlook', link: '/' },
      { label: 'Real time', link: '/' },
    ],
  },
  {
    label: 'Releases',
    icon: IconCalendarStats,
    links: [
      { label: 'Upcoming releases', link: '/' },
      { label: 'Previous releases', link: '/' },
      { label: 'Releases schedule', link: '/' },
    ],
  },
  {
    label: 'Üniversite Analizi',
    icon: IconPresentationAnalytics,
    links: [
      { label: 'Tüm Üniversiteler', link: '/universitieslist' },
      { label: 'Rakip Üniversiteler', link: '/' },
      { label: 'Üniversite Karşılaştırma', link: '/comparison' },
    ],
  },
  { label: 'Contracts', icon: IconFileAnalytics },
  { label: 'Settings', icon: IconAdjustments },
  {
    label: 'Security',
    icon: IconLock,
    links: [
      { label: 'Enable 2FA', link: '/' },
      { label: 'Change password', link: '/' },
      { label: 'Recovery codes', link: '/' },
    ],
  },
];

export function Navbar() {
  const [opened, { toggle }] = useDisclosure(false);

  const links = mockdata.map((item) => <LinksGroup {...item} key={item.label} />);

  return (
    <nav className={`${opened ? (classes.navbar + " " + classes.open) : classes.navbar}`}>
      <div className={classes.header}>
        <Group justify="space-between">
          {opened ? <Code fw={700}>TOYS</Code> : <></>}
          <Burger size="md" opened={opened} onClick={toggle}/>
        </Group>
      </div>

      <ScrollArea className={classes.links}>
        <div className={classes.linksInner}>{opened ? links : <></>}</div>
      </ScrollArea>

      <div className={classes.footer}>
        {opened ? <UserButton/> : <></>}
      </div>

    </nav>
  );
}