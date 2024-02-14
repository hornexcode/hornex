import Button from '@/components/ui/atoms/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DatePicker } from '@/components/ui/date-picker';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { InputTime } from '@/components/ui/input-time';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { AppLayout } from '@/layouts';
import { zodResolver } from '@hookform/resolvers/zod';
import { PlusIcon } from '@radix-ui/react-icons';
import clsx from 'clsx';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const formSchema = z.object({
  game: z.enum(['league-of-legends']),
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  description: z.string().optional(),
  registration_start_date: z.date(),
  registration_end_date: z.date(),
  check_in_duration: z.number(),
  start_date: z.date(),
  end_date: z.date(),
  start_time: z.string(),
  end_time: z.string(),
  feature_image: z.string().optional(),
  is_entry_free: z.boolean(),
  entry_fee: z.number().optional(),
  prize_pool_enabled: z.boolean(),
  open_classification: z.boolean(),
  size: z.string(),
  team_size: z.string(),
  map: z.string().default('summoners-rift'),
  winners_prizes: z
    .array(
      z.object({
        place: z.number(),
        amount: z.number(),
        content: z.string().optional(),
      })
    )
    .optional(),
});

function TournamentsCreatePage() {
  return (
    <div className="container mx-auto pt-8">
      <div className="text-title mb-4 text-lg font-bold">Create Tournament</div>
      <div className="grid grid-cols-2">
        <div>
          <TournamentCreateForm />
        </div>
      </div>
    </div>
  );
}

function TournamentCreateForm() {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
    },
  });

  const { watch } = form;

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="game"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-title">Game</FormLabel>
              <FormControl>
                <Select {...field}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Choose a game" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="league-of-legends">
                      League of Legends
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormDescription>
                This is the game you are creating a tournament for.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-title">Name</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormDescription>
                This is name of your touranament.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-title">Description</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Describe your tournament or put any additional information here..."
                />
              </FormControl>
              <FormDescription>Any additional information.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="size"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-title">Tournament Size</FormLabel>
              <FormControl>
                <Select {...field}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="4" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="4">4</SelectItem>
                    <SelectItem value="8">8</SelectItem>
                    <SelectItem value="16">16</SelectItem>
                    <SelectItem value="32">32</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormDescription>
                This define how many teams can participate in the tournament.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="map"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-title">
                League of Legends Map
              </FormLabel>
              <FormControl>
                <Select {...field}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select the map" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="summoners-rift">
                      Summoners Rift
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormDescription>
                This is the map you are creating a tournament for.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="team_size"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-title">Team Size</FormLabel>
              <FormControl>
                <Select {...field}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="system">5</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormDescription>
                This is the required size of the team.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="start_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-title">
                  Tournament Start Date
                </FormLabel>
                <FormControl>
                  <DatePicker date={field.value} onSelect={field.onChange} />
                </FormControl>
                <FormDescription>
                  This define when the registration period will start.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="start_time"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-title">
                  Tournament Start Time
                </FormLabel>
                <FormControl>
                  <InputTime {...field} />
                </FormControl>
                <FormDescription>
                  This define when the registration period will end.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="end_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-title">
                  Tournament End Date
                </FormLabel>
                <FormControl>
                  <DatePicker date={field.value} onSelect={field.onChange} />
                </FormControl>
                <FormDescription>
                  This define when the registration period will start.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="end_time"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-title">
                  Tournament End Time
                </FormLabel>
                <FormControl>
                  <InputTime {...field} />
                </FormControl>
                <FormDescription>
                  This define when the registration period will end.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="registration_start_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-title">
                Registration Start Date
              </FormLabel>
              <FormControl>
                <DatePicker date={field.value} onSelect={field.onChange} />
              </FormControl>
              <FormDescription>
                This define when the registration period will start.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="registration_end_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-title">
                Registration End Date
              </FormLabel>
              <FormControl>
                <DatePicker date={field.value} onSelect={field.onChange} />
              </FormControl>
              <FormDescription>
                This define when the registration period will end.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="is_entry_free"
          render={({ field }) => (
            <FormItem className="border-light-dark flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel className="text-title">Is entry fee?</FormLabel>
                <FormDescription>
                  If checked, the tournament will be free to enter and no
                  payment will be needed.
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <div className="border-accent rounded-lg border">
          <FormField
            control={form.control}
            name="prize_pool_enabled"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between p-3 shadow-sm">
                <div className="space-y-0.5">
                  <FormLabel className="text-title">
                    Prize Pool based on registration entry fee
                  </FormLabel>
                  <FormDescription>
                    If enabled, the prize pool will be calculated based on the
                    registrations entry fee
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <div
            className={clsx('block space-y-3 p-3', {
              hidden: watch('prize_pool_enabled'),
            })}
          >
            <div className="border-accent space-y-3 rounded-lg border p-5">
              <div className="text-title">1# place prize</div>
              <FormItem className="flex flex-row items-center justify-between p-3 shadow-sm">
                <div className="space-y-0.5">
                  <FormLabel className="text-title">Custom</FormLabel>
                  <FormDescription>
                    If enabled, the prize pool will be calculated based on the
                    registrations entry fee
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch />
                </FormControl>
              </FormItem>
              <Input
                type="text"
                disabled
                placeholder="100"
                {...form.register('entry_fee')}
              />
              <Textarea placeholder="Description of the prize pool" />
            </div>
            <div className="border-accent space-y-3 rounded-lg border p-5">
              <div className="text-title">2# place prize</div>
              <FormItem className="flex flex-row items-center justify-between p-3 shadow-sm">
                <div className="space-y-0.5">
                  <FormLabel className="text-title">Custom</FormLabel>
                  <FormDescription>
                    If enabled, the prize pool will be calculated based on the
                    registrations entry fee
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch />
                </FormControl>
              </FormItem>
              <Input
                type="text"
                disabled
                placeholder="100"
                {...form.register('entry_fee')}
              />
              <Textarea placeholder="Description of the prize pool" />
            </div>
            <div className="border-accent flex items-center justify-center rounded-lg border p-5">
              <PlusIcon className="mr-4 h-6 w-6" />
              <div>Add 4# place</div>
            </div>
          </div>
        </div>

        <FormField
          control={form.control}
          name="is_entry_free"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <IsOpenClassificationCheckBox {...field} />
              </FormControl>
              <FormDescription>
                If disabled, the tournament will be private and only visible to
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="is_entry_free"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <AcceptTermsAndConditionsCheckBox {...field} />
              </FormControl>
              <FormDescription>
                If disabled, the tournament will be private and only visible to
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button size="mini" shape="rounded" type="submit">
          Submit
        </Button>
      </form>
    </Form>
  );
}

export function AcceptTermsAndConditionsCheckBox({ ...props }) {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox {...props} id="terms" />
      <label
        htmlFor="terms"
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        Accept terms and conditions
      </label>
    </div>
  );
}

export function IsOpenClassificationCheckBox({ ...props }) {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox {...props} id="terms" />
      <label
        htmlFor="terms"
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        Open classification
      </label>
    </div>
  );
}

TournamentsCreatePage.getLayout = (page: React.ReactElement) => {
  return <AppLayout>{page}</AppLayout>;
};

export default TournamentsCreatePage;
