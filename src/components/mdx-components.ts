/**
 * MDX custom component definitions for mdxToConstela()
 *
 * This module defines ComponentDef structures for custom MDX components
 * that can be used with the Constela compiler.
 *
 * @module mdx-components
 */

import type { CompiledNode } from '@constela/compiler';

/**
 * ComponentDef interface - defines custom MDX components for mdxToConstela()
 */
export interface ComponentDef {
  params?: Record<string, { type: string; required?: boolean }>;
  view: CompiledNode;
}

/**
 * Callout component definition
 * Renders a callout box with type-based styling (note, warning, tip, important)
 */
export const calloutDef: ComponentDef = {
  params: {
    type: { type: 'string', required: false },
  },
  view: {
    kind: 'element',
    tag: 'div',
    props: {
      class: { expr: 'lit', value: 'border-l-4 pl-4 py-2 my-4' },
    },
    children: [
      {
        kind: 'element',
        tag: 'slot',
      },
    ],
  },
};

/**
 * PropsTable component definition
 * Renders a table displaying component props documentation
 */
export const propsTableDef: ComponentDef = {
  params: {
    items: { type: 'array', required: true },
  },
  view: {
    kind: 'element',
    tag: 'div',
    props: {
      class: { expr: 'lit', value: 'overflow-x-auto my-4' },
    },
    children: [
      {
        kind: 'element',
        tag: 'table',
        props: {
          class: { expr: 'lit', value: 'w-full text-sm' },
        },
        children: [
          {
            kind: 'element',
            tag: 'thead',
            children: [
              {
                kind: 'element',
                tag: 'tr',
                children: [
                  {
                    kind: 'element',
                    tag: 'th',
                    props: { class: { expr: 'lit', value: 'text-left p-2' } },
                    children: [{ kind: 'text', value: { expr: 'lit', value: 'Name' } }],
                  },
                  {
                    kind: 'element',
                    tag: 'th',
                    props: { class: { expr: 'lit', value: 'text-left p-2' } },
                    children: [{ kind: 'text', value: { expr: 'lit', value: 'Type' } }],
                  },
                  {
                    kind: 'element',
                    tag: 'th',
                    props: { class: { expr: 'lit', value: 'text-left p-2' } },
                    children: [{ kind: 'text', value: { expr: 'lit', value: 'Required' } }],
                  },
                  {
                    kind: 'element',
                    tag: 'th',
                    props: { class: { expr: 'lit', value: 'text-left p-2' } },
                    children: [{ kind: 'text', value: { expr: 'lit', value: 'Default' } }],
                  },
                  {
                    kind: 'element',
                    tag: 'th',
                    props: { class: { expr: 'lit', value: 'text-left p-2' } },
                    children: [{ kind: 'text', value: { expr: 'lit', value: 'Description' } }],
                  },
                ],
              },
            ],
          },
          {
            kind: 'element',
            tag: 'tbody',
          },
        ],
      },
    ],
  },
};

/**
 * CompareGrid component definition
 * Renders a responsive 2-column grid for comparison layouts
 */
export const compareGridDef: ComponentDef = {
  view: {
    kind: 'element',
    tag: 'div',
    props: {
      class: { expr: 'lit', value: 'grid grid-cols-1 md:grid-cols-2 gap-6 my-4' },
    },
    children: [
      {
        kind: 'element',
        tag: 'slot',
      },
    ],
  },
};

/**
 * CompareGrid.Column component definition
 * Renders a column within CompareGrid with title and content
 */
export const compareGridColumnDef: ComponentDef = {
  params: {
    title: { type: 'string', required: true },
  },
  view: {
    kind: 'element',
    tag: 'div',
    props: {
      class: { expr: 'lit', value: 'border rounded p-4' },
    },
    children: [
      {
        kind: 'element',
        tag: 'h3',
        props: {
          class: { expr: 'lit', value: 'font-semibold mb-2' },
        },
      },
      {
        kind: 'element',
        tag: 'slot',
      },
    ],
  },
};

/**
 * All MDX component definitions for use with mdxToConstela()
 */
export const mdxComponents: Record<string, ComponentDef> = {
  Callout: calloutDef,
  PropsTable: propsTableDef,
  CompareGrid: compareGridDef,
  'CompareGrid.Column': compareGridColumnDef,
};
