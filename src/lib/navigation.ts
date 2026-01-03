export interface NavItem {
  title: string;
  href: string;
  badge?: string;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

export const docsNavigation: NavSection[] = [
  {
    title: 'Get Started',
    items: [
      { title: 'Introduction', href: '/docs' },
      { title: 'Installation', href: '/docs/installation' },
      { title: 'Your First App', href: '/docs/first-app' },
      { title: 'State & Expressions', href: '/docs/state-expressions' },
      { title: 'Actions & Events', href: '/docs/actions-events' },
      { title: 'Fetch & Effects', href: '/docs/fetch-effects' },
      { title: 'Components', href: '/docs/components' },
      { title: 'Routing', href: '/docs/routing' },
      { title: 'Design Principles', href: '/docs/design-principles' },
    ],
  },
];

export const referenceNavigation: NavSection[] = [
  {
    title: 'Reference',
    items: [
      { title: 'DSL Root', href: '/reference' },
      { title: 'View Nodes', href: '/reference/nodes' },
      { title: 'Expressions', href: '/reference/expressions' },
      { title: 'Actions', href: '/reference/actions' },
      { title: 'Error Codes', href: '/reference/errors' },
      { title: 'Packages', href: '/reference/packages' },
    ],
  },
];

export const topNav = [
  { title: 'Docs', href: '/docs' },
  { title: 'Reference', href: '/reference' },
  { title: 'Examples', href: '/examples' },
  { title: 'Playground', href: '/playground' },
];

export function getPagination(
  currentPath: string,
  navigation: NavSection[]
): { prev?: NavItem; next?: NavItem } {
  const flatItems = navigation.flatMap((section) => section.items);
  const currentIndex = flatItems.findIndex((item) => item.href === currentPath);

  return {
    prev: currentIndex > 0 ? flatItems[currentIndex - 1] : undefined,
    next:
      currentIndex < flatItems.length - 1
        ? flatItems[currentIndex + 1]
        : undefined,
  };
}
