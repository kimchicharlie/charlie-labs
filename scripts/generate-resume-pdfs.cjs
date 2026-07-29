/* eslint-disable no-console */
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const PDFDocument = require("pdfkit");
const {
  PDFArray,
  PDFDocument: PDFLibDocument,
  PDFName,
  PDFNumber,
} = require("pdf-lib");

const ROOT = path.resolve(__dirname, "..");
const OUTPUT = path.join(ROOT, "public", "resumes");
const FONT = require.resolve("dejavu-fonts-ttf/ttf/DejaVuSans.ttf");
const FONT_BOLD = require.resolve("dejavu-fonts-ttf/ttf/DejaVuSans-Bold.ttf");
const COLORS = {
  dark: "#111827",
  primary: "#3b82f6",
  accent: "#f97316",
  text: "#374151",
  muted: "#6b7280",
};

function loadPortfolioData() {
  const source = fs
    .readFileSync(
      path.join(ROOT, "features", "resume", "data", "portfolioData.ts"),
      "utf8",
    )
    .replace(/^import.*\n/, "")
    .replace("export const portfolioData: PortfolioData =", "portfolioData =");
  const context = { portfolioData: null };
  vm.runInNewContext(source, context);
  return context.portfolioData;
}

const data = loadPortfolioData();
const local = (value, language) => value[language];

function sectionTitle(doc, title, y, color = COLORS.primary) {
  doc.font("Bold").fontSize(10).fillColor(COLORS.dark).text(title, 38, y);
  doc
    .strokeColor(color)
    .lineWidth(1.5)
    .moveTo(38, y + 14)
    .lineTo(574, y + 14)
    .stroke();
  return y + 21;
}

function paragraph(doc, text, y, options = {}) {
  const x = options.x || 38;
  const width = options.width || 536;
  doc
    .font(options.bold ? "Bold" : "Regular")
    .fontSize(options.size || 7.4)
    .fillColor(options.color || COLORS.text)
    .text(text, x, y, {
      width,
      lineGap: options.lineGap ?? 1.2,
      continued: false,
    });
  return doc.y;
}

function textHeight(doc, text, options = {}) {
  return doc
    .font(options.bold ? "Bold" : "Regular")
    .fontSize(options.size || 7.4)
    .heightOfString(text, {
      width: options.width || 536,
      lineGap: options.lineGap ?? 1.2,
    });
}

function experienceHeight(doc, item, language) {
  let height = 34;
  for (const bullet of local(item.description, language)) {
    height += textHeight(doc, bullet, { width: 510, size: 7.5 }) + 2.5;
  }
  const label = language === "fr" ? "Technologies :" : "Technologies:";
  height +=
    textHeight(doc, `${label} ${item.technologies.join(" · ")}`, {
      width: 520,
      size: 7,
    }) + 10;
  return height;
}

function experience(doc, item, language, y) {
  doc
    .strokeColor(COLORS.primary)
    .lineWidth(2)
    .moveTo(39, y)
    .lineTo(39, y + 8)
    .stroke();
  paragraph(doc, local(item.title, language), y, {
    x: 48,
    bold: true,
    size: 8,
  });
  paragraph(doc, item.company, y + 11, {
    x: 48,
    bold: true,
    size: 7.2,
    color: COLORS.primary,
  });
  paragraph(
    doc,
    `${local(item.location, language)}  |  ${local(item.period, language)}`,
    y + 22,
    { x: 48, size: 7, color: COLORS.muted },
  );
  let cursor = y + 34;
  for (const bullet of local(item.description, language)) {
    doc
      .font("Regular")
      .fontSize(7.5)
      .fillColor(COLORS.primary)
      .text("•", 49, cursor);
    cursor = paragraph(doc, bullet, cursor, {
      x: 59,
      width: 510,
      size: 7.5,
    });
    cursor += 2.5;
  }
  const label = language === "fr" ? "Technologies :" : "Technologies:";
  cursor = paragraph(
    doc,
    `${label} ${item.technologies.join(" · ")}`,
    cursor + 1,
    { x: 48, width: 520, size: 7, color: COLORS.muted },
  );
  return cursor + 9;
}

function education(doc, item, language, y) {
  doc
    .strokeColor(COLORS.accent)
    .lineWidth(2)
    .moveTo(39, y)
    .lineTo(39, y + 8)
    .stroke();
  paragraph(doc, local(item.degree, language), y, {
    x: 48,
    bold: true,
    size: 8,
  });
  paragraph(doc, item.institution, y + 11, {
    x: 48,
    bold: true,
    size: 7.2,
    color: COLORS.accent,
  });
  paragraph(
    doc,
    `${local(item.location, language)}  |  ${local(item.period, language)}`,
    y + 22,
    { x: 48, size: 7, color: COLORS.muted },
  );
  let cursor = y + 34;
  for (const bullet of local(item.description, language)) {
    doc
      .font("Regular")
      .fontSize(7.5)
      .fillColor(COLORS.accent)
      .text("•", 49, cursor);
    cursor = paragraph(doc, bullet, cursor, {
      x: 59,
      width: 510,
      size: 7.5,
    });
    cursor += 2.5;
  }
  return cursor + 8;
}

function educationHeight(doc, item, language) {
  let height = 34;
  for (const bullet of local(item.description, language)) {
    height += textHeight(doc, bullet, { width: 510, size: 7.5 }) + 2.5;
  }
  return height + 8;
}

function header(doc, language) {
  doc.rect(0, 0, 612, 105).fill(COLORS.dark);
  doc
    .font("Bold")
    .fontSize(19)
    .fillColor("#ffffff")
    .text(data.personalInfo.name, 38, 19, { width: 536, align: "center" });
  doc
    .font("Regular")
    .fontSize(10)
    .fillColor("#d1d5db")
    .text(local(data.personalInfo.title, language), 38, 45, {
      width: 536,
      align: "center",
    });
  doc
    .fontSize(7.5)
    .fillColor("#9ca3af")
    .text("Montreal, QC, Canada", 38, 61, { width: 536, align: "center" });

  const links = [
    [data.contact.phone, `tel:${data.contact.phone}`],
    [data.contact.email, `mailto:${data.contact.email}`],
    [data.contact.website, `https://${data.contact.website}`],
    [
      data.contact.linkedin,
      `https://www.linkedin.com/in/${data.contact.linkedin}/`,
    ],
    [data.contact.github, `https://github.com/${data.contact.github}`],
  ];
  const widths = links.map(([label]) => doc.widthOfString(label) + 18);
  let x = (612 - widths.reduce((sum, width) => sum + width, 0)) / 2;
  links.forEach(([label, url], index) => {
    doc
      .fontSize(6.5)
      .fillColor("#e5e7eb")
      .text(label, x, 82, { link: url, underline: false });
    x += widths[index];
  });
}

function technologies(doc, language, y) {
  y = sectionTitle(doc, "TECHNOLOGIES", y);
  const groups = [
    [
      "core",
      language === "fr" ? "TECHNOLOGIES PRINCIPALES" : "CORE TECHNOLOGIES",
    ],
    [
      "specialized",
      language === "fr"
        ? "PLATEFORMES WEB SPÉCIALISÉES"
        : "SPECIALIZED WEB PLATFORMS",
    ],
  ];
  groups.forEach(([category, title], index) => {
    const rowY = y + index * 14;
    const labelWidth = doc.font("Bold").fontSize(6.5).widthOfString(title);
    paragraph(doc, title, rowY, {
      x: 38,
      width: labelWidth + 2,
      bold: true,
      size: 6.5,
    });
    paragraph(
      doc,
      data.technologies
        .filter((technology) => technology.category === category)
        .map((technology) => technology.name)
        .join(" · "),
      rowY,
      { x: 48 + labelWidth, width: 526 - labelWidth, size: 6.5 },
    );
  });
  return Math.max(doc.y, y + 24) + 7;
}

async function createLetter(language) {
  const suffix = language.toUpperCase();
  const filePath = path.join(
    OUTPUT,
    `charlie-henin-resume-US-Letter-${suffix}.pdf`,
  );
  const doc = new PDFDocument({
    size: "LETTER",
    margins: { top: 0, right: 0, bottom: 0, left: 0 },
    info: {
      Title: `Charlie Henin Resume (${suffix})`,
      Author: "Charlie Henin",
      Subject: "Full-Stack Developer Resume",
      CreationDate: new Date(0),
      ModDate: new Date(0),
    },
  });
  const stream = fs.createWriteStream(filePath);
  const finished = new Promise((resolve, reject) => {
    stream.on("finish", resolve);
    stream.on("error", reject);
  });
  doc.pipe(stream);
  doc.registerFont("Regular", FONT);
  doc.registerFont("Bold", FONT_BOLD);

  header(doc, language);
  let y = sectionTitle(
    doc,
    language === "fr" ? "PROFIL PROFESSIONNEL" : "PROFESSIONAL SUMMARY",
    119,
  );
  y =
    paragraph(doc, local(data.personalInfo.about, language), y, { size: 7.5 }) +
    10;
  y = technologies(doc, language, y);
  y = sectionTitle(doc, language === "fr" ? "EXPÉRIENCES" : "EXPERIENCE", y);
  const educationHeightTotal =
    22 +
    data.education.reduce(
      (total, item) => total + educationHeight(doc, item, language),
      0,
    ) +
    48;
  const roleHeights = data.experience.map((item) =>
    experienceHeight(doc, item, language),
  );
  const pageTwoStart = 49;
  let splitIndex = -1;
  for (let index = 1; index < roleHeights.length; index += 1) {
    const pageOneRoles = roleHeights
      .slice(0, index)
      .reduce((total, height) => total + height, 0);
    const pageTwoRoles = roleHeights
      .slice(index)
      .reduce((total, height) => total + height, 0);
    const pageOneRemaining = 690 - (y + pageOneRoles);
    const pageTwoRemaining =
      770 - (pageTwoStart + pageTwoRoles + educationHeightTotal);
    if (pageOneRemaining < 0 || pageTwoRemaining < 0) continue;
    splitIndex = index;
  }
  if (splitIndex < 0) {
    throw new Error(`${suffix} content cannot fit on two balanced pages`);
  }

  let pageNumber = 1;
  data.experience.forEach((item, index) => {
    if (index === splitIndex) {
      doc.addPage();
      pageNumber += 1;
      y = sectionTitle(
        doc,
        language === "fr" ? "EXPÉRIENCES" : "EXPERIENCE",
        28,
      );
    }
    y = experience(doc, item, language, y);
  });

  if (y + educationHeightTotal > 770 && pageNumber === 1) {
    doc.addPage();
    pageNumber += 1;
    y = 28;
  }
  if (y + educationHeightTotal > 770) {
    throw new Error(`${suffix} education and footer exceed two pages`);
  }
  y = sectionTitle(
    doc,
    language === "fr" ? "FORMATION" : "EDUCATION",
    y + 1,
    COLORS.accent,
  );
  data.education.forEach((item) => {
    y = education(doc, item, language, y);
  });

  const blockY = y + 2;
  const leftTitle = language === "fr" ? "LANGUES" : "LANGUAGES";
  const rightTitle = language === "fr" ? "CENTRES D’INTÉRÊT" : "INTERESTS";
  const languages = local(data.languages, language);
  const interests = local(data.interests, language);
  paragraph(doc, leftTitle, blockY, { x: 38, width: 254, bold: true, size: 9 });
  paragraph(doc, rightTitle, blockY, {
    x: 320,
    width: 254,
    bold: true,
    size: 9,
  });
  doc.strokeColor(COLORS.primary).lineWidth(1.5);
  doc.moveTo(38, blockY + 14).lineTo(286, blockY + 14).stroke();
  doc.moveTo(326, blockY + 14).lineTo(574, blockY + 14).stroke();
  doc
    .strokeColor("#d1d5db")
    .lineWidth(0.75)
    .moveTo(306, blockY)
    .lineTo(306, blockY + 34)
    .stroke();
  paragraph(doc, languages, blockY + 21, { x: 38, width: 248, size: 7 });
  paragraph(doc, interests, blockY + 21, { x: 326, width: 248, size: 7 });

  if (doc.y > 770) {
    throw new Error(`${suffix} content exceeds safe page boundary (${doc.y})`);
  }
  doc.end();
  await finished;
  return filePath;
}

async function createA4(letterPath, language) {
  const pdf = await PDFLibDocument.load(fs.readFileSync(letterPath), {
    updateMetadata: false,
  });
  const a4Width = 595.28;
  const a4Height = 841.89;
  const scale = a4Width / 612;
  const offsetY = (a4Height - 792 * scale) / 2;

  pdf.getPages().forEach((page) => {
    page.scaleContent(scale, scale);
    page.scaleAnnotations(scale, scale);
    page.translateContent(0, offsetY);
    const annotations = page.node.lookupMaybe(
      PDFName.of("Annots"),
      PDFArray,
    );
    if (annotations) {
      for (let index = 0; index < annotations.size(); index += 1) {
        const annotation = annotations.lookup(index);
        const rectangle = annotation.lookupMaybe(PDFName.of("Rect"), PDFArray);
        if (!rectangle) continue;
        for (const coordinate of [1, 3]) {
          const value = rectangle.lookup(coordinate, PDFNumber).asNumber();
          rectangle.set(coordinate, PDFNumber.of(value + offsetY));
        }
      }
    }
    page.setSize(a4Width, a4Height);
  });
  pdf.setCreationDate(new Date(0));
  pdf.setModificationDate(new Date(0));
  const suffix = language.toUpperCase();
  const filePath = path.join(OUTPUT, `charlie-henin-resume-A4-${suffix}.pdf`);
  fs.writeFileSync(filePath, await pdf.save({ useObjectStreams: false }));
}

async function main() {
  fs.mkdirSync(OUTPUT, { recursive: true });
  for (const language of ["en", "fr"]) {
    const letterPath = await createLetter(language);
    await createA4(letterPath, language);
  }
  console.log("Generated EN/FR resumes in US Letter and A4 formats.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
