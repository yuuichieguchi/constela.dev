import { ExamplePage } from '@/components/examples';

const counterCode = `{
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
}`;

export default function CounterExamplePage() {
  return (
    <ExamplePage
      title="Counter"
      description="A basic counter example demonstrating state management with increment, decrement, and reset actions."
      code={counterCode}
      language="json"
      features={[
        'Number state',
        'Actions with steps',
        'Click event handlers',
        'State updates (increment, decrement, set)',
      ]}
      runCommands={[
        'npm install @constela/core @constela/runtime',
        'npx constela run counter.json',
      ]}
      playgroundUrl="/playground?example=counter"
    />
  );
}
