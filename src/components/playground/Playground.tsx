'use client';

import { useState, useCallback } from 'react';
import { validateAst, type ConstelaError } from '@constela/core';
import { compile, type CompiledProgram } from '@constela/compiler';
import { PlaygroundEditor } from './PlaygroundEditor';
import { PlaygroundPreview } from './PlaygroundPreview';
import { PlaygroundErrors } from './PlaygroundErrors';
import { PlaygroundSuccess } from './PlaygroundSuccess';
import { DEFAULT_CODE } from './example-codes';

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

interface PlaygroundProps {
  initialCode?: string;
}

export function Playground({ initialCode }: PlaygroundProps) {
  const [code, setCode] = useState(initialCode ?? DEFAULT_CODE);
  const [errors, setErrors] = useState<ConstelaError[]>([]);
  const [runtimeError, setRuntimeError] = useState<Error | null>(null);
  const [program, setProgram] = useState<CompiledProgram | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [validationSuccess, setValidationSuccess] = useState(false);

  const handleValidate = useCallback(() => {
    setErrors([]);
    setRuntimeError(null);
    setValidationSuccess(false);

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

    setValidationSuccess(true);
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

  const handleCodeChange = useCallback((newCode: string) => {
    setCode(newCode);
    setValidationSuccess(false);
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
        <PlaygroundEditor value={code} onChange={handleCodeChange} />
        <PlaygroundPreview program={program} onError={handleRuntimeError} />
      </div>

      {(errors.length > 0 || runtimeError) && (
        <PlaygroundErrors errors={errors} runtimeError={runtimeError} />
      )}

      <PlaygroundSuccess show={validationSuccess && errors.length === 0 && !runtimeError} />
    </div>
  );
}
