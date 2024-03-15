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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { dataLoader } from '@/lib/request';
import { zodResolver } from '@hookform/resolvers/zod';
import { TrashIcon } from '@radix-ui/react-icons';
import clsx from 'clsx';
import moment from 'moment';
import { useRouter } from 'next/router';
import { useFieldArray, useForm } from 'react-hook-form';
import z from 'zod';

const { submit: createTournament } = dataLoader<{}, {}>('createTournament');

export function TournamentCreateForm() {
  const { toast } = useToast();
  const router = useRouter();
  // 1. Define your form.
  const form = useForm<z.infer<typeof createFormSchema>>({
    resolver: zodResolver(createFormSchema),
    defaultValues: {
      name: '',
      is_entry_free: true,
      open_classification: true,
      terms: false,
      game: 'league-of-legends',
      team_size: '5',
      size: '4',
      description: '',
    },
  });

  const { register, control, handleSubmit, watch, setError } = form;
  const { fields, remove, append } = useFieldArray({
    name: 'prizes',
    control,
  });

  async function onSubmit(values: z.infer<typeof createFormSchema>) {
    try {
      const { error } = await createTournament(
        {},
        {
          ...values,
          start_date: moment(values.start_date).format('YYYY-MM-DD'),
        }
      );

      if (error) {
        if (error.validations) {
          for (const key in error.validations) {
            // @ts-ignore
            setError(key, {
              message: error.validations[key],
            });
          }

          return toast({
            title: 'Error creating tournament',
            description: 'Please check the form for errors.',
          });
        }
        toast({
          title: 'Error creating tournament',
          description: error.message,
          variant: 'destructive',
        });
        return;
      }

      toast({
        title: 'Tournament created',
        description: 'Tournament created successfully.',
        variant: 'success',
      });

      return router.push('/admin/tournaments');
    } catch (err) {
      return toast({
        title: 'Error creating tournament',
        description: JSON.stringify(err),
      });
    }
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
                <Select onValueChange={field.onChange} value={field.value}>
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
              {/* <FormDescription>
                This is the game you are creating a tournament for.
              </FormDescription> */}
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
                <Input {...field} />
              </FormControl>
              <FormDescription>Name your tournament.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* <FormField
          control={control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-title">Description</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /> */}
        <FormField
          control={control}
          name="size"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-title">Number of teams</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a size" />
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
                The number of teams allowed to enter the tournament. E.g 4, 8,
                16, and 32.
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
                    <SelectItem value="5">5</SelectItem>
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
                The registration period goes from registration start date to
                tournament start date
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

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
                We recomend to set a date at least 1 week from now.
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
                {/* <InputTime {...field} /> */}
                <Input {...field} type="time" className="w-[100px]" />
              </FormControl>
              <FormDescription>
                Different timezones are not supported yet. The time will be set
                in UTC.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* <FormField
          control={control}
          name="is_entry_free"
          render={({ field }) => (
            <FormItem className="border-border flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel className="text-title">Is entry free?</FormLabel>
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
        /> */}

        {/* <FormField
          control={control}
          name="entry_fee"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-title">Entry Fee</FormLabel>
              <FormControl>
                <MoneyInput
                  {...field}
                  value={watch('is_entry_free') ? 0.0 : field.value}
                  placeholder="R$ 10,00"
                  disabled={watch('is_entry_free')}
                  // Brazilian currency config
                  locales="pt-BR"
                  options={{
                    currency: 'BRL',
                    currencyDisplay: 'symbol',
                    currencySign: 'standard',
                    style: 'currency',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }}
                />
              </FormControl>
              <FormDescription>
                This is the charging value for enter the tournament.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        /> */}

        {/* <div className="border-border rounded-lg border">
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
                    checked={!watch('is_entry_free') ? field.value : false}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div> */}

        <div className="bg-medium-dark p-4">
          <h4 className="text-title font-bold">Prizes</h4>
          <div
            className={clsx('block space-y-3', {
              hidden: watch('prize_pool_enabled'),
            })}
          >
            {fields.map((fld, index) => (
              <div className="" key={fld.id}>
                <FormItem>
                  <FormLabel className="text-title">
                    {fld.place}# place prize
                  </FormLabel>
                  <button
                    className=""
                    type="button"
                    onClick={() => remove(index)}
                  >
                    <TrashIcon className="mr-2 h-5 w-5 text-red-500" />
                  </button>
                  <Textarea
                    placeholder="Prizer description"
                    {...register(`prizes.${index}.content`)}
                  />
                  <FormControl>{/* <InputTime {...field} /> */}</FormControl>
                  {/* <FormDescription>
                  The time the tournament will start
                </FormDescription> */}
                  <FormMessage />
                </FormItem>
                <div className="flex items-center justify-between">
                  <div className="text-title"></div>
                </div>
              </div>
            ))}
            <Button
              size="mini"
              shape="rounded"
              color="danger"
              className="border-border text-dark rounded border px-3 py-2"
              onClick={(e) => {
                e.preventDefault();
                append({
                  place: fields.length + 1,
                  content: '',
                });
              }}
            >
              Add {fields.length + 1}# place
            </Button>
          </div>
        </div>

        {/* <FormField
          control={control}
          name="open_classification"
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
        /> */}
        {/* <FormField
          control={control}
          name="terms"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <AcceptTermsAndConditionsCheckBox {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /> */}
        <Button size="small" shape="rounded" type="submit">
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
        onCheckedChange={props.onChange}
        value={props.value}
        id="terms"
      />
      <label
        htmlFor="terms"
        className="text-title font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
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
        ref={props.ref}
        name={props.name}
        onCheckedChange={props.onChange}
        value={props.value}
        id="open_classification"
      />
      <label
        htmlFor="open_classification"
        className="text-title font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        Open classification
      </label>
    </div>
  );
}
