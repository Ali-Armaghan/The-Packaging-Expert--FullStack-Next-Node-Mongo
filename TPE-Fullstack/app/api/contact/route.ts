import { connectToDatabase } from "@/lib/db/mongoose";
import { apiError, apiFromUnknownError, apiSuccess } from "@/lib/api/response";
import { contactMessageSchema } from "@/lib/validations/contact";
import { ContactMessage } from "@/models/ContactMessage";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const payload = contactMessageSchema.parse(body);

    await connectToDatabase();

    const doc = await ContactMessage.create({
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      phone: payload.phone,
      topic: payload.topic,
      company: payload.company,
      message: payload.message,
      status: "new",
    });

    return apiSuccess(
      {
        id: String(doc._id),
        message: "Contact message received",
      },
      201,
    );
  } catch (error) {
    if (error instanceof SyntaxError) {
      return apiError("Invalid JSON body", 400);
    }
    return apiFromUnknownError(error);
  }
}
