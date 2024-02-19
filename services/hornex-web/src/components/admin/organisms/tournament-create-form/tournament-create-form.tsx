import { createFormSchema } from './tournament-create-form.schema';
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
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { PlusIcon, TrashIcon } from '@radix-ui/react-icons';
import clsx from 'clsx';
import { useFieldArray, useForm } from 'react-hook-form';
import z from 'zod';

export function TournamentCreateForm() {
  // 1. Define your form.
  const form = useForm<z.infer<typeof createFormSchema>>({
    resolver: zodResolver(createFormSchema),
    defaultValues: {
      name: '',
    },
  });

  const { register, control, handleSubmit, watch, setValue } = form;

  const { fields, remove, append } = useFieldArray({
    name: 'prizes',
    control,
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof createFormSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 pb-10">
        <FormField
          control={control}
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
          control={control}
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
          control={control}
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
          control={control}
          name="size"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-title">Tournament Size</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
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
          control={control}
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
          control={control}
          name="team_size"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-title">Team Size</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
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
        <div className="grid grid-cols-2">
          <FormField
            control={control}
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
            control={control}
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
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={control}
            name="start_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-title">Start Date</FormLabel>
                <FormControl>
                  <DatePicker date={field.value} onSelect={field.onChange} />
                </FormControl>
                <FormDescription>
                  The date the tournament will start
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="start_time"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-title">Start Time</FormLabel>
                <FormControl>
                  <InputTime {...field} />
                </FormControl>
                <FormDescription>
                  The time the tournament will start
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={control}
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
            control={control}
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
          control={control}
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
            control={control}
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
                    disabled={watch('is_entry_free')}
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
            {fields.map((fld, index) => {
              return (
                <div
                  className="border-accent space-y-3 rounded-lg border p-5"
                  key={fld.id}
                >
                  <div className="text-title">{fld.place}# place prize</div>
                  <FormItem className="flex flex-row items-center justify-between p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel className="text-title">Custom</FormLabel>
                      <FormDescription>
                        If enabled, the prize pool will be calculated based on
                        the registrations entry fee
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        onCheckedChange={(val) =>
                          setValue(`prizes.${index}.custom` as const, !val)
                        }
                        {...register(`prizes.${index}.custom` as const)}
                      />
                    </FormControl>
                  </FormItem>
                  <Input
                    type="text"
                    disabled={watch(`prizes.${index}.custom` as const)}
                    placeholder="100"
                    {...register(`prizes.${index}.amount` as const)}
                  />
                  <Textarea
                    placeholder="Description of the prize pool"
                    {...register(`prizes.${index}.content`)}
                  />
                  <button
                    type="button"
                    className="border-accent hover:text-title flex w-full items-center justify-center rounded-lg border p-5 text-sm text-red-500 transition-all hover:bg-red-500"
                    onClick={() => remove(index)}
                  >
                    <TrashIcon className="mr-2 h-4 w-4" />
                    Remove
                  </button>
                </div>
              );
            })}
            <button
              type="button"
              className="border-accent flex w-full items-center justify-center rounded-lg border p-5 text-sm"
              onClick={() =>
                append({
                  custom: true,
                  place: fields.length + 1,
                  amount: 0,
                  content: '',
                })
              }
            >
              <PlusIcon className="mr-2 h-4 w-4" />
              <div>Add {fields.length + 1}# place</div>
            </button>
          </div>
        </div>

        <FormField
          control={control}
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
          control={control}
          name="is_entry_free"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <AcceptTermsAndConditionsCheckBox {...field} />
              </FormControl>
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
      <Checkbox
        onCheckedChange={props.onchange}
        value={props.value}
        id="terms"
      />
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
      <Checkbox
        onCheckedChange={props.onChange}
        value={props.value}
        id="terms"
      />
      <label
        htmlFor="terms"
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        Open classification
      </label>
    </div>
  );
}
