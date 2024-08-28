import {z} from "zod";

export const nameSchema = z.string().min(1);
export const passwordSchema = z.string().min(6);
export const calendar_urlSchema = z.string().url();

export const registrationFormSchema = z.object({
    name: nameSchema,
    password: passwordSchema,
    calendar_url: calendar_urlSchema,
});

export const loginFormSchema = z.object({
    name: nameSchema,
    password: passwordSchema,
});

export const userSchema = z.object({
    id: z.string(),
    name: z.string(),
    calendar_url: z.string(),
});

export const dataBaseUserSchema = z.object({
    name: nameSchema,
    calendar_url: calendar_urlSchema,
    newPassword: passwordSchema,
});

