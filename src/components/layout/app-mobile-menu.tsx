import { useParams } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSidebar } from '@/components/ui/sidebar';
import { siteConfig } from '@/config/site';

export function AppMobileMenu() {
  const { toggleSidebar } = useSidebar();
  const params = useParams();
  const slug = params?.slug ?? '';

  return (
    <header className="flex h-14 items-center gap-4 border-b px-4 lg:hidden">
      <Button variant="ghost" size="icon" onClick={toggleSidebar} className="shrink-0">
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle Sidebar</span>
      </Button>
      <div className="flex-1">
        <div className="text-sm font-bold">{siteConfig.name}</div>
        {slug && <div className="text-muted-foreground text-xs">{slug}</div>}
      </div>
    </header>
  );
}
