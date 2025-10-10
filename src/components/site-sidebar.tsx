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
import { Home, NotebookText } from 'lucide-react';
import { usePathname } from 'next/navigation';

export function SiteSidebar() {
  const pathname = usePathname();
  const { state: sidebarState } = useSidebar();

  const isCollapsed = sidebarState === 'collapsed';

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <Link href="/" className="flex items-center gap-2">
          <NotebookText className="size-6 text-primary" />
          <span className="font-headline text-xl font-semibold group-data-[collapsible=icon]:hidden">
            Toolbox Titan
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Dashboard" isActive={pathname === '/'}>
              <Link href="/">
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
                      <Link href={tool.href}>{tool.title}</Link>
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
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarTrigger className="hidden md:flex" />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
