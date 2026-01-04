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
    "props": { "style": { "expr": "lit", "value": "font-family: system-ui, sans-serif; padding: 16px;" } },
    "children": [
      {
        "kind": "element",
        "tag": "h1",
        "props": { "style": { "expr": "lit", "value": "margin: 0 0 8px 0; font-size: 24px;" } },
        "children": [{ "kind": "text", "value": { "expr": "lit", "value": "Counter" } }]
      },
      {
        "kind": "element",
        "tag": "p",
        "props": { "style": { "expr": "lit", "value": "color: #666; margin: 0 0 16px 0;" } },
        "children": [{ "kind": "text", "value": { "expr": "lit", "value": "A simple counter with increment, decrement, and reset." } }]
      },
      {
        "kind": "element",
        "tag": "div",
        "props": { "style": { "expr": "lit", "value": "font-size: 48px; font-weight: bold; text-align: center; padding: 24px; background: #f5f5f5; border-radius: 8px; margin-bottom: 16px; color: #333;" } },
        "children": [{ "kind": "text", "value": { "expr": "state", "name": "count" } }]
      },
      {
        "kind": "element",
        "tag": "div",
        "props": { "style": { "expr": "lit", "value": "display: flex; gap: 8px; justify-content: center;" } },
        "children": [
          {
            "kind": "element",
            "tag": "button",
            "props": {
              "style": { "expr": "lit", "value": "width: 48px; height: 48px; font-size: 24px; background: #0070f3; color: white; border: none; border-radius: 50%; cursor: pointer;" },
              "onClick": { "event": "click", "action": "decrement" }
            },
            "children": [{ "kind": "text", "value": { "expr": "lit", "value": "-" } }]
          },
          {
            "kind": "element",
            "tag": "button",
            "props": {
              "style": { "expr": "lit", "value": "width: 48px; height: 48px; font-size: 24px; background: #0070f3; color: white; border: none; border-radius: 50%; cursor: pointer;" },
              "onClick": { "event": "click", "action": "increment" }
            },
            "children": [{ "kind": "text", "value": { "expr": "lit", "value": "+" } }]
          },
          {
            "kind": "element",
            "tag": "button",
            "props": {
              "style": { "expr": "lit", "value": "padding: 12px 24px; font-size: 14px; background: #666; color: white; border: none; border-radius: 4px; cursor: pointer;" },
              "onClick": { "event": "click", "action": "reset" }
            },
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
    "props": { "style": { "expr": "lit", "value": "font-family: system-ui, sans-serif; padding: 16px;" } },
    "children": [
      {
        "kind": "element",
        "tag": "h1",
        "props": { "style": { "expr": "lit", "value": "margin: 0 0 8px 0; font-size: 24px;" } },
        "children": [{ "kind": "text", "value": { "expr": "lit", "value": "Todo List" } }]
      },
      {
        "kind": "element",
        "tag": "p",
        "props": { "style": { "expr": "lit", "value": "color: #666; margin: 0 0 16px 0;" } },
        "children": [{ "kind": "text", "value": { "expr": "lit", "value": "Add items and manage your todo list." } }]
      },
      {
        "kind": "element",
        "tag": "div",
        "props": { "style": { "expr": "lit", "value": "display: flex; gap: 8px; margin-bottom: 16px;" } },
        "children": [
          {
            "kind": "element",
            "tag": "input",
            "props": {
              "type": { "expr": "lit", "value": "text" },
              "style": { "expr": "lit", "value": "flex: 1; padding: 8px 12px; border: 1px solid #ccc; border-radius: 4px; font-size: 14px; color: #333; background: white;" },
              "value": { "expr": "state", "name": "newTodo" },
              "onInput": { "event": "input", "action": "setNewTodo", "payload": { "expr": "var", "name": "value" } }
            }
          },
          {
            "kind": "element",
            "tag": "button",
            "props": {
              "style": { "expr": "cond", "if": { "expr": "bin", "op": "==", "left": { "expr": "state", "name": "newTodo" }, "right": { "expr": "lit", "value": "" } }, "then": { "expr": "lit", "value": "padding: 8px 16px; background: #ccc; color: #666; border: none; border-radius: 4px; cursor: not-allowed; font-size: 14px;" }, "else": { "expr": "lit", "value": "padding: 8px 16px; background: #0070f3; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px;" } },
              "disabled": { "expr": "bin", "op": "==", "left": { "expr": "state", "name": "newTodo" }, "right": { "expr": "lit", "value": "" } },
              "onClick": { "event": "click", "action": "addTodo" }
            },
            "children": [{ "kind": "text", "value": { "expr": "lit", "value": "Add" } }]
          }
        ]
      },
      {
        "kind": "element",
        "tag": "ul",
        "props": { "style": { "expr": "lit", "value": "list-style: none; padding: 0; margin: 0;" } },
        "children": [
          {
            "kind": "each",
            "items": { "expr": "state", "name": "todos" },
            "as": "item",
            "body": {
              "kind": "element",
              "tag": "li",
              "props": { "style": { "expr": "lit", "value": "display: flex; align-items: center; justify-content: space-between; padding: 12px; margin-bottom: 8px; background: #f5f5f5; border-radius: 4px;" } },
              "children": [
                {
                  "kind": "element",
                  "tag": "span",
                  "props": { "style": { "expr": "lit", "value": "color: #333;" } },
                  "children": [{ "kind": "text", "value": { "expr": "var", "name": "item" } }]
                },
                {
                  "kind": "element",
                  "tag": "button",
                  "props": {
                    "style": { "expr": "lit", "value": "padding: 4px 12px; background: #dc2626; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;" },
                    "onClick": { "event": "click", "action": "removeTodo", "payload": { "expr": "var", "name": "item" } }
                  },
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
    "props": { "style": { "expr": "lit", "value": "font-family: system-ui, sans-serif; padding: 16px;" } },
    "children": [
      {
        "kind": "element",
        "tag": "h1",
        "props": { "style": { "expr": "lit", "value": "margin: 0 0 8px 0; font-size: 24px;" } },
        "children": [{ "kind": "text", "value": { "expr": "lit", "value": "API Data Fetching" } }]
      },
      {
        "kind": "element",
        "tag": "p",
        "props": { "style": { "expr": "lit", "value": "color: #666; margin: 0 0 16px 0;" } },
        "children": [{ "kind": "text", "value": { "expr": "lit", "value": "Click the button to fetch user data from JSONPlaceholder API." } }]
      },
      {
        "kind": "element",
        "tag": "button",
        "props": {
          "style": { "expr": "lit", "value": "padding: 8px 16px; background: #0070f3; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px;" },
          "onClick": { "event": "click", "action": "fetchUsers" }
        },
        "children": [{ "kind": "text", "value": { "expr": "lit", "value": "Fetch Users" } }]
      },
      {
        "kind": "if",
        "condition": { "expr": "bin", "op": "==", "left": { "expr": "state", "name": "loading" }, "right": { "expr": "lit", "value": "loading" } },
        "then": {
          "kind": "element",
          "tag": "p",
          "props": { "style": { "expr": "lit", "value": "margin-top: 16px; color: #666;" } },
          "children": [{ "kind": "text", "value": { "expr": "lit", "value": "Loading..." } }]
        }
      },
      {
        "kind": "if",
        "condition": { "expr": "bin", "op": "==", "left": { "expr": "state", "name": "loading" }, "right": { "expr": "lit", "value": "error" } },
        "then": {
          "kind": "element",
          "tag": "p",
          "props": { "style": { "expr": "lit", "value": "margin-top: 16px; color: #dc2626;" } },
          "children": [{ "kind": "text", "value": { "expr": "lit", "value": "Failed to fetch data." } }]
        }
      },
      {
        "kind": "element",
        "tag": "ul",
        "props": { "style": { "expr": "lit", "value": "list-style: none; padding: 0; margin-top: 16px;" } },
        "children": [
          {
            "kind": "each",
            "items": { "expr": "state", "name": "users" },
            "as": "user",
            "body": {
              "kind": "element",
              "tag": "li",
              "props": { "style": { "expr": "lit", "value": "padding: 12px; margin-bottom: 8px; background: #f5f5f5; border-radius: 4px;" } },
              "children": [
                {
                  "kind": "element",
                  "tag": "div",
                  "props": { "style": { "expr": "lit", "value": "font-weight: bold; color: #333;" } },
                  "children": [{ "kind": "text", "value": { "expr": "var", "name": "user", "path": "name" } }]
                },
                {
                  "kind": "element",
                  "tag": "div",
                  "props": { "style": { "expr": "lit", "value": "color: #666; font-size: 14px;" } },
                  "children": [{ "kind": "text", "value": { "expr": "var", "name": "user", "path": "email" } }]
                }
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
