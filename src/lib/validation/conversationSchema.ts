import z from "zod";

export const FormDataSchema = z.object({
  userMessage: z.string().min(1, "Message cannot be empty"),
  conversationId: z.string().min(1, "Conversation ID required"),
});

export type FormDataValues = z.infer<typeof FormDataSchema>;

export function validateFormData(formData: FormData): FormDataValues {
  return FormDataSchema.parse({
    userMessage: formData.get("userMessage"),
    conversationId: formData.get("conversationId"),
  });
}