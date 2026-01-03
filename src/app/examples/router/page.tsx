import { ExamplePage } from '@/components/examples';

const routerCode = `import { createApp } from '@constela/core';
import { createRouter, Link, Outlet } from '@constela/router';

// Define routes
const router = createRouter({
  routes: [
    {
      path: '/',
      component: 'Home',
    },
    {
      path: '/about',
      component: 'About',
    },
    {
      path: '/users',
      component: 'Users',
      children: [
        {
          path: ':id',
          component: 'UserDetail',
        },
      ],
    },
  ],
});

// Define components for each route
const components = {
  Home: {
    view: {
      kind: 'element',
      tag: 'div',
      children: [
        { kind: 'element', tag: 'h1', children: [{ kind: 'text', value: { expr: 'lit', value: 'Home' } }] },
        { kind: 'element', tag: 'nav', children: [
          { kind: 'component', name: 'Link', props: { to: '/about' }, children: [{ kind: 'text', value: { expr: 'lit', value: 'About' } }] },
          { kind: 'component', name: 'Link', props: { to: '/users' }, children: [{ kind: 'text', value: { expr: 'lit', value: 'Users' } }] },
        ]},
      ],
    },
  },
  About: {
    view: {
      kind: 'element',
      tag: 'div',
      children: [
        { kind: 'element', tag: 'h1', children: [{ kind: 'text', value: { expr: 'lit', value: 'About' } }] },
        { kind: 'component', name: 'Link', props: { to: '/' }, children: [{ kind: 'text', value: { expr: 'lit', value: 'Back to Home' } }] },
      ],
    },
  },
  Users: {
    view: {
      kind: 'element',
      tag: 'div',
      children: [
        { kind: 'element', tag: 'h1', children: [{ kind: 'text', value: { expr: 'lit', value: 'Users' } }] },
        { kind: 'component', name: 'Outlet' },
      ],
    },
  },
  UserDetail: {
    view: {
      kind: 'element',
      tag: 'div',
      children: [
        { kind: 'text', value: { expr: 'concat', parts: [
          { expr: 'lit', value: 'User ID: ' },
          { expr: 'route', param: 'id' },
        ]}},
      ],
    },
  },
};

// Create and mount the app
const app = createApp({
  router,
  components,
});

app.mount('#app');`;

export default function RouterExamplePage() {
  return (
    <ExamplePage
      title="Router"
      description="A multi-page routing example demonstrating navigation, nested routes, and dynamic parameters."
      code={routerCode}
      language="typescript"
      features={[
        '@constela/router package',
        'Route definitions',
        'Link component for navigation',
        'Nested routes with Outlet',
        'Dynamic route parameters',
        'Route param expressions',
      ]}
      runCommands={[
        'npm install @constela/core @constela/runtime @constela/router',
        'npx constela dev',
      ]}
      note="This example requires the @constela/router package and uses TypeScript instead of the JSON DSL for router configuration."
    />
  );
}
