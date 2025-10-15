"use client";
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
  SidebarFooter,
  SidebarTrigger,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { toolCategories } from '@/lib/tools';
import { Home, NotebookText, ChevronsLeft } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { AdPlaceholder } from './ad-placeholder';
import { Button } from './ui/button';

export function SiteSidebar() {
  const pathname = usePathname();
  const { state: sidebarState, setOpenMobile, isMobile, toggleSidebar } = useSidebar();

  const isCollapsed = sidebarState === 'collapsed';

  const handleLinkClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex w-full items-center justify-between">
          <Link href="/" className="flex items-center gap-2" onClick={handleLinkClick}>
            <NotebookText className="size-6 text-primary" />
            <span className="font-headline text-xl font-semibold group-data-[collapsible=icon]:hidden">
              Modern Online Tools
            </span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 justify-start p-2 text-sidebar-foreground/70 group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:justify-center"
            onClick={toggleSidebar}
          >
            <ChevronsLeft className="size-5 shrink-0 transition-transform duration-200 group-data-[state=collapsed]:rotate-180" />
            <span className="sr-only">Toggle Sidebar</span>
          </Button>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Dashboard" isActive={pathname === '/'}>
              <Link href="/" onClick={handleLinkClick}>
                <Home />
                <span>Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          {toolCategories.map((category) =>
            isCollapsed ? (
              <SidebarMenuItem key={category.name}>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton tooltip={category.name}>
                      <category.icon />
                      <span className="sr-only">{category.name}</span>
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent side="right" align="start">
                    {category.tools.map((tool) => (
                      <DropdownMenuItem key={tool.href} asChild>
                        <Link href={tool.href}>{tool.title}</Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            ) : (
              <SidebarMenuItem key={category.name}>
                <SidebarMenuButton>
                  <category.icon />
                  <span className="truncate">{category.name}</span>
                </SidebarMenuButton>
                <div className="mx-3.5 flex flex-col items-start gap-1 border-l border-sidebar-border px-2.5 py-0.5">
                  {category.tools.map((tool) => (
                    <SidebarMenuButton
                      key={tool.href}
                      asChild
                      size="sm"
                      variant="ghost"
                      className="w-full justify-start"
                      isActive={pathname === tool.href}
                    >
                      <Link href={tool.href} onClick={handleLinkClick}>{tool.title}</Link>
                    </SidebarMenuButton>
                  ))}
                </div>
              </SidebarMenuItem>
            )
          )}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarSeparator />
        {!isCollapsed && (
          <div className="p-4 flex justify-center">
            <AdPlaceholder width={160} height={160} />
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
