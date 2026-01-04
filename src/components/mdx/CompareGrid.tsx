import type { ReactNode } from 'react';

interface CompareGridProps {
  children: ReactNode;
}

interface CompareColumnProps {
  title: string;
  children: ReactNode;
}

function CompareColumn({ title, children }: CompareColumnProps) {
  return (
    <div className="p-4 border border-border bg-muted/30 rounded-lg">
      <h3 className="font-semibold text-foreground mb-3">{title}</h3>
      <div className="text-sm text-muted-foreground">{children}</div>
    </div>
  );
}

function CompareGridComponent({ children }: CompareGridProps) {
  return (
    <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
      {children}
    </div>
  );
}

export const CompareGrid = Object.assign(CompareGridComponent, {
  Column: CompareColumn,
});
