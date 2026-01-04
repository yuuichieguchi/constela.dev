'use client';

import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

const Playground = dynamic(
  () => import('@/components/playground').then((mod) => mod.Playground),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[calc(100vh-var(--header-height)-120px)] items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto" />
          <p className="text-sm text-muted-foreground">Loading editor...</p>
        </div>
      </div>
    ),
  }
);

const EXAMPLE_CODES: Record<string, string> = {
  counter: `{
  "version": "1.0",
  "state": {
    "count": { "type": "number", "initial": 0 }
  },
  "actions": [
    {
      "name": "increment",
      "steps": [
        { "do": "update", "target": "count", "operation": "increment" }
      ]
    },
    {
      "name": "decrement",
      "steps": [
        { "do": "update", "target": "count", "operation": "decrement" }
      ]
    },
    {
      "name": "reset",
      "steps": [
        { "do": "set", "target": "count", "value": { "expr": "lit", "value": 0 } }
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
        "children": [
          { "kind": "text", "value": { "expr": "lit", "value": "Counter" } }
        ]
      },
      {
        "kind": "element",
        "tag": "div",
        "children": [
          { "kind": "text", "value": { "expr": "state", "name": "count" } }
        ]
      },
      {
        "kind": "element",
        "tag": "div",
        "children": [
          {
            "kind": "element",
            "tag": "button",
            "props": { "onClick": { "event": "click", "action": "decrement" } },
            "children": [{ "kind": "text", "value": { "expr": "lit", "value": "-" } }]
          },
          {
            "kind": "element",
            "tag": "button",
            "props": { "onClick": { "event": "click", "action": "increment" } },
            "children": [{ "kind": "text", "value": { "expr": "lit", "value": "+" } }]
          },
          {
            "kind": "element",
            "tag": "button",
            "props": { "onClick": { "event": "click", "action": "reset" } },
            "children": [{ "kind": "text", "value": { "expr": "lit", "value": "Reset" } }]
          }
        ]
      }
    ]
  }
}`,
  'todo-list': `{
  "version": "1.0",
  "state": {
    "todos": { "type": "list", "initial": [] },
    "newTodo": { "type": "string", "initial": "" }
  },
  "actions": [
    {
      "name": "setNewTodo",
      "steps": [
        { "do": "set", "target": "newTodo", "value": { "expr": "var", "name": "value" } }
      ]
    },
    {
      "name": "addTodo",
      "steps": [
        { "do": "update", "target": "todos", "operation": "push", "value": { "expr": "state", "name": "newTodo" } },
        { "do": "set", "target": "newTodo", "value": { "expr": "lit", "value": "" } }
      ]
    },
    {
      "name": "removeTodo",
      "steps": [
        { "do": "update", "target": "todos", "operation": "remove", "value": { "expr": "var", "name": "item" } }
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
        "children": [{ "kind": "text", "value": { "expr": "lit", "value": "Todo List" } }]
      },
      {
        "kind": "element",
        "tag": "div",
        "children": [
          {
            "kind": "element",
            "tag": "input",
            "props": {
              "type": { "expr": "lit", "value": "text" },
              "value": { "expr": "state", "name": "newTodo" },
              "onInput": { "event": "input", "action": "setNewTodo", "payload": { "expr": "var", "name": "value" } }
            }
          },
          {
            "kind": "element",
            "tag": "button",
            "props": { "onClick": { "event": "click", "action": "addTodo" } },
            "children": [{ "kind": "text", "value": { "expr": "lit", "value": "Add" } }]
          }
        ]
      },
      {
        "kind": "element",
        "tag": "ul",
        "children": [
          {
            "kind": "each",
            "items": { "expr": "state", "name": "todos" },
            "as": "item",
            "body": {
              "kind": "element",
              "tag": "li",
              "children": [
                { "kind": "text", "value": { "expr": "var", "name": "item" } },
                {
                  "kind": "element",
                  "tag": "button",
                  "props": { "onClick": { "event": "click", "action": "removeTodo", "payload": { "expr": "var", "name": "item" } } },
                  "children": [{ "kind": "text", "value": { "expr": "lit", "value": "Delete" } }]
                }
              ]
            }
          }
        ]
      }
    ]
  }
}`,
  'fetch-list': `{
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
}`,
};

function PlaygroundWithParams() {
  const searchParams = useSearchParams();
  const example = searchParams.get('example');
  const initialCode = example && EXAMPLE_CODES[example] ? EXAMPLE_CODES[example] : undefined;

  return <Playground initialCode={initialCode} />;
}

export function PlaygroundWrapper() {
  return (
    <Suspense
      fallback={
        <div className="flex h-[calc(100vh-var(--header-height)-120px)] items-center justify-center">
          <div className="text-center">
            <div className="mb-4 h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto" />
            <p className="text-sm text-muted-foreground">Loading editor...</p>
          </div>
        </div>
      }
    >
      <PlaygroundWithParams />
    </Suspense>
  );
}
