import {
  LayoutDashboard,
  Calendar,
  Heading,
  FileText,
  BookOpen,
  Building2,
  Target,
  HelpCircle,
} from 'lucide-react';
import type { SidebarData } from '../types.ts';

export const sidebarData: SidebarData = {
  user: {
    name: 'satnaing',
    email: 'satnaingdev@gmail.com',
    avatar: '/avatars/shadcn.jpg',
  },
  navGroups: [
    {
      title: 'General',
      items: [
        {
          title: 'Dashboard',
          url: 'dashboard',
          icon: LayoutDashboard,
        },
        {
          title: 'Calendar',
          url: 'calendar',
          icon: Calendar,
        },
        {
          title: 'Titles',
          url: 'titles',
          icon: Heading,
        },
      ],
    },
    {
      title: 'Content',
      items: [
        {
          title: 'Outlines',
          url: 'outlines',
          icon: FileText,
        },
        {
          title: 'Blogs',
          url: 'blogs',
          icon: BookOpen,
        },
      ],
    },
    {
      title: 'Settings',
      items: [
        {
          title: 'Content Strategy',
          url: 'settings/content-strategy',
          icon: Target,
        },
        {
          title: 'Organization',
          url: 'settings/organization',
          icon: Building2,
        },
      ],
    },
    {
      title: 'Other',
      items: [
        {
          title: 'Help Center',
          url: 'help-center',
          icon: HelpCircle,
        },
      ],
    },
  ],
};
