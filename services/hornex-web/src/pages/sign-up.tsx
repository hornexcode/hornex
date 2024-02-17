import Button from '@/components/ui/atoms/button';
import { Logo } from '@/components/ui/atoms/logo';
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
import { useToast } from '@/components/ui/use-toast';
import { User } from '@/lib/models';
import { dataLoader } from '@/lib/request';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const registerForm = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2),
});

const { post: signUp } = dataLoader<User, z.infer<typeof registerForm>>(
  'signUp'
);

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof registerForm>>({
    resolver: zodResolver(registerForm),
    defaultValues: {
      email: '',
      password: '',
      name: '',
    },
  });

  const { control, setError } = form;

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof registerForm>) {
    setLoading(true);

    const { data: user, error } = await signUp({}, values);
    if (error) {
      const { email, password, name } = error?.response;
      if (email) {
        setError('email', { message: email });
      }
      if (password) {
        setError('password', { message: password });
      }
      if (name) {
        setError('name', { message: name });
      }
      setLoading(false);
    }

    if (user && !error) {
      setLoading(false);
      toast({
        title: 'Account created.',
        description: "We've created your account for you.",
      });
      router.push('/sign-in');
    }
  }

  return (
    <div className="flex h-screen flex-col items-center justify-between">
      <div className="m-auto w-[450px] ">
        <Logo size="sm" className="mx-auto mb-4" />
        <div className="bg-medium-dark border-accent space-y-4 rounded border p-6 sm:p-8 md:space-y-6">
          <div className="text-center">
            <h1 className="font-title text-title text-lg font-bold md:text-2xl">
              Sign Up
            </h1>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="example@hornex.gg" {...field} />
                    </FormControl>
                    <FormDescription>
                      We will never share your email with anyone else.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full"
                shape="rounded"
                size="small"
                isLoading={loading}
              >
                Submit
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
