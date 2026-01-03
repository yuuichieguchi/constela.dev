# Constela Documentation Site

The official documentation site for [Constela](https://github.com/yuuichieguchi/constela) - a compiler-first UI language for vibecoding.

## Tech Stack

- **Framework**: Next.js 16 + React 19
- **Styling**: Tailwind CSS v4 + @tailwindcss/typography
- **MDX**: next-mdx-remote + gray-matter
- **Syntax Highlighting**: Shiki (@shikijs/rehype)
- **Playground Editor**: Monaco Editor
- **Theme**: next-themes (light/dark mode)

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run start
```

## Project Structure

```
constela.dev/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── docs/               # Documentation pages
│   │   ├── reference/          # API reference pages
│   │   ├── examples/           # Example pages
│   │   └── playground/         # Interactive playground
│   ├── components/
│   │   ├── layout/             # Header, Sidebar, Footer, etc.
│   │   ├── mdx/                # MDX components (CodeBlock, Callout, PropsTable)
│   │   ├── playground/         # Playground components
│   │   └── home/               # Home page components
│   ├── content/
│   │   ├── docs/               # Documentation MDX files
│   │   └── reference/          # Reference MDX files
│   └── lib/                    # Utilities (mdx, navigation, config)
└── public/                     # Static assets
```

## Pages

### Documentation (Get Started)
- Introduction
- Installation
- Your First App
- State & Expressions
- Actions & Events
- Fetch & Effects
- Components
- Routing

### Reference
- DSL Root Schema
- View Nodes
- Expressions
- Actions
- Error Codes
- Packages

### Examples
- Counter
- Todo List
- Fetch List
- Router

### Playground
Interactive editor to write and run Constela code in the browser.

## Deployment

The site is optimized for static deployment:

```bash
npm run build
```

Deploy the `.next` directory to:
- **Vercel** (recommended)
- **Netlify**
- **GitHub Pages**
- Any static hosting

### Vercel Deployment

```bash
npx vercel
```

## Dependencies

This site depends on the following Constela packages (installed from npm):

- `@constela/core` - Types, schema, validator
- `@constela/compiler` - AST transformation
- `@constela/runtime` - DOM renderer
- `@constela/router` - Client-side routing

## License

MIT
