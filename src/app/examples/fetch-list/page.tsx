import { ExamplePage } from '@/components/examples';

const fetchListCode = `{
  "version": "1.0",
  "state": {
    "users": { "type": "list", "initial": [] },
    "loading": { "type": "string", "initial": "idle" }
  },
  "actions": [
    {
      "name": "fetchUsers",
      "steps": [
        { "do": "set", "target": "loading", "value": { "expr": "lit", "value": "loading" } },
        {
          "do": "fetch",
          "url": { "expr": "lit", "value": "https://jsonplaceholder.typicode.com/users" },
          "method": "GET",
          "result": "data",
          "onSuccess": [
            { "do": "set", "target": "users", "value": { "expr": "var", "name": "data" } },
            { "do": "set", "target": "loading", "value": { "expr": "lit", "value": "done" } }
          ],
          "onError": [
            { "do": "set", "target": "loading", "value": { "expr": "lit", "value": "error" } }
          ]
        }
      ]
    }
  ],
  "view": {
    "kind": "element",
    "tag": "div",
    "children": [
      {
        "kind": "element",
        "tag": "h1",
        "children": [{ "kind": "text", "value": { "expr": "lit", "value": "Fetch Example" } }]
      },
      {
        "kind": "element",
        "tag": "button",
        "props": { "onClick": { "event": "click", "action": "fetchUsers" } },
        "children": [{ "kind": "text", "value": { "expr": "lit", "value": "Fetch Users" } }]
      },
      {
        "kind": "if",
        "condition": { "expr": "bin", "op": "==", "left": { "expr": "state", "name": "loading" }, "right": { "expr": "lit", "value": "loading" } },
        "then": {
          "kind": "element",
          "tag": "p",
          "children": [{ "kind": "text", "value": { "expr": "lit", "value": "Loading..." } }]
        }
      },
      {
        "kind": "element",
        "tag": "ul",
        "children": [
          {
            "kind": "each",
            "items": { "expr": "state", "name": "users" },
            "as": "user",
            "body": {
              "kind": "element",
              "tag": "li",
              "children": [
                { "kind": "text", "value": { "expr": "var", "name": "user", "path": "name" } }
              ]
            }
          }
        ]
      }
    ]
  }
}`;

export default function FetchListExamplePage() {
  return (
    <ExamplePage
      title="Fetch List"
      description="An example demonstrating how to fetch data from an API with loading states and error handling."
      code={fetchListCode}
      language="json"
      features={[
        'Fetch step for HTTP requests',
        'Loading state management',
        'onSuccess and onError handlers',
        'Conditional rendering with if',
        'Object property access with path',
        'Binary expressions for comparison',
      ]}
      runCommands={[
        'npm install @constela/core @constela/runtime',
        'npx constela run fetch-list.json',
      ]}
      playgroundUrl="/playground?example=fetch-list"
    />
  );
}
