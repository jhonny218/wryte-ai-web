import { useParams } from 'react-router-dom';
import { useLayout } from '@/context/layout-provider';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar';
import { AppTitle } from './app-title';
import { sidebarData } from './data/sidebar-data.ts';
import { NavGroup } from './nav-group.tsx';
import { NavUser } from './nav-user';
import { getOrgRoute } from '@/routes/routes';
import type { NavGroup as NavGroupType } from './types';

export function AppSidebar() {
  const { collapsible, variant } = useLayout();
  const { slug } = useParams<{ slug: string }>();

  // Transform sidebar data to include slug in URLs
  const navGroupsWithSlug: NavGroupType[] = sidebarData.navGroups.map((group) => ({
    ...group,
    items: group.items.map((item) => {
      if ('items' in item && item.items) {
        // Collapsible item with subitems
        return {
          title: item.title,
          badge: item.badge,
          icon: item.icon,
          items: item.items.map((subItem) => ({
            ...subItem,
            url: slug ? getOrgRoute(slug, subItem.url as string) : subItem.url,
          })),
        };
      }
      // Regular link item
      return {
        ...item,
        url: slug ? getOrgRoute(slug, item.url as string) : item.url,
      };
    }),
  }));

  return (
    <Sidebar collapsible={collapsible} variant={variant}>
      <SidebarHeader>
        <AppTitle />
      </SidebarHeader>
      <SidebarContent>
        {navGroupsWithSlug.map((props) => (
          <NavGroup key={props.title} {...props} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
