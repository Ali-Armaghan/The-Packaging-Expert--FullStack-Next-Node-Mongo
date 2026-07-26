import { z } from "zod";
import { contactTopics } from "@/constants/contact";

const topicEnum = z.enum(
  contactTopics as unknown as [typeof contactTopics[number], ...typeof contactTopics[number][]],
);

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((value) => (value && value.length > 0 ? value : undefined));

export const contactMessageSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(80),
  lastName: z.string().trim().min(1, "Last name is required").max(80),
  email: z.string().trim().email("Enter a valid email").max(160),
  phone: optionalText(40),
  topic: topicEnum,
  company: optionalText(120),
  message: z.string().trim().min(10, "Message is too short").max(5000),
});

export type ContactMessageInput = z.infer<typeof contactMessageSchema>;
