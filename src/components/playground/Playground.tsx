'use client';

import { useState, useCallback } from 'react';
import { validateAst, type ConstelaError } from '@constela/core';
import { compile, type CompiledProgram } from '@constela/compiler';
import { PlaygroundEditor } from './PlaygroundEditor';
import { PlaygroundPreview } from './PlaygroundPreview';
import { PlaygroundErrors } from './PlaygroundErrors';

const INITIAL_CODE = `{
  "version": "1.0",
  "state": {
    "count": { "type": "number", "initial": 0 }
  },
  "actions": [
    {
      "name": "increment",
      "steps": [{ "do": "update", "target": "count", "operation": "increment" }]
    },
    {
      "name": "decrement",
      "steps": [{ "do": "update", "target": "count", "operation": "decrement" }]
    }
  ],
  "view": {
    "kind": "element",
    "tag": "div",
    "props": { "style": { "expr": "lit", "value": "padding: 20px; font-family: sans-serif;" } },
    "children": [
      {
        "kind": "element",
        "tag": "h2",
        "children": [{ "kind": "text", "value": { "expr": "lit", "value": "Counter" } }]
      },
      {
        "kind": "element",
        "tag": "p",
        "props": { "style": { "expr": "lit", "value": "font-size: 2rem; font-weight: bold;" } },
        "children": [{ "kind": "text", "value": { "expr": "state", "name": "count" } }]
      },
      {
        "kind": "element",
        "tag": "div",
        "props": { "style": { "expr": "lit", "value": "display: flex; gap: 8px;" } },
        "children": [
          {
            "kind": "element",
            "tag": "button",
            "props": {
              "onClick": { "event": "click", "action": "decrement" },
              "style": { "expr": "lit", "value": "padding: 8px 16px; cursor: pointer;" }
            },
            "children": [{ "kind": "text", "value": { "expr": "lit", "value": "-" } }]
          },
          {
            "kind": "element",
            "tag": "button",
            "props": {
              "onClick": { "event": "click", "action": "increment" },
              "style": { "expr": "lit", "value": "padding: 8px 16px; cursor: pointer;" }
            },
            "children": [{ "kind": "text", "value": { "expr": "lit", "value": "+" } }]
          }
        ]
      }
    ]
  }
}`;

interface JsonParseError extends ConstelaError {
  code: 'SCHEMA_INVALID';
}

function createJsonParseError(message: string): JsonParseError {
  return {
    code: 'SCHEMA_INVALID',
    message,
    name: 'ConstelaError',
    path: undefined,
  } as JsonParseError;
}

export function Playground() {
  const [code, setCode] = useState(INITIAL_CODE);
  const [errors, setErrors] = useState<ConstelaError[]>([]);
  const [runtimeError, setRuntimeError] = useState<Error | null>(null);
  const [program, setProgram] = useState<CompiledProgram | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const handleValidate = useCallback(() => {
    setErrors([]);
    setRuntimeError(null);

    // Parse JSON
    let parsed: unknown;
    try {
      parsed = JSON.parse(code);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Invalid JSON';
      setErrors([createJsonParseError(`JSON Parse Error: ${message}`)]);
      return false;
    }

    // Validate AST
    const result = validateAst(parsed);
    if (!result.ok) {
      setErrors([result.error]);
      return false;
    }

    return true;
  }, [code]);

  const handleRun = useCallback(() => {
    setIsRunning(true);
    setErrors([]);
    setRuntimeError(null);
    setProgram(null);

    // Parse JSON
    let parsed: unknown;
    try {
      parsed = JSON.parse(code);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Invalid JSON';
      setErrors([createJsonParseError(`JSON Parse Error: ${message}`)]);
      setIsRunning(false);
      return;
    }

    // Compile
    const result = compile(parsed);
    if (!result.ok) {
      setErrors(result.errors);
      setIsRunning(false);
      return;
    }

    // Set program to trigger preview mount
    setProgram(result.program);
    setIsRunning(false);
  }, [code]);

  const handleRuntimeError = useCallback((error: Error) => {
    setRuntimeError(error);
  }, []);

  return (
    <div className="flex h-[calc(100vh-var(--header-height)-120px)] flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Playground</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={handleValidate}
            className="rounded-lg border border-border bg-muted px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted/80"
          >
            Validate
          </button>
          <button
            onClick={handleRun}
            disabled={isRunning}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
            {isRunning ? 'Running...' : 'Run'}
          </button>
        </div>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 lg:grid-cols-2">
        <PlaygroundEditor value={code} onChange={setCode} />
        <PlaygroundPreview program={program} onError={handleRuntimeError} />
      </div>

      {(errors.length > 0 || runtimeError) && (
        <PlaygroundErrors errors={errors} runtimeError={runtimeError} />
      )}
    </div>
  );
}
