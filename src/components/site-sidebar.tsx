"use client";
import Link from 'next/link';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubButton,
} from '@/components/ui/sidebar';
import { toolCategories } from '@/lib/tools';
import { ChevronRight, Home, NotebookText } from 'lucide-react';
import { usePathname } from 'next/navigation';

export function SiteSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader>
        <Link href="/" className="flex items-center gap-2">
          <NotebookText className="size-6 text-primary" />
          <h1 className="font-headline text-xl font-semibold">Toolbox Titan</h1>
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
          {toolCategories.map((category) => (
            <Collapsible key={category.name} asChild>
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton>
                    <category.icon />
                    <span className="truncate">{category.name}</span>
                    <ChevronRight className="ml-auto h-4 w-4 shrink-0 transition-transform duration-200 data-[state=open]:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent asChild>
                  <SidebarMenuSub>
                    {category.tools.map((tool) => (
                      <li key={tool.href}>
                        <SidebarMenuSubButton asChild isActive={pathname === tool.href}>
                          <Link href={tool.href}>{tool.title}</Link>
                        </SidebarMenuSubButton>
                      </li>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
