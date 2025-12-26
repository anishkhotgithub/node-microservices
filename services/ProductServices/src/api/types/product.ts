import { z } from "zod";
import product from "../model/product";

// Runtime + compile-time validation
export const CreateProductSchema = z.object({
  productName: z.string().min(1),
  quantity: z.number().min(0).default(0),
  price: z.number().min(0).default(0),
  isActive: z.boolean(),
  isDeleted: z.boolean().optional(),
  isEdited: z.boolean().optional(),
});

export type CreateProduct = z.infer<typeof CreateProductSchema>;
