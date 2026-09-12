import type { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import type { UserOptions } from "jspdf-autotable";
import { siteConfig } from "@/config/site";
import {
  displayValue,
  formatQuoteDate,
  formatQuoteDims,
  quoteFullName,
  quoteOptionLabel,
  quoteRef,
  quoteStatusLabel,
} from "@/lib/quotes/format";
import type { SerializedQuote } from "@/lib/quotes/serialize";

const GREEN: [number, number, number] = [52, 173, 120];
const GREEN_DARK: [number, number, number] = [22, 122, 77];
const INK: [number, number, number] = [18, 21, 26];
const MUTED: [number, number, number] = [92, 101, 110];
const LINE: [number, number, number] = [226, 229, 232];
const STRIPE: [number, number, number] = [246, 249, 247];
const LABEL_BG: [number, number, number] = [244, 246, 247];

const LOGO_SRC = "/images/logo/logo-white.png";
const HEADER_H = 20;
const MARGIN = 10;

type LogoImage = HTMLImageElement;

let logoPromise: Promise<LogoImage | null> | null = null;

function loadLogo() {
  if (!logoPromise) {
    logoPromise = (async () => {
      try {
        const res = await fetch(LOGO_SRC);
        if (!res.ok) return null;
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        try {
          return await new Promise<LogoImage>((resolve, reject) => {
            const image = new Image();
            image.onload = () => resolve(image);
            image.onerror = () => reject(new Error("logo"));
            image.src = url;
          });
        } finally {
          URL.revokeObjectURL(url);
        }
      } catch {
        return null;
      }
    })();
  }
  return logoPromise;
}

function pageSize(doc: jsPDF) {
  return {
    w: doc.internal.pageSize.getWidth(),
    h: doc.internal.pageSize.getHeight(),
  };
}

function drawHeader(
  doc: jsPDF,
  logo: LogoImage | null,
  title: string,
  subtitle: string,
) {
  const { w } = pageSize(doc);
  doc.setFillColor(...INK);
  doc.rect(0, 0, w, HEADER_H, "F");
  doc.setFillColor(...GREEN);
  doc.rect(0, HEADER_H, w, 1.1, "F");

  if (logo) {
    const height = 9.5;
    const width = (logo.naturalWidth / logo.naturalHeight) * height;
    doc.addImage(logo, "PNG", MARGIN, (HEADER_H - height) / 2, width, height);
  } else {
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text(siteConfig.name, MARGIN, 12);
  }

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text(title, w - MARGIN, 8.6, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(186, 196, 190);
  doc.text(subtitle, w - MARGIN, 14.2, { align: "right" });
}

function drawFooter(doc: jsPDF) {
  const { w, h } = pageSize(doc);
  const pages = doc.getNumberOfPages();
  const contact = `${siteConfig.name}  ·  ${siteConfig.contact.phone}  ·  ${siteConfig.contact.email}`;

  for (let i = 1; i <= pages; i += 1) {
    doc.setPage(i);
    doc.setDrawColor(...GREEN);
    doc.setLineWidth(0.25);
    doc.line(MARGIN, h - 8, w - MARGIN, h - 8);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(...MUTED);
    doc.text(contact, MARGIN, h - 4.5);
    doc.text(`Page ${i} of ${pages}`, w - MARGIN, h - 4.5, { align: "right" });
  }
}

function compactTable(overrides: UserOptions = {}): UserOptions {
  return {
    theme: "grid",
    styles: {
      font: "helvetica",
      fontSize: 8,
      textColor: INK,
      lineColor: LINE,
      lineWidth: 0.15,
      cellPadding: { top: 1.6, bottom: 1.6, left: 2.2, right: 2.2 },
      overflow: "linebreak",
      valign: "middle",
    },
    headStyles: {
      fillColor: GREEN_DARK,
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 7.5,
      cellPadding: { top: 1.8, bottom: 1.8, left: 2.2, right: 2.2 },
    },
    alternateRowStyles: { fillColor: STRIPE },
    ...overrides,
  };
}

function drawTable(doc: jsPDF, options: UserOptions) {
  let endY = typeof options.startY === "number" ? options.startY : HEADER_H + 8;
  const prev = options.didDrawPage;
  autoTable(doc, {
    ...options,
    didDrawPage: (data) => {
      prev?.(data);
      if (data.cursor) endY = data.cursor.y;
    },
  });
  return endY;
}

function kvRows(rows: Array<[string, string]>) {
  return rows.filter(([, value]) => value && value !== "—");
}

function quoteSpecRows(quote: SerializedQuote): Array<[string, string]> {
  return kvRows([
    ["Product", displayValue(quote.productType)],
    ["Quantity", displayValue(quote.quantity)],
    ["Size (W × H × L)", formatQuoteDims(quote)],
    ["Zip", displayValue(quote.zip)],
    ["Material", quoteOptionLabel("material", quote.material)],
    ["Color", quoteOptionLabel("color", quote.color)],
    ["Printing", quoteOptionLabel("printing", quote.printing)],
    ["Coating", quoteOptionLabel("coating", quote.coating)],
    ["Thickness", quoteOptionLabel("thickness", quote.thickness)],
    ["Add-on", quoteOptionLabel("addOn", quote.addOn)],
  ]);
}

function quoteCustomerRows(quote: SerializedQuote): Array<[string, string]> {
  return kvRows([
    ["Name", quoteFullName(quote)],
    ["Email", displayValue(quote.email)],
    ["Phone", displayValue(quote.phone)],
    ["Company", displayValue(quote.company)],
    ["Status", quoteStatusLabel(quote.status)],
    [
      "Step",
      quote.status === "draft" ? `${quote.currentStep}/4` : "Complete",
    ],
    ["Received", formatQuoteDate(quote.createdAt, true)],
    ["Updated", formatQuoteDate(quote.updatedAt, true)],
  ]);
}

const kvColumnStyles = {
  0: {
    cellWidth: 32,
    fontStyle: "bold" as const,
    textColor: MUTED,
    fillColor: LABEL_BG,
  },
  1: { cellWidth: "auto" as const, fontStyle: "normal" as const },
};

export async function downloadQuotePdf(quote: SerializedQuote) {
  const [{ jsPDF }, logo] = await Promise.all([import("jspdf"), loadLogo()]);
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const ref = quoteRef(quote);
  const subtitle = `${ref}  ·  ${formatQuoteDate(quote.createdAt, true)}`;

  const paintChrome = () => drawHeader(doc, logo, "Quote request", subtitle);
  const startY = HEADER_H + 6;
  const gap = 3;
  const tableWidth = (pageSize(doc).w - MARGIN * 2 - gap) / 2;
  const customer = quoteCustomerRows(quote);
  const specs = quoteSpecRows(quote);

  const leftY = drawTable(
    doc,
    compactTable({
      startY,
      margin: { left: MARGIN, right: MARGIN + tableWidth + gap, top: HEADER_H + 5, bottom: 12 },
      tableWidth,
      showHead: "everyPage",
      head: [["Customer", ""]],
      body: customer,
      columnStyles: kvColumnStyles,
      didDrawPage: paintChrome,
    }),
  );

  const rightY = drawTable(
    doc,
    compactTable({
      startY,
      margin: { left: MARGIN + tableWidth + gap, right: MARGIN, top: HEADER_H + 5, bottom: 12 },
      tableWidth,
      showHead: "everyPage",
      head: [["Specifications", ""]],
      body: specs.length ? specs : [["Details", "—"]],
      columnStyles: kvColumnStyles,
      didDrawPage: paintChrome,
    }),
  );

  let y = Math.max(leftY, rightY) + 4;
  const notes = quote.notes?.trim();
  if (notes) {
    y = drawTable(
      doc,
      compactTable({
        startY: y,
        margin: { left: MARGIN, right: MARGIN, top: HEADER_H + 5, bottom: 12 },
        head: [["Project details"]],
        body: [[notes]],
        alternateRowStyles: { fillColor: [255, 255, 255] },
        styles: {
          fontSize: 8,
          cellPadding: { top: 2.2, bottom: 2.2, left: 2.4, right: 2.4 },
          valign: "top",
        },
      }),
    );
  }

  drawFooter(doc);
  doc.save(`quote-${ref.toLowerCase()}.pdf`);
}

export async function downloadQuotesListPdf(quotes: SerializedQuote[]) {
  const [{ jsPDF }, logo] = await Promise.all([import("jspdf"), loadLogo()]);
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  const generated = formatQuoteDate(new Date().toISOString(), true);
  const subtitle = `${quotes.length} record${quotes.length === 1 ? "" : "s"}  ·  ${generated}`;

  const paintChrome = () => drawHeader(doc, logo, "Quote requests", subtitle);

  drawTable(
    doc,
    compactTable({
      startY: HEADER_H + 6,
      margin: { left: MARGIN, right: MARGIN, top: HEADER_H + 5, bottom: 12 },
      showHead: "everyPage",
      head: [[
        "Ref",
        "Customer",
        "Email",
        "Phone",
        "Product",
        "Qty",
        "Size",
        "Status",
        "Received",
      ]],
      body: quotes.map((quote) => [
        quoteRef(quote),
        quoteFullName(quote),
        displayValue(quote.email),
        displayValue(quote.phone),
        displayValue(quote.productType),
        displayValue(quote.quantity),
        formatQuoteDims(quote),
        quoteStatusLabel(quote.status),
        formatQuoteDate(quote.createdAt, true),
      ]),
      styles: {
        font: "helvetica",
        fontSize: 7.4,
        textColor: INK,
        lineColor: LINE,
        lineWidth: 0.15,
        cellPadding: { top: 1.4, bottom: 1.4, left: 1.8, right: 1.8 },
        overflow: "linebreak",
        valign: "middle",
      },
      headStyles: {
        fillColor: GREEN_DARK,
        textColor: [255, 255, 255],
        fontStyle: "bold",
        fontSize: 7.2,
        cellPadding: { top: 1.6, bottom: 1.6, left: 1.8, right: 1.8 },
      },
      columnStyles: {
        0: { cellWidth: 18, fontStyle: "bold" },
        1: { cellWidth: 36 },
        2: { cellWidth: 48 },
        3: { cellWidth: 28 },
        4: { cellWidth: 36 },
        5: { cellWidth: 14, halign: "right" },
        6: { cellWidth: 32 },
        7: { cellWidth: 24 },
        8: { cellWidth: "auto" },
      },
      didDrawPage: paintChrome,
    }),
  );

  drawFooter(doc);
  doc.save(`quote-requests-${new Date().toISOString().slice(0, 10)}.pdf`);
}
