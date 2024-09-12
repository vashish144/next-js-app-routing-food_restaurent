import sql from "better-sqlite3";
import slugify from "slugify";
import xss from "xss";
import fs from "node:fs";

const db = sql("meals.db");

export async function getMeals() {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  const stmt = db.prepare("SELECT * FROM meals");
  const meals = stmt.all();
  return meals;
}

export async function getMeal(slug) {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const stmt = db.prepare("SELECT * FROM meals WHERE slug = ?");
  const meal = stmt.get(slug);
  return meal;
}
export async function saveMeal(meal) {
  meal.slug = slugify(meal.title, { lower: true });
  meal.instructions = xss(meal.instructions);
  const extension = meal.image.name.split(".").pop();
  const fileName = `${meal.slug}.${extension}`;
  const stream = fs.createWriteStream(`public/images/${fileName}`);
  const bufferedImage = await meal.image.arrayBuffer();
  stream.write(Buffer.from(bufferedImage), (error) => {
    if (error) {
      throw new Error("Saving image failed");
    }
  });
  meal.image = `/images/${fileName}`;

  
const stmt = db.prepare(
  "INSERT INTO meals (title, summary, instructions, image, creator, creator_email, slug) VALUES (?, ?, ?, ?, ?, ?, ?)"
);
const result = stmt.run(
  meal.title,
  meal.summary,
  meal.instructions,
  meal.image,
  meal.creator,
  meal.creator_email,
  meal.slug
);
// return result;
}

