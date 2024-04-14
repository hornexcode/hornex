'use client';

import { registerTeamFormSchema, TournamentRegistrationFormProps } from '.';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { FC } from 'react';
import { Form, useForm } from 'react-hook-form';
import z from 'zod';

export const TournamentRegistrationForm: FC<
  TournamentRegistrationFormProps
> = ({ tournament }) => {
  const form = useForm<z.infer<typeof registerTeamFormSchema>>({
    resolver: zodResolver(registerTeamFormSchema),
    defaultValues: {
      tournament_id: tournament.id,
    },
  });

  const { handleSubmit, control } = form;

  function onSubmitHandler(data: z.infer<typeof registerTeamFormSchema>) {
    console.log(data);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(onSubmitHandler)}
        className="space-y-8 rounded-lg pb-10"
      >
        <FormField
          control={control}
          name="tournament_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="">Tournament</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};
