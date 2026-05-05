import type { ReactNode } from "react";

export function RequestResponse({
  request,
  response,
}: {
  request: ReactNode;
  response: ReactNode;
}) {
  return (
    <div className="docs-reqres">
      <div className="docs-reqres-pane">
        <div className="docs-reqres-pane-header">Request</div>
        {request}
      </div>
      <div className="docs-reqres-pane">
        <div className="docs-reqres-pane-header">Response</div>
        {response}
      </div>
    </div>
  );
}
