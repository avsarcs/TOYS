import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Group, Code, ScrollArea, Burger } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconGauge,
  IconPresentationAnalytics,
  IconFileAnalytics,
  IconLock,
  IconUsers,
  IconUser,
  IconLogout,
  IconMap,
  IconBuildingCircus,
  IconUserUp,
  IconBrandSafari,
  IconCreditCard,
  IconLayoutDashboard,
  IconMessage

} from '@tabler/icons-react';
import { UserButton } from '../UserButton/UserButton';
import { UserContext } from '../../context/UserContext';
import classes from './Navbar.module.css';
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

  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const handleLogout = () => {
    userContext.setAuthToken('');
    navigate('/login');
  };

  const links: LinkType[] = [
    
  ];

  if (user.role === UserRole.DIRECTOR) {
    links.push({ label: 'Profil', icon: IconUser, link: '/profile' });
    links.push({ label: 'Çıkış Yapın', icon: IconLogout, onClick: handleLogout });
    links.push({ label: 'Tüm Turlar', icon: IconMap, link: '/tours' });
    links.push({ label: 'Tüm Fuarlar', icon: IconBuildingCircus, link: '/fairs' });
    links.push({ label: 'Rehber Başvuruları', icon: IconBrandSafari, link: '/toys-applications' });
    links.push({ label: 'Danışman Teklifleri', icon: IconUserUp, link: '/advisor-offers' });
    links.push({ label: 'Ödemeler', icon: IconCreditCard, link: '/guide-payments' });
    links.push({ label: 'Personel Yönetimi', icon: IconUsers, link: '/manage-personnel' });
    links.push({
      label: 'Veri Analizi',
      icon: IconPresentationAnalytics,
      subLinks: [
        { label: 'Üniversiteler Listesi', link: '/universitieslist' },
        { label: 'Rakip Üniversiteler', link: '/rivalslist' },
        { label: 'Üniversite Karşılaştırma', link: '/comparison' },
        { label: 'Liseler Listesi', link: '/highschoolslist' },
        { label: 'Bilkent Öğrenci Verisi', link: '/bilkentstudentdetails' },
        { label: 'Tur İstatistikleri', link: '/tourstatistics' },
      ],
    });
    links.push({ label: "İletişim", icon: IconMessage, link: '/contact' });
  }
  else if (user.role === UserRole.COORDINATOR) {
    links.push({ label: 'Profil', icon: IconUser, link: '/profile' });
    links.push({ label: 'Çıkış Yapın', icon: IconLogout, onClick: handleLogout });
    links.push({ label: 'Tüm Turlar', icon: IconMap, link: '/tours' });
    links.push({ label: 'Tüm Fuarlar', icon: IconBuildingCircus, link: '/fairs' });
    links.push({ label: 'Rehber Başvuruları', icon: IconBrandSafari, link: '/toys-applications' });
    links.push({ label: 'Danışman Teklifleri', icon: IconUserUp, link: '/advisor-offers' });
    links.push({ label: 'Ödemeler', icon: IconCreditCard, link: '/guide-payments' });
    links.push({ label: 'Personel Yönetimi', icon: IconUsers, link: '/manage-personnel' });
    links.push({ label: "İletişim", icon: IconMessage, link: '/contact' });
  }
  else if (user.role === UserRole.ADVISOR) {
    links.push({ label: 'Profil', icon: IconUser, link: '/profile' });
    links.push({ label: 'Çıkış Yapın', icon: IconLogout, onClick: handleLogout });
    links.push({ label: 'Tüm Turlar', icon: IconMap, link: '/tours' });
    links.push({ label: 'Pano', icon: IconLayoutDashboard, link: '/dashboard' });
    links.push({ label: 'Rehberler', icon: IconUsers, link: '/guides' });
    links.push({ label: "İletişim", icon: IconMessage, link: '/contact' });
  }
  else if (user.role === UserRole.GUIDE) {
    links.push({ label: 'Profil', icon: IconUser, link: '/profile' });
    links.push({ label: 'Çıkış Yapın', icon: IconLogout, onClick: handleLogout });
    links.push({ label: 'Tüm Turlar', icon: IconMap, link: '/tours' });
    links.push({ label: 'Pano', icon: IconLayoutDashboard, link: '/dashboard' });
    links.push({ label: "İletişim", icon: IconMessage, link: '/contact' });
  }
  else if (user.role === UserRole.TRAINEE) {
    links.push({ label: 'Profil', icon: IconUser, link: '/profile' });
    links.push({ label: 'Çıkış Yapın', icon: IconLogout, onClick: handleLogout });
    links.push({ label: 'Tüm Turlar', icon: IconMap, link: '/tours' });
    links.push({ label: 'Pano', icon: IconLayoutDashboard, link: '/dashboard' });
    links.push({ label: "İletişim", icon: IconMessage, link: '/contact' });
  }
  else {
    links.push({ label: "İletişim", icon: IconMessage, link: '/contact' });
  }

  const toggleSubMenu = (label: string) => {
    setActiveMenu(activeMenu === label ? null : label);
  };

  return (
    <nav className={`${opened ? `${classes.navbar} ${classes.open}` : classes.navbar}`}>
      <div className={classes.header}>
        <Group justify="space-between">
          {opened && (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <img src="/bilkent-tr-amblem.png" alt="Logo" style={{ marginRight: '10px', height: '40px' }} />
              <Code fw={700} style={{ fontSize: '24px' }}>TOYS</Code>
            </div>
          )}
          <Burger size="md" opened={opened} onClick={toggle} />
        </Group>
        <div className={classes.divider} />
      </div>
      {user.role !== UserRole.NONE && (
        <div className={classes.header} style={{ marginTop: '0', paddingTop: '20px', backgroundColor: '#e0f7ff' }}>
          {opened && <UserButton />}
          <div className={classes.divider} style={{ marginTop: '10px' }} />
        </div>
      )}  
      <ScrollArea className={classes.links}>
        <div className={classes.linksInner}>
          {opened &&
            links.map((link, index) => (
              <div key={index} className={classes.linkWrapper}>
                {/* Main Link */}
                {link.link ? (
                  <Link to={link.link} className={classes.link}>
                    <link.icon size={20} />
                    {link.label}
                  </Link>
                ) : (
                  <button
                  onClick={() => (link.subLinks ? toggleSubMenu(link.label) : link.onClick?.())}
                  className={classes.link}
                >
                  <link.icon size={20} />
                  {link.label}

                  {/* Add the arrow for parent links with sub-links */}
                  {link.subLinks && (
                    <span
                      className={`${classes.arrow} ${
                        activeMenu === link.label ? classes.arrowOpen : ""
                      }`}
                    >
                      &#9662; {/* Unicode down arrow */}
                    </span>
                  )}
                </button>
                )}

                {/* Sub-links */}
                {link.subLinks && (
                  <ul className={`${classes.subLinksWrapper} ${activeMenu === link.label ? classes.open : ''}`}>
                    {link.subLinks.map((subLink, subIndex) => (
                      <li key={subIndex} className={classes.subLinkItem}>
                        <Link to={subLink.link} className={classes.subLink}>
                          {subLink.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
        </div>
      </ScrollArea>

      
    </nav>
  );
};
