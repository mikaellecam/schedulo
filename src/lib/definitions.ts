import {z} from "zod";

export const emailSchema = z.string().email();
export const passwordSchema = z.string().min(6);

export const userSchema = z.object({
    id: z.string(),
    email: z.string().email(),
    name: z.string(),
    calendar_url: z.string(),
});

export const dataBaseUserSchema = z.object({
    email: z.string().email(),
    newPassword: z.string(),
    name: z.string(),
    calendar_url: z.string(),
});

