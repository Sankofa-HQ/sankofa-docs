type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export function EndpointBadge({ method, path }: { method: Method; path: string }) {
  return (
    <div className="docs-endpoint">
      <span className="docs-endpoint-method" data-method={method}>
        {method}
      </span>
      <span className="docs-endpoint-path">{path}</span>
    </div>
  );
}
