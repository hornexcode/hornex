import z from 'zod';

export const PayRegistrationParams = z.object({
  registration: z.string().uuid(),
  name: z.string(),
  cpf: z.string().regex(/^\d{11}$/, { message: 'CPF inválido' }),
});
export type payRegistrationParams = z.infer<typeof PayRegistrationParams>;
