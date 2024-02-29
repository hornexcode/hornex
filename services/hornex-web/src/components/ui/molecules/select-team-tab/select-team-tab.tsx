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

const { post: createAndRegisterTeam } = dataLoader<
  any,
  z.infer<typeof mountTeamFormSchema>
>('createAndRegisterTeam');

const SelectTeamTab = () => {
  const { toast } = useToast();
  const { closeModal } = useModal();

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
      closeModal();
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
      <TabsList className="bg-dark grid w-full grid-cols-2">
        <TabsTrigger value="mount-team">Mount a team</TabsTrigger>
        <TabsTrigger value="select-existing-team">
          Select existing team
        </TabsTrigger>
      </TabsList>
      <TabsContent value="mount-team">
        <div className="p-3">
          <Form {...form}>
            <form onSubmit={handleSubmit(submitHandler)} className="space-y-6">
              <FormField
                name="name"
                control={control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-title">Team name</FormLabel>
                    <FormControl>
                      <Input placeholder="Krox Guild" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="member_1_email"
                control={control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-title">Second Player</FormLabel>
                    <FormControl>
                      <Input placeholder="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="member_2_email"
                control={control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-title">Third Player</FormLabel>
                    <FormControl>
                      <Input placeholder="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="member_3_email"
                control={control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-title">Fourth Player</FormLabel>
                    <FormControl>
                      <Input placeholder="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="member_4_email"
                control={control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-title">Fifth Player</FormLabel>
                    <FormControl>
                      <Input placeholder="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button size="small" shape="rounded" type="submit">
                Submit
              </Button>
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
