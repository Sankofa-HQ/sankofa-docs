type ApiFieldRow = {
  name: string;
  type: string;
  required?: boolean;
  description: string;
};

export function ApiFieldTable({ rows }: { rows: ApiFieldRow[] }) {
  return (
    <div className="my-8 overflow-hidden rounded-[1.5rem] border border-slate-200">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
              Field
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
              Type
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
              Required
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
              Description
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 bg-white">
          {rows.map((row) => (
            <tr key={row.name}>
              <td className="px-4 py-4 align-top">
                <code className="rounded-md bg-slate-50 px-2 py-1 text-sm text-slate-950">
                  {row.name}
                </code>
              </td>
              <td className="px-4 py-4 align-top text-sm text-slate-600">
                {row.type}
              </td>
              <td className="px-4 py-4 align-top text-sm text-slate-600">
                {row.required ? "Yes" : "No"}
              </td>
              <td className="px-4 py-4 align-top text-sm leading-7 text-slate-600">
                {row.description}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
