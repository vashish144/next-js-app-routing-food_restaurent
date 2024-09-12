"use server";
import { saveMeal } from "./meal";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

function isInvalidText(text) {
  return !text || text.trim() == "";
}

export async function handleShareMeal(previousState, formData) {
  const meal = {
    title: formData.get("title"),
    summary: formData.get("summary"),
    instructions: formData.get("instructions"),
    image: formData.get("image"),
    creator: formData.get("name"),
    creator_email: formData.get("email"),
  };
  if (
    isInvalidText(meal.title) ||
    isInvalidText(meal.summary) ||
    isInvalidText(meal.instructions) ||
    isInvalidText(meal.image) ||
    isInvalidText(meal.creator) ||
    isInvalidText(meal.creator_email) ||
    !meal.creator_email.includes("@") ||
    !meal.image ||
    meal.image.length == 0
  ) {
    return {
      message: "Invalid input",
    };
  }
  await saveMeal(meal);
  revalidatePath("/meals");
  redirect("/meals");
  // console.log(meal);
}
