import { ExamplePage } from '@/components/examples';

const todoListCode = `{
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
}`;

export default function TodoListExamplePage() {
  return (
    <ExamplePage
      title="Todo List"
      description="A todo list example demonstrating list state management, input binding, and iteration with the each loop."
      code={todoListCode}
      language="json"
      features={[
        'List state',
        'String state',
        'Input binding with onInput',
        'Each loop for iteration',
        'List operations (push, remove)',
        'Action payload passing',
      ]}
      runCommands={[
        'npm install @constela/core @constela/runtime',
        'npx constela run todo-list.json',
      ]}
      playgroundUrl="/playground?example=todo-list"
    />
  );
}
