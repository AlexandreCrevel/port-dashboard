# Le Havre Port Dashboard

Port activity monitoring and management dashboard for the Port of Le Havre.

## Tech Stack

- **Framework**: Next.js with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **State Management**: Zustand (client), TanStack Query (server)
- **Validation**: Zod
- **Testing**: Vitest
- **UI Components**: shadcn/ui

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Build

```bash
npm run build
npm start
```

### Linting & Type Checking

```bash
npm run lint
npm run type-check
```

### Testing

```bash
npm test
```

## Project Structure

```
src/
├── app/                    # Next.js App Router pages & layouts
├── components/
│   ├── atoms/              # Buttons, Inputs, Labels, Icons
│   ├── molecules/          # SearchBar, FormField, Card
│   ├── organisms/          # Header, Sidebar, DataTable
│   ├── templates/          # Page layouts
│   └── ui/                 # shadcn/ui components
├── hooks/                  # Custom React hooks
├── lib/                    # Utilities, helpers, constants
├── stores/                 # Zustand stores
├── types/                  # Global TypeScript types
└── styles/                 # Global CSS
```

## License

MIT
