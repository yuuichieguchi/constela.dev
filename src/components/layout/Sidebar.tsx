'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { NavSection } from '@/lib/navigation';

interface SidebarProps {
  navigation: NavSection[];
}

export function Sidebar({ navigation }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-[var(--header-height)] hidden h-[calc(100vh-var(--header-height))] w-[var(--sidebar-width)] overflow-y-auto border-r border-border bg-background p-6 lg:block">
      <nav className="space-y-6">
        {navigation.map((section) => (
          <div key={section.title}>
            <h3 className="mb-2 text-sm font-semibold text-foreground">
              {section.title}
            </h3>
            <ul className="space-y-1">
              {section.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`block rounded-md px-3 py-2 text-sm transition-colors ${
                        isActive
                          ? 'bg-primary/10 font-medium text-primary'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                      }`}
                    >
                      {item.title}
                      {item.badge && (
                        <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
