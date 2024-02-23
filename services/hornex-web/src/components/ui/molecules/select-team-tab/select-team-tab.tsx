import { Input } from '../../input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useForm, useFormContext } from 'react-hook-form';
import z from 'zod';

// create new dataloader here: mountTeam

// create form schema: mountTeamFormSchema

const SelectTeamTab = () => {
  // apply form schema here
  const form = useForm();

  const { control } = form;

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
            <form onSubmit={() => {}} className="space-y-4">
              <FormField
                name="member1"
                control={control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-title">Member 1</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="admin@hornex.gg"
                        {...field}
                        disabled
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>
              <FormField
                name="member2"
                control={control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-title">
                      Email of member 2
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="First member" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>
            </form>
          </Form>
        </div>
      </TabsContent>
      <TabsContent value="select-existing-team">
        <div>later...</div>
      </TabsContent>
    </Tabs>
  );
};
export default SelectTeamTab;
