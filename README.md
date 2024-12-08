# MainCalculators.com

A modern financial calculator hub built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

- Loan Calculator
  - Calculate monthly payments
  - Input loan amount, interest rate, and term
  - Instant results with precise calculations

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- React 18

## Project Structure

```
src/
  ├── app/
  │   ├── layout.tsx    # Root layout with header and footer
  │   ├── page.tsx      # Home page
  │   └── globals.css   # Global styles
  ├── components/
  │   ├── calculators/  # Calculator components
  │   │   ├── CalculatorLayout.tsx
  │   │   └── LoanCalculator.tsx
  │   └── ui/          # Reusable UI components
  │       └── card.tsx
```

## Contributing

Feel free to contribute to this project by submitting issues and/or pull requests.

## License

MIT
