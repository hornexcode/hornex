import { Input } from '../../input';
import { SelectTeamForm } from '../../organisms/select-team-form/select-team-form';
import { useToast } from '../../use-toast';
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
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import z from 'zod';

const { post: mountTeam } = dataLoader<{}, {}>('mountTeam');

const SelectTeamTab = () => {
  const { toast } = useToast();
  const { data } = useSession();
  // const { closeModal } = useModal();
  const form = useForm<z.infer<typeof mountTeamFormSchema>>({
    resolver: zodResolver(mountTeamFormSchema),
  });
  const { handleSubmit, control } = form;

  const submitHandler = async (data: z.infer<typeof mountTeamFormSchema>) => {
    try {
      const resp = await mountTeam({}, data);
      if (resp.error)
        return toast({ title: 'Error', description: resp.error.message });

      toast({
        title: 'Registration created',
        description: 'Registration created successfully.',
      });
      // closeModal();
    } catch (err) {
      return toast({
        title: 'Error creating your registration',
        description: JSON.stringify(err),
      });
    }
  };

  return (
    <Tabs defaultValue="mount-team" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="mount-team">Mount a team</TabsTrigger>
        <TabsTrigger value="select-existing-team">
          Select existing team
        </TabsTrigger>
      </TabsList>
      <TabsContent value="mount-team">
        <div className="p-3">
          <Form {...form}>
            <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
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

              <FormItem>
                <FormLabel className="text-title">Member 1</FormLabel>
                <FormControl>
                  <Input
                    placeholder={data?.user?.email || 'you@example.gg'}
                    disabled
                  />
                </FormControl>
              </FormItem>

              <FormField
                name="member_1_email"
                control={control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-title">
                      Email of member 2
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Second member" {...field} />
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
                    <FormLabel className="text-title">
                      Email of member 3
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Third member" {...field} />
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
                    <FormLabel className="text-title">
                      Email of member 4
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Fourth member" {...field} />
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
                    <FormLabel className="text-title">
                      Email of member 5
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Fifth member" {...field} />
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
        </div>
      </TabsContent>
      <TabsContent value="select-existing-team">
        <SelectTeamForm />
      </TabsContent>
    </Tabs>
  );
};
export default SelectTeamTab;
