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
import { UserContext } from '../../context/UserContext';
import { Link, To, useNavigate } from 'react-router-dom';
import { JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useContext } from 'react';
import { UserRole } from '../../types/enum';

type LinkType = {
  label: string;
  icon: React.ComponentType<Icon['props']>;
  link?: string;
  onClick?: () => void;
  subLinks?: { label: string; link: string }[];
};

export const Navbar: React.FC = () => {
  const { user } = useContext(UserContext);
  const userContext = useContext(UserContext);
  const [opened, { toggle }] = useDisclosure(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    userContext.setAuthToken('');
    navigate('/login'); // Redirect to login page after logout
  };

  const links: LinkType[] = [
    { label: 'Profile', icon: IconGauge, link: '/profile' },
    { label: 'Logout', icon: IconGauge, onClick: handleLogout },
    { label: 'All Tours', icon: IconGauge, link: '/tours' },
  ];

  // Add conditional links for DIRECTOR role
  if (user.role === UserRole.DIRECTOR) {
    //console.log(user.role);
    links.push({
      label: 'Analytics',
      icon: IconPresentationAnalytics,
      subLinks: [
        { label: 'Universities', link: '/universitieslist' },
        { label: 'Rivals', link: '/rivalslist' },
        { label: 'High Schools', link: '/highschoolslist' },
        { label: 'Bilkent Students', link: '/bilkentstudentdetails' },
        { label: 'Tour Statistics', link: '/tourstatistics' },
      ],
    });
    links.push({ label: 'All Fairs', icon: IconFileAnalytics, link: '#' });
    links.push({ label: 'Guide Applications', icon: IconGauge, link: '/toys-applications' });
  }
  else if (user.role === UserRole.COORDINATOR ) {
    links.push({ label: 'Admin Panel', icon: IconLock, link: '' });
  }
  else if (user.role === UserRole.ADVISOR ) {
    links.push({ label: 'Admin Panel', icon: IconLock, link: '' });
  }
  else if (user.role === UserRole.GUIDE ) {
    links.push({ label: 'Admin Panel', icon: IconLock, link: '' });
  }
  else if (user.role === UserRole.TRAINEE ) {
    links.push({ label: 'Admin Panel', icon: IconLock, link: '' });
  }
  console.log(user.role);

  return (
    <nav className={`${opened ? (classes.navbar + " " + classes.open) : classes.navbar}`}>
      <div className={classes.header}>
        <Group justify="space-between">
          {opened ? <Code fw={700}>TOYS</Code> : <></>}
          <Burger size="md" opened={opened} onClick={toggle}/>
        </Group>
      </div>

      <ScrollArea className={classes.links}>
      <div className={classes.linksInner}>
        {opened ? (
          links.map((link, index) => (
            <div key={index}>
              {/* Main Link */}
              {link.link ? (
                <Link to={link.link} className={classes.link}>
                  <link.icon size={20} />
                  {link.label}
                </Link>
              ) : (
                <button onClick={link.onClick} className={classes.link}>
                  <link.icon size={20} />
                  {link.label}
                </button>
              )}

              {/* Render subLinks if they exist */}
              {link.subLinks && (
                <div className={classes.subLinks}>
                  {link.subLinks.map((subLink: { link: To; label: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; }, subIndex: Key | null | undefined) => (
                    <Link key={subIndex} to={subLink.link} className={classes.sublink}>
                      {subLink.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))
        ) : (
          <></>
        )}
      </div>
    </ScrollArea>


      <div className={classes.footer}>
        {opened ? <UserButton/> : <></>}
      </div>

    </nav>
  );
}