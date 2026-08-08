import { readFileSync, existsSync } from "fs";
import { resolve } from "path";

function loadEnvFile(fileName: string) {
  const filePath = resolve(process.cwd(), fileName);
  if (!existsSync(filePath)) return;

  const content = readFileSync(filePath, "utf8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
}

loadEnvFile(".env.local");
loadEnvFile(".env");

async function main() {
  const { connectToDatabase } = await import("../lib/db/mongoose");
  const { Product } = await import("../models/Product");
  const {
    SAMPLE_PRODUCT,
    SAMPLE_RELATED_PRODUCTS,
    getSampleProductDetail,
  } = await import("../lib/product/sample");
  const { getProductDetailDefaults } = await import("../lib/product/defaults");

  await connectToDatabase();

  const relatedIds: string[] = [];

  for (const [index, item] of SAMPLE_RELATED_PRODUCTS.entries()) {
    const doc = await Product.findOneAndUpdate(
      { slug: item.slug },
      {
        $set: {
          name: item.name,
          slug: item.slug,
          description: item.description,
          price: item.price,
          image: item.image,
          images: [item.image],
          isActive: true,
          sortOrder: index + 1,
          detail: getProductDetailDefaults(item.name),
        },
      },
      { upsert: true, returnDocument: "after", setDefaultsOnInsert: true },
    );
    relatedIds.push(String(doc._id));
    console.log(`Upserted related: ${item.slug}`);
  }

  const detail = getSampleProductDetail();
  detail.relatedProductIds = relatedIds;

  const sample = await Product.findOneAndUpdate(
    { slug: SAMPLE_PRODUCT.slug },
    {
      $set: {
        name: SAMPLE_PRODUCT.name,
        slug: SAMPLE_PRODUCT.slug,
        description: SAMPLE_PRODUCT.description,
        price: SAMPLE_PRODUCT.price,
        image: SAMPLE_PRODUCT.image,
        images: [...SAMPLE_PRODUCT.images],
        isActive: true,
        sortOrder: SAMPLE_PRODUCT.sortOrder,
        detail,
      },
    },
    { upsert: true, returnDocument: "after", setDefaultsOnInsert: true },
  );

  console.log(`\nSample product ready: ${sample.slug}`);
  console.log(`Open: /products/${sample.slug}`);
  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
