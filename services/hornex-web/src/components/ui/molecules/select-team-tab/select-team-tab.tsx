import { Input } from '../../input';
import { SelectTeamForm } from '../../organisms/select-team-form/select-team-form';
import { useToast } from '../../use-toast';
import { useModal } from '@/components/modal-views/context';
import Button from '@/components/ui/atoms/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { mountTeamFormSchema } from '@/components/ui/molecules/select-team-tab';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { dataLoader } from '@/lib/request';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import z from 'zod';

const { submit: createAndRegisterTeam } = dataLoader<
  any,
  z.infer<typeof mountTeamFormSchema>
>('createAndRegisterTeam');

const SelectTeamTab = () => {
  const { toast } = useToast();
  const { closeModal } = useModal();
  const router = useRouter();

  const form = useForm<z.infer<typeof mountTeamFormSchema>>({
    resolver: zodResolver(mountTeamFormSchema),
  });

  const { handleSubmit, control } = form;

  const {
    query: { id },
  } = useRouter();

  const submitHandler = async (data: z.infer<typeof mountTeamFormSchema>) => {
    try {
      const resp = await createAndRegisterTeam(
        {
          tournamentId: id,
        },
        data
      );
      if (resp.error)
        return toast({ title: 'Error', description: resp.error.message });

      toast({
        title: 'Registration created',
        description: 'Registration created successfully.',
      });

      router.reload();
    } catch (err) {
      console.log(err);
      return toast({
        title: 'Error creating your registration',
        description: JSON.stringify(err),
      });
    }
  };

  return (
    <Tabs defaultValue="mount-team" className="w-full !shadow-none">
      <TabsList className="bg-medium-dark grid w-full grid-cols-2">
        <TabsTrigger className="text-lg font-bold" value="mount-team">
          Mount a team
        </TabsTrigger>
        <TabsTrigger
          className="text-lg font-bold"
          disabled
          value="select-existing-team"
        >
          Select existing team
        </TabsTrigger>
      </TabsList>
      <TabsContent value="mount-team">
        <div className="p-3">
          <Form {...form}>
            <form onSubmit={handleSubmit(submitHandler)} className="space-y-3">
              <FormField
                name="name"
                control={control}
                render={({ field }) => (
                  <FormItem className="flex items-center">
                    <FormLabel className="text-title w-1/3 text-lg font-bold">
                      Team name:
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="text-lg"
                        placeholder="Krox Guild"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="member_1_email"
                control={control}
                render={({ field }) => (
                  <FormItem className="flex items-center">
                    <FormLabel className="text-title w-1/3 text-lg font-bold">
                      2 player
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="text-lg"
                        placeholder="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="member_2_email"
                control={control}
                render={({ field }) => (
                  <FormItem className="flex items-center">
                    <FormLabel className="text-title w-1/3 text-lg font-bold">
                      3 player
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="text-lg"
                        placeholder="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="member_3_email"
                control={control}
                render={({ field }) => (
                  <FormItem className="flex items-center">
                    <FormLabel className="text-title w-1/3 text-lg font-bold">
                      4 player
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="text-lg"
                        placeholder="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="member_4_email"
                control={control}
                render={({ field }) => (
                  <FormItem className="flex items-center">
                    <FormLabel className="text-title w-1/3 text-lg font-bold">
                      5 player
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="text-lg"
                        placeholder="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-center justify-end pt-4">
                <Button
                  onClick={() => {
                    closeModal();
                  }}
                  shape="rounded"
                  variant="transparent"
                  color="gray"
                  className="mr-4 text-lg"
                >
                  Cancel
                </Button>
                <Button shape="rounded" className="text-lg" type="submit">
                  Submit
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </TabsContent>
      <TabsContent value="select-existing-team">
        <SelectTeamForm />
      </TabsContent>
    </Tabs>
  );
};
export default SelectTeamTab;
