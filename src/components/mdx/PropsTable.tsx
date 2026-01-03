interface PropItem {
  name: string;
  type: string;
  required?: boolean;
  default?: string;
  description: string;
}

interface PropsTableProps {
  items: PropItem[];
}

export function PropsTable({ items }: PropsTableProps) {
  return (
    <div className="my-6 overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="py-3 pr-4 text-left font-semibold text-foreground">
              Name
            </th>
            <th className="py-3 pr-4 text-left font-semibold text-foreground">
              Type
            </th>
            <th className="py-3 pr-4 text-left font-semibold text-foreground">
              Required
            </th>
            <th className="py-3 pr-4 text-left font-semibold text-foreground">
              Default
            </th>
            <th className="py-3 text-left font-semibold text-foreground">
              Description
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.name} className="border-b border-border/50">
              <td className="py-3 pr-4">
                <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm text-foreground">
                  {item.name}
                </code>
              </td>
              <td className="py-3 pr-4">
                <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm text-primary">
                  {item.type}
                </code>
              </td>
              <td className="py-3 pr-4">
                {item.required ? (
                  <span className="inline-flex items-center rounded-full bg-red-500/10 px-2 py-0.5 text-xs font-medium text-red-500">
                    Required
                  </span>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </td>
              <td className="py-3 pr-4">
                {item.default ? (
                  <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm text-muted-foreground">
                    {item.default}
                  </code>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </td>
              <td className="py-3 text-muted-foreground">{item.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
