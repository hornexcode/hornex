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
import { MoneyInput } from '@/components/ui/input-money';
import { InputTime } from '@/components/ui/input-time';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
// import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { dataLoader } from '@/lib/request';
import { zodResolver } from '@hookform/resolvers/zod';
import { PlusIcon, TrashIcon } from '@radix-ui/react-icons';
import clsx from 'clsx';
import moment from 'moment';
import { useRouter } from 'next/router';
import { useFieldArray, useForm } from 'react-hook-form';
import z from 'zod';

const { post: createTournament } = dataLoader<{}, {}>('createTournament');

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
      // map: 'summoners-rift',
      description: '',
    },
  });

  const { register, control, handleSubmit, watch } = form;
  const { fields, remove, append } = useFieldArray({
    name: 'prizes',
    control,
  });

  async function onSubmit(values: z.infer<typeof createFormSchema>) {
    try {
      const resp = await createTournament(
        {},
        {
          ...values,
          start_date: moment(values.start_date).format('YYYY-MM-DD'),
        }
      );

      if (resp.error)
        return toast({ title: 'Error', description: resp.error.message });

      toast({
        title: 'Tournament created',
        description: 'Tournament created successfully.',
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
                {/* <FormDescription>
                  This define when the registration period will start.
                </FormDescription> */}
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
                {/* <FormDescription>
                  The date the tournament will start
                </FormDescription> */}
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
                  <Input {...field} type="time" />
                </FormControl>
                {/* <FormDescription>
                  The time the tournament will start
                </FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

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

        <div
          className={clsx('block space-y-3', {
            hidden: watch('prize_pool_enabled'),
          })}
        >
          {fields.map((fld, index) => (
            <div
              className="border-border space-y-3 rounded-lg border p-5"
              key={fld.id}
            >
              <div className="flex items-center justify-between">
                <div className="text-title">{fld.place}# place prize</div>
                <button
                  className=""
                  type="button"
                  onClick={() => remove(index)}
                >
                  <TrashIcon className="mr-2 h-5 w-5 text-red-500" />
                </button>
              </div>
              <Textarea
                placeholder="Prizer description"
                {...register(`prizes.${index}.content`)}
              />
            </div>
          ))}
        </div>

        <div className="block">
          <div>Prizes</div>
          <div
            className="border-border flex justify-center rounded border px-3 py-2"
            onClick={() =>
              append({
                place: fields.length + 1,
                content: '',
              })
            }
          >
            <div className="flex items-center">
              {' '}
              <PlusIcon className="mr-2 h-4 w-4" />
              <div>Add {fields.length + 1}# place</div>
            </div>
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
