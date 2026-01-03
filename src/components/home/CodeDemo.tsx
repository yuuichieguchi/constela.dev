'use client';

import { useState, useCallback } from 'react';

const counterExample = `{
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
    }
  ],
  "view": {
    "kind": "element",
    "tag": "div",
    "children": [
      { "kind": "text", "value": { "expr": "state", "name": "count" } },
      {
        "kind": "element",
        "tag": "button",
        "props": { "onClick": { "event": "click", "action": "increment" } },
        "children": [{ "kind": "text", "value": { "expr": "lit", "value": "+" } }]
      },
      {
        "kind": "element",
        "tag": "button",
        "props": { "onClick": { "event": "click", "action": "decrement" } },
        "children": [{ "kind": "text", "value": { "expr": "lit", "value": "-" } }]
      }
    ]
  }
}`;

export function CodeDemo() {
  const [copied, setCopied] = useState(false);
  const [count, setCount] = useState(0);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(counterExample);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, []);

  return (
    <section className="px-6 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            See It in Action
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            A simple counter in Constela. Declarative state, typed actions, and
            reactive views in pure JSON.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Code Panel */}
          <div className="group relative overflow-hidden rounded-xl border border-border bg-muted">
            <div className="flex items-center justify-between border-b border-border px-4 py-2">
              <span className="text-sm font-medium text-muted-foreground">
                counter.constela.json
              </span>
              <button
                onClick={handleCopy}
                className="flex h-8 w-8 items-center justify-center rounded-md transition-colors hover:bg-background"
                aria-label={copied ? 'Copied!' : 'Copy code'}
              >
                {copied ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 text-green-500"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 text-muted-foreground"
                  >
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                )}
              </button>
            </div>
            <div className="max-h-[400px] overflow-auto p-4">
              <pre className="text-sm leading-relaxed">
                <code className="font-mono text-foreground">{counterExample}</code>
              </pre>
            </div>
          </div>

          {/* Preview Panel */}
          <div className="flex flex-col overflow-hidden rounded-xl border border-border bg-background">
            <div className="border-b border-border px-4 py-2">
              <span className="text-sm font-medium text-muted-foreground">
                Live Preview
              </span>
            </div>
            <div className="flex flex-1 flex-col items-center justify-center gap-6 p-8">
              <div className="text-6xl font-bold tabular-nums text-foreground">
                {count}
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => setCount((c) => c - 1)}
                  className="flex h-12 w-12 items-center justify-center rounded-lg border border-border text-xl font-semibold transition-colors hover:bg-muted"
                  aria-label="Decrement"
                >
                  -
                </button>
                <button
                  onClick={() => setCount((c) => c + 1)}
                  className="flex h-12 w-12 items-center justify-center rounded-lg border border-border text-xl font-semibold transition-colors hover:bg-muted"
                  aria-label="Increment"
                >
                  +
                </button>
              </div>
              <p className="text-center text-sm text-muted-foreground">
                This preview demonstrates the counter&apos;s behavior.<br />
                The actual Constela runtime compiles and renders the JSON above.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
