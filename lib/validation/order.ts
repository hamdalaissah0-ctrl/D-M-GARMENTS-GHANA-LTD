import { z } from "zod"

export const orderItemSchema = z.object({
  product_id: z.string().uuid().optional(),
  product_name: z.string().min(1, "Product name is required"),
  product_description: z.string().optional(),
  quantity: z.coerce.number().int().positive("Quantity must be at least 1"),
})

export const orderRequestSchema = z.object({
  full_name: z.string().trim().min(2, "Full name is required"),
  phone: z.string().trim().min(9, "Enter a valid phone number"),
  whatsapp_phone: z.string().trim().optional().or(z.literal("")),
  email: z.string().trim().email("Enter a valid email").optional().or(z.literal("")),
  company_name: z.string().trim().optional(),
  location: z.string().trim().optional(),
  items: z.array(orderItemSchema).min(1, "Add at least one item"),
  customer_description: z
    .string()
    .trim()
    .min(10, "Describe the colour, material, branding, sizes and placement of logos")
    .max(4000),
  preferred_deadline: z.string().optional(),
  delivery_location: z.string().trim().optional(),
})

export type OrderRequestFormInput = z.input<typeof orderRequestSchema>
export type OrderRequestInput = z.output<typeof orderRequestSchema>
