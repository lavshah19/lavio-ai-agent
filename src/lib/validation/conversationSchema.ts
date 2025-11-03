import z from "zod";

export const FormDataSchema = z.object({
  userMessage: z.string().min(1, "Message cannot be empty"),
  conversationId: z.string().min(1, "Conversation ID required"),
 file: z
  .string()
  .optional()
  .transform((val) => {
    if (!val) return [];
    try {
      const parsed = JSON.parse(val);

      // Validate parsed data matches your file structure
      return z
        .array(
          z.object({
            id: z.string(),
            fileName: z.string(),
            fileType: z.string(),
            fileSize: z.number().nullable().optional(),
            storageUrl: z.string(),
            embeddingId: z.string().nullable().optional(),
          })
        )
        .parse(parsed);
    } catch {
      throw new Error("Invalid file format");
    }
  }),
});
export type FormDataValues = z.infer<typeof FormDataSchema>;

export function validateFormData(formData: FormData): FormDataValues {
  return FormDataSchema.parse({
    userMessage: formData.get("userMessage"),
    conversationId: formData.get("conversationId"),
    file: formData.get("file"),
  });
}