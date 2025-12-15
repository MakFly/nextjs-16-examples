import { z } from 'zod';

export const userSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  age: z.number().min(13, {
    message: "You must be at least 13 years old.",
  }).max(120, {
    message: "Age must be less than 120.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message: "Password must contain at least one lowercase letter, one uppercase letter, and one number.",
  }),
  confirmPassword: z.string(),
  website: z.string().url({
    message: "Please enter a valid URL.",
  }).optional().or(z.literal("")),
  bio: z.string().max(500, {
    message: "Bio must not exceed 500 characters.",
  }).optional(),
  interests: z.array(z.string()).min(1, {
    message: "Please select at least one interest.",
  }),
  newsletter: z.boolean().default(false),
  terms: z.boolean().refine(val => val === true, {
    message: "You must accept the terms and conditions.",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type UserFormData = z.infer<typeof userSchema>;

export const blogPostSchema = z.object({
  title: z.string().min(5, {
    message: "Title must be at least 5 characters.",
  }).max(100, {
    message: "Title must not exceed 100 characters.",
  }),
  slug: z.string().min(3, {
    message: "Slug must be at least 3 characters.",
  }).regex(/^[a-z0-9-]+$/, {
    message: "Slug can only contain lowercase letters, numbers, and hyphens.",
  }),
  content: z.string().min(10, {
    message: "Content must be at least 10 characters.",
  }),
  excerpt: z.string().max(200, {
    message: "Excerpt must not exceed 200 characters.",
  }).optional(),
  published: z.boolean().default(false),
  tags: z.array(z.string()).max(5, {
    message: "You can add up to 5 tags.",
  }),
  publishedAt: z.date().optional(),
});

export type BlogPostFormData = z.infer<typeof blogPostSchema>;