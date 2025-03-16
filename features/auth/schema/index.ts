import { z } from 'zod';

export const LoginFormSchema = z.object({
  email: z.string().toLowerCase().email({ message: 'Email krävs' }),
  password: z.string().trim().min(1, { message: 'Lösenord krävs' }),
});

export const RegisterRequestSchema = LoginFormSchema.and(
  z.object({
    displayName: z
      .string()
      .trim()
      .regex(new RegExp('^[a-zA-Z0-9åäöÅÄÖ]*$'), { message: 'Bara a-ö' })
      .min(3, { message: 'Minst 3 bokstäver lång' }),
  })
);

export const RegisterFormSchema = RegisterRequestSchema.and(
  z.object({
    confirmPassword: z.string().min(1, { message: 'Bekräftning krävs' }),
    agreeToTerms: z.boolean(),
  })
)
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Lösenorden matchar inte',
  })
  .refine((data) => data.agreeToTerms === true, {
    path: ['agreeToTerms'],
    message: 'Du måste godkänna användarvillkoren',
  });

export type RegisterFormValues = z.infer<typeof RegisterFormSchema>;
export type LoginFormValues = z.infer<typeof LoginFormSchema>;
