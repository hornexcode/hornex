import Button from '../../atoms/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Tournament } from '@/lib/models/Tournament';
import { dataLoader } from '@/lib/request';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import React, { FC, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const registerFormSchema = z.object({
  team_name: z.string(),
  player1: z.object({
    nickname: z.string(),
    email: z.string().email(),
  }),
  player2: z.object({
    nickname: z.string(),
    email: z.string().email(),
  }),
  player3: z.object({
    nickname: z.string(),
    email: z.string().email(),
  }),
  player4: z.object({
    nickname: z.string(),
    email: z.string().email(),
  }),
  player5: z.object({
    nickname: z.string(),
    email: z.string().email(),
  }),
});

const { submit: registerTeamHandler } = dataLoader<
  undefined,
  z.infer<typeof registerFormSchema>
>('registerTeam');

export type TeamRegisterFormProps = {
  tournament: Tournament;
  onSuccessCallback: () => void;
};

const TeamRegisterForm: FC<TeamRegisterFormProps> = ({
  tournament,
  onSuccessCallback,
}) => {
  const { replace } = useRouter();
  const { data: session } = useSession();
  const email = session?.user?.email || '';
  if (!session || !email) {
    replace('/signin');
  }

  const [isFetching, setIsFetching] = useState(false);

  const form = useForm<z.infer<typeof registerFormSchema>>({
    resolver: zodResolver(registerFormSchema),
  });

  const { control, handleSubmit, setValue } = form;

  // set the email of the player1
  useEffect(() => {
    setValue('player1.email', email);
  }, []);

  const onSubmit = async (values: z.infer<typeof registerFormSchema>) => {
    setIsFetching(true);

    const { error } = await registerTeamHandler(
      { tournamentId: tournament.id },
      {
        ...values,
        ...{ player1: { email, nickname: values.player1.nickname } },
      }
    );

    setIsFetching(false);

    if (error) {
      console.error(error);
      return;
    }

    onSuccessCallback?.();
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 pb-10">
        <FormField
          control={control}
          name="team_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="">Team name</FormLabel>
              <FormControl>
                <Input placeholder="Team name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="">
          <FormLabel className="text-title font-bold">
            {session?.user?.name || 'Player 1'}
          </FormLabel>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={control}
              name="player1.nickname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="">Summoner name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your summoner name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className="">
          <FormLabel className="text-title font-bold">Player 2</FormLabel>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={control}
              name="player2.nickname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="">Summoner name</FormLabel>
                  <FormControl>
                    <Input placeholder="Summoner name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="player2.email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-title">Email</FormLabel>
                  <FormControl>
                    <Input placeholder="First member" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className="">
          <FormLabel className="text-title font-bold">Player 3</FormLabel>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={control}
              name="player3.nickname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="">Summoner name</FormLabel>
                  <FormControl>
                    <Input placeholder="Summoner name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="player3.email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-title">Email</FormLabel>
                  <FormControl>
                    <Input placeholder="First member" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className="">
          <FormLabel className="text-title font-bold">Player 4</FormLabel>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={control}
              name="player4.nickname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="">Summoner name</FormLabel>
                  <FormControl>
                    <Input placeholder="Summoner name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="player4.email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-title">Email</FormLabel>
                  <FormControl>
                    <Input placeholder="First member" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className="">
          <FormLabel className="text-title font-bold">Player 5</FormLabel>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={control}
              name="player5.nickname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="">Summoner name</FormLabel>
                  <FormControl>
                    <Input placeholder="Summoner name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="player5.email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-title">Email</FormLabel>
                  <FormControl>
                    <Input placeholder="First member" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div>
          {' '}
          <Button
            isLoading={isFetching}
            disabled={isFetching || !form.formState.isValid}
            shape="rounded"
            type="submit"
            className="w-full"
          >
            Submit
          </Button>
          <p className="text-body font-semibold">
            By clicking Submit you agree to our terms and conditions.
          </p>
        </div>
      </form>
    </Form>
  );
};

export default TeamRegisterForm;
