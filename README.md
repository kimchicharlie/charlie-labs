# charlie-labs

Personal resume site — [charliehenin.com](https://www.charliehenin.com/)

Successor to my older [portfolio](https://github.com/kimchicharlie/portfolio).

## Stack

Next.js, TypeScript, Tailwind CSS, Framer Motion

## Local dev

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Content

- Resume data: `features/resume/data/portfolioData.ts`
- UI strings: `shared/i18n/translations.ts`

## Build

```bash
npm run build
```

Static export goes to `out/`.

## Resume PDFs

```bash
npm run generate:resumes
```

This regenerates English and French PDFs in US Letter and A4 formats. The
pre-commit hook runs the generator and stages the PDFs when resume inputs change.

## License

MIT
