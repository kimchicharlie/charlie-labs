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
const PAGE = { left: 38, right: 574, width: 536, safeBottom: 764 };
const COLORS = {
  dark: "#1b1d21",
  primary: "#285b91",
  text: "#565a61",
  muted: "#777b82",
  border: "#e4e2dc",
  tag: "#f2f3f4",
};
const CONTACT_ICONS = {
  mail: [
    ["rect", { x: 2, y: 4, width: 20, height: 16, radius: 2 }],
    ["path", { d: "m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" }],
  ],
  globe: [
    ["circle", { x: 12, y: 12, radius: 10 }],
    ["path", { d: "M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" }],
    ["path", { d: "M2 12h20" }],
  ],
  linkedin: [
    ["path", { d: "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" }],
    ["rect", { x: 2, y: 9, width: 4, height: 12, radius: 0 }],
    ["circle", { x: 4, y: 4, radius: 2 }],
  ],
  github: [
    ["path", { d: "M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" }],
    ["path", { d: "M9 18c-4.51 2-5-2-7-2" }],
  ],
  phone: [
    ["path", { d: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" }],
  ],
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

function paragraph(doc, text, y, options = {}) {
  const x = options.x ?? PAGE.left;
  const width = options.width ?? PAGE.width;
  doc
    .font(options.bold ? "Bold" : "Regular")
    .fontSize(options.size ?? 7.4)
    .fillColor(options.color ?? COLORS.text)
    .text(text, x, y, {
      width,
      lineGap: options.lineGap ?? 1.2,
      continued: false,
      link: options.link,
      underline: false,
    });
  return doc.y;
}

function textHeight(doc, text, options = {}) {
  return doc
    .font(options.bold ? "Bold" : "Regular")
    .fontSize(options.size ?? 7.4)
    .heightOfString(text, {
      width: options.width ?? PAGE.width,
      lineGap: options.lineGap ?? 1.2,
    });
}

function divider(doc, y) {
  doc
    .strokeColor(COLORS.border)
    .lineWidth(0.7)
    .moveTo(PAGE.left, y)
    .lineTo(PAGE.right, y)
    .stroke();
}

function drawContactIcon(doc, icon, x, y, size = 9) {
  const scale = size / 24;
  doc
    .save()
    .translate(x, y)
    .scale(scale)
    .lineWidth(2)
    .lineCap("round")
    .lineJoin("round")
    .strokeColor(COLORS.muted);
  CONTACT_ICONS[icon].forEach(([shape, attributes]) => {
    if (shape === "path") {
      doc.path(attributes.d).stroke();
    } else if (shape === "rect") {
      doc
        .roundedRect(
          attributes.x,
          attributes.y,
          attributes.width,
          attributes.height,
          attributes.radius,
        )
        .stroke();
    } else {
      doc.circle(attributes.x, attributes.y, attributes.radius).stroke();
    }
  });
  doc.restore();
}

function sectionTitle(doc, title, y, options = {}) {
  paragraph(doc, title, y, {
    x: options.x,
    width: options.width,
    bold: true,
    size: options.size ?? 10,
    color: COLORS.dark,
    lineGap: 0,
  });
  return y + (options.compact ? 16 : 20);
}

function header(doc, language) {
  paragraph(doc, data.personalInfo.name, 23, {
    bold: true,
    size: 18,
    color: COLORS.dark,
    width: 270,
    lineGap: 0,
  });
  paragraph(doc, local(data.personalInfo.title, language), 49, {
    bold: true,
    size: 9,
    color: COLORS.primary,
    width: 270,
    lineGap: 0,
  });
  paragraph(doc, local(data.personalInfo.location, language), 68, {
    size: 7.2,
    color: COLORS.muted,
    width: 270,
    lineGap: 0,
  });

  const contactColumns = [338, 462];
  const contactWidth = 112;
  const contactRows = [28, 48, 68];
  const contacts = [
    ["mail", data.contact.email, `mailto:${data.contact.email}`],
    ["globe", data.contact.website, `https://${data.contact.website}`],
    ["linkedin", data.contact.linkedin, `https://www.linkedin.com/in/${data.contact.linkedin}/`],
    ["github", data.contact.github, `https://github.com/${data.contact.github}`],
    ["phone", data.contact.phone, `tel:${data.contact.phone}`],
  ];
  contacts.forEach(([icon, label, link], index) => {
    const column = index % 2;
    const row = Math.floor(index / 2);
    drawContactIcon(
      doc,
      icon,
      contactColumns[column],
      contactRows[row] - 0.5,
    );
    paragraph(doc, label, contactRows[row], {
      x: contactColumns[column] + 14,
      width: contactWidth - 14,
      size: 6.7,
      color: COLORS.text,
      link,
      lineGap: 0,
    });
  });
  divider(doc, 98);
}

function overview(doc, language, y) {
  const leftX = PAGE.left;
  const leftWidth = 250;
  const rightX = 320;
  const rightWidth = 254;
  const summaryTitle =
    language === "fr" ? "PROFIL PROFESSIONNEL" : "PROFESSIONAL SUMMARY";
  const technologiesTitle = "TECHNOLOGIES";

  sectionTitle(doc, summaryTitle, y, {
    x: leftX,
    width: leftWidth,
    compact: true,
  });
  const summaryBottom = paragraph(doc, local(data.personalInfo.about, language), y + 20, {
    x: leftX,
    width: leftWidth,
    size: 7.3,
    lineGap: 2.1,
  });

  sectionTitle(doc, technologiesTitle, y, {
    x: rightX,
    width: rightWidth,
    compact: true,
  });
  const groups = [
    ["core", language === "fr" ? "PRINCIPALES" : "CORE"],
    [
      "specialized",
      language === "fr" ? "PLATEFORMES SPÉCIALISÉES" : "SPECIALIZED PLATFORMS",
    ],
  ];
  let technologyY = y + 20;
  groups.forEach(([category, title]) => {
    paragraph(doc, title, technologyY, {
      x: rightX,
      width: rightWidth,
      bold: true,
      size: 6.1,
      color: COLORS.muted,
      lineGap: 0,
    });
    technologyY = paragraph(
      doc,
      data.technologies
        .filter((technology) => technology.category === category)
        .map((technology) => technology.name)
        .join(" · "),
      technologyY + 11,
      {
        x: rightX,
        width: rightWidth,
        size: 7,
        lineGap: 1.6,
      },
    );
    technologyY += 7;
  });

  const bottom = Math.max(summaryBottom, technologyY) + 11;
  divider(doc, bottom);
  return bottom + 15;
}

function experienceHeight(doc, item, language) {
  const contentWidth = 382;
  let height = 29;
  for (const bullet of local(item.description, language)) {
    height += textHeight(doc, bullet, {
      width: contentWidth - 12,
      size: 7.15,
      lineGap: 1.35,
    }) + 3;
  }
  const label = language === "fr" ? "Technologies :" : "Technologies:";
  height +=
    textHeight(doc, `${label} ${item.technologies.join(" · ")}`, {
      width: contentWidth,
      size: 6.2,
      lineGap: 1,
    }) + 17;
  return Math.max(height, 48);
}

function experience(doc, item, language, y) {
  const metaX = PAGE.left;
  const metaWidth = 124;
  const contentX = 178;
  const contentWidth = 396;

  paragraph(doc, local(item.period, language), y, {
    x: metaX,
    width: metaWidth,
    size: 6.5,
    color: COLORS.muted,
    lineGap: 0,
  });
  paragraph(doc, local(item.location, language), y + 13, {
    x: metaX,
    width: metaWidth,
    size: 6.2,
    color: COLORS.muted,
    lineGap: 0.8,
  });

  paragraph(doc, local(item.title, language), y, {
    x: contentX,
    width: contentWidth,
    bold: true,
    size: 8,
    color: COLORS.dark,
    lineGap: 0,
  });
  paragraph(doc, item.company, y + 13, {
    x: contentX,
    width: contentWidth,
    bold: true,
    size: 6.8,
    color: COLORS.primary,
    lineGap: 0,
  });

  let cursor = y + 29;
  for (const bullet of local(item.description, language)) {
    paragraph(doc, "•", cursor, {
      x: contentX,
      width: 8,
      size: 7,
      color: COLORS.muted,
      lineGap: 0,
    });
    cursor = paragraph(doc, bullet, cursor, {
      x: contentX + 12,
      width: contentWidth - 12,
      size: 7.15,
      lineGap: 1.35,
    });
    cursor += 3;
  }
  const technologiesLabel = language === "fr" ? "Technologies :" : "Technologies:";
  cursor = paragraph(
    doc,
    `${technologiesLabel} ${item.technologies.join(" · ")}`,
    cursor + 2,
    {
      x: contentX,
      width: contentWidth,
      size: 6.2,
      color: COLORS.muted,
      lineGap: 1,
    },
  );
  const bottom = cursor + 10;
  divider(doc, bottom);
  return bottom + 11;
}

function educationEntry(doc, item, language, y, x, width) {
  paragraph(doc, local(item.degree, language), y, {
    x,
    width,
    bold: true,
    size: 7.5,
    color: COLORS.dark,
    lineGap: 0.8,
  });
  paragraph(doc, item.institution, doc.y + 2, {
    x,
    width,
    bold: true,
    size: 6.6,
    color: COLORS.primary,
    lineGap: 0,
  });
  paragraph(
    doc,
    `${local(item.location, language)} · ${local(item.period, language)}`,
    doc.y + 2,
    { x, width, size: 6.2, color: COLORS.muted, lineGap: 0 },
  );
  let cursor = doc.y + 4;
  for (const bullet of local(item.description, language)) {
    paragraph(doc, "•", cursor, {
      x,
      width: 8,
      size: 6.8,
      color: COLORS.muted,
      lineGap: 0,
    });
    cursor = paragraph(doc, bullet, cursor, {
      x: x + 11,
      width: width - 11,
      size: 6.8,
      lineGap: 1,
    });
    cursor += 2;
  }
  return cursor + 7;
}

function educationAndDetails(doc, language, y) {
  const leftX = PAGE.left;
  const leftWidth = 330;
  const rightX = 398;
  const rightWidth = 176;
  const educationTitle = language === "fr" ? "FORMATION" : "EDUCATION";
  const languagesTitle = language === "fr" ? "LANGUES" : "LANGUAGES";
  const interestsTitle = language === "fr" ? "CENTRES D’INTÉRÊT" : "INTERESTS";

  let leftY = sectionTitle(doc, educationTitle, y, {
    x: leftX,
    width: leftWidth,
    compact: true,
  });
  data.education.forEach((item) => {
    leftY = educationEntry(doc, item, language, leftY, leftX, leftWidth);
  });

  let rightY = sectionTitle(doc, languagesTitle, y, {
    x: rightX,
    width: rightWidth,
    compact: true,
  });
  rightY = paragraph(doc, local(data.languages, language), rightY, {
    x: rightX,
    width: rightWidth,
    size: 6.8,
    lineGap: 1.4,
  });
  rightY = sectionTitle(doc, interestsTitle, rightY + 14, {
    x: rightX,
    width: rightWidth,
    compact: true,
  });
  rightY = paragraph(doc, local(data.interests, language), rightY, {
    x: rightX,
    width: rightWidth,
    size: 6.8,
    lineGap: 1.4,
  });
  return Math.max(leftY, rightY);
}

function bottomDetailsHeight(doc, language) {
  const educationHeights = data.education.reduce((total, item) => {
    let itemHeight = 33;
    local(item.description, language).forEach((bullet) => {
      itemHeight += textHeight(doc, bullet, {
        width: 319,
        size: 6.8,
        lineGap: 1,
      }) + 2;
    });
    return total + itemHeight;
  }, 0);
  return 20 + educationHeights + 8;
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
  let y = overview(doc, language, 116);
  y = sectionTitle(doc, language === "fr" ? "EXPÉRIENCES" : "EXPERIENCE", y);

  const roleHeights = data.experience.map((item) =>
    experienceHeight(doc, item, language),
  );
  const detailsHeight = bottomDetailsHeight(doc, language);
  const pageTwoStart = 50;
  let splitIndex = -1;
  for (let index = 1; index < roleHeights.length; index += 1) {
    const pageOneRoles = roleHeights
      .slice(0, index)
      .reduce((total, height) => total + height, 0);
    const pageTwoRoles = roleHeights
      .slice(index)
      .reduce((total, height) => total + height, 0);
    const pageOneRemaining = PAGE.safeBottom - (y + pageOneRoles);
    const pageTwoRemaining =
      PAGE.safeBottom - (pageTwoStart + pageTwoRoles + detailsHeight);
    if (pageOneRemaining >= 0 && pageTwoRemaining >= 0) splitIndex = index;
  }
  if (splitIndex < 0) {
    throw new Error(`${suffix} content cannot fit on two balanced pages`);
  }

  data.experience.forEach((item, index) => {
    if (index === splitIndex) {
      doc.addPage();
      y = sectionTitle(
        doc,
        language === "fr" ? "EXPÉRIENCES" : "EXPERIENCE",
        30,
      );
    }
    y = experience(doc, item, language, y);
  });

  y = educationAndDetails(doc, language, y + 3);
  if (y > PAGE.safeBottom) {
    throw new Error(`${suffix} content exceeds safe page boundary (${y})`);
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
    const annotations = page.node.lookupMaybe(PDFName.of("Annots"), PDFArray);
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
