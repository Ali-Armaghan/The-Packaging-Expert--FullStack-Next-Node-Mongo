import { slugify } from "@/lib/slug";

function item(title: string, sortOrder: number, body?: string) {
  return {
    title,
    slug: slugify(title),
    image: "",
    body:
      body ??
      `<p>${title} is specified for custom packaging that needs consistent converting, print quality, and a clean unboxing finish.</p>`,
    sortOrder,
    isActive: true,
  };
}

export const DEFAULT_PRODUCT_CONTENT_TABS = [
  {
    name: "Materials & Stock",
    slug: "materials-stock",
    sortOrder: 0,
    sections: [
      {
        title: "Paperboard & Cardstock",
        sortOrder: 0,
        items: [
          "230 GSM Cardstock",
          "300 GSM Cardstock",
          "350 GSM Cardstock",
          "400 GSM Cardstock",
          "450 GSM Cardstock",
          "600 GSM Cardstock",
          "SBS C1S (1-side coated)",
          "SBS C2S (2-side coated)",
          "14pt-24pt White SBS Stock",
          "CCNB (Coated Cup/Chip Natural Board)",
          "Fully Recycled CCNB",
          "Metallic Paper",
          "Holographic Paper",
          "Textured Paper",
          "Oyster White Board",
          "Kemi White Board",
          "Bleached White Board",
        ].map((title, index) => item(title, index)),
      },
      {
        title: "Corrugated Board",
        sortOrder: 1,
        items: [
          "A-Flute",
          "B-Flute",
          "C-Flute",
          "E-Flute",
          "F-Flute",
          "BC-Flute (Double Wall)",
          "EB-Flute",
          "Single Face Corrugated",
          "Single Wall Corrugated",
          "Double Wall Corrugated",
          "Triple Wall Corrugated",
        ].map((title, index) => item(title, index)),
      },
    ],
  },
  {
    name: "Details",
    slug: "details",
    sortOrder: 1,
    sections: [
      {
        title: "Overview",
        sortOrder: 0,
        items: [
          item(
            "Structure & print",
            0,
            "<p>Durable structure, precise die-lines, and full-colour printing. Every order includes free design support and a digital proof before production.</p>",
          ),
        ],
      },
    ],
  },
  {
    name: "Available Options",
    slug: "available-options",
    sortOrder: 2,
    sections: [
      {
        title: "Materials & finishes",
        sortOrder: 0,
        items: [
          item(
            "Stocks and coatings",
            0,
            "<p>Choose from kraft, corrugated, cardboard, and rigid stocks with matte, gloss, soft-touch, spot UV, or foil finishes.</p>",
          ),
        ],
      },
    ],
  },
  {
    name: "Inspiration",
    slug: "inspiration",
    sortOrder: 3,
    sections: [
      {
        title: "Ideas for this structure",
        sortOrder: 0,
        items: [
          item(
            "Brand applications",
            0,
            "<p>Browse structures brands reorder again and again — from retail-ready displays to premium gifting.</p>",
          ),
        ],
      },
    ],
  },
  {
    name: "Order Process",
    slug: "order-process",
    sortOrder: 4,
    sections: [
      {
        title: "How ordering works",
        sortOrder: 0,
        items: [
          item(
            "Customize your packaging",
            0,
            "<p>Choose from our vast selection of packaging solutions and customize it with our wide range of options.</p>",
          ),
          item(
            "Add to quote and submit",
            1,
            "<p>After customizing your packaging, add it to quote and submit a quotation for a packaging specialist.</p>",
          ),
          item(
            "Consult with our expert",
            2,
            "<p>Get expert consultation on your quotation to save on costs and streamline production.</p>",
          ),
          item(
            "Production & shipping",
            3,
            "<p>Once everything is ready, we manage production and shipping while you wait for delivery.</p>",
          ),
        ],
      },
    ],
  },
];
