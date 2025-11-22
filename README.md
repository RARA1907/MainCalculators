# MainCalculators.com

A modern financial calculator hub built with Next.js 14, TypeScript, and Tailwind CSS.
<img width="1393" height="793" alt="Screenshot 2025-11-22 at 15 04 27 1" src="https://github.com/user-attachments/assets/f1b87c24-5af3-4c32-8264-f343df8165c1" />

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
