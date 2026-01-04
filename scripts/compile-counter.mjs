import { compile } from '@constela/compiler';
import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const counterDefinition = {
  version: '1.0',
  state: {
    count: { type: 'number', initial: 0 },
  },
  actions: [
    {
      name: 'increment',
      steps: [{ do: 'update', target: 'count', operation: 'increment' }],
    },
    {
      name: 'decrement',
      steps: [{ do: 'update', target: 'count', operation: 'decrement' }],
    },
  ],
  view: {
    kind: 'element',
    tag: 'div',
    props: {
      class: { expr: 'lit', value: 'flex flex-col items-center justify-center gap-6' },
    },
    children: [
      {
        kind: 'element',
        tag: 'div',
        props: {
          class: { expr: 'lit', value: 'text-6xl font-bold tabular-nums text-foreground' },
        },
        children: [{ kind: 'text', value: { expr: 'state', name: 'count' } }],
      },
      {
        kind: 'element',
        tag: 'div',
        props: {
          class: { expr: 'lit', value: 'flex gap-4' },
        },
        children: [
          {
            kind: 'element',
            tag: 'button',
            props: {
              class: {
                expr: 'lit',
                value: 'flex h-12 w-12 items-center justify-center rounded-lg border border-border text-xl font-semibold transition-colors hover:bg-muted',
              },
              onClick: { event: 'click', action: 'decrement' },
            },
            children: [{ kind: 'text', value: { expr: 'lit', value: '-' } }],
          },
          {
            kind: 'element',
            tag: 'button',
            props: {
              class: {
                expr: 'lit',
                value: 'flex h-12 w-12 items-center justify-center rounded-lg border border-border text-xl font-semibold transition-colors hover:bg-muted',
              },
              onClick: { event: 'click', action: 'increment' },
            },
            children: [{ kind: 'text', value: { expr: 'lit', value: '+' } }],
          },
        ],
      },
    ],
  },
};

const result = compile(counterDefinition);
if (result.ok) {
  const outputPath = join(__dirname, '../src/components/home/counter.compiled.json');
  writeFileSync(outputPath, JSON.stringify(result.program, null, 2));
  console.log('Compiled successfully to:', outputPath);
} else {
  console.error('Compile failed:', result.errors);
  process.exit(1);
}
