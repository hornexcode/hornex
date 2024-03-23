'use client';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Profile, profileSchema } from '@/lib/models/Profile';
import { dataLoader } from '@/lib/request';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { Pencil1Icon, PlusIcon } from '@radix-ui/react-icons';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';

const { submit: createProfile } = dataLoader<Profile, Profile>('createProfile');
const { submit: updateProfile } = dataLoader<Profile, Partial<Profile>>(
  'updateProfile'
);

const ProfileForm = ({ profile: initialProfile }: { profile?: Profile }) => {
  const [profile, setProfile] = useState(initialProfile);

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      twitch_username: profile?.twitch_username,
      discord_invite_code: profile?.discord_invite_code,
      discord_widget_id: profile?.discord_widget_id,
      twitter_username: profile?.twitter_username,
    },
  });

  const { control, handleSubmit, reset } = form;

  const [twitchUsernameEditable, setTwitchUsernameEditable] = useState(false);
  const [discordWidgetIdEditable, setDiscordWidgetIdEditable] = useState(false);
  const [discordInviteCodeEditable, setDiscordInviteCodeEditable] =
    useState(false);
  const [twitterUsernameEditable, setTwitterUsernameEditable] = useState(false);

  const isEditing =
    twitchUsernameEditable ||
    discordWidgetIdEditable ||
    discordInviteCodeEditable ||
    twitterUsernameEditable;

  const onResetFormHandler = () => {
    setTwitchUsernameEditable(false);
    setTwitterUsernameEditable(false);
    setDiscordWidgetIdEditable(false);
    setDiscordInviteCodeEditable(false);
  };

  async function onCreateProfileHandler(form: z.infer<typeof profileSchema>) {
    const { data, error } = await createProfile({}, form);
    if (error) {
      console.error(error);
      toast('Error creating profile. Please try again.', {});
    }
    if (data) {
      setProfile(data);
      toast('Profile success created', {});
    }
  }

  async function onUpdateProfileHandler(form: z.infer<typeof profileSchema>) {
    const { data, error } = await updateProfile({}, form);
    if (error) {
      console.error(error);
      toast('Error updating profile. Please try again.', {});
    }
    if (data) {
      setProfile(data);
      toast('Profile success updated');
    }
  }

  const onSubmitHandler = async (form: z.infer<typeof profileSchema>) => {
    if (profile) {
      await onUpdateProfileHandler(form);
    } else {
      await onCreateProfileHandler(form);
    }
    onResetFormHandler();
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmitHandler)} className="space-y-4">
        <div className="border-border bg-light-dark space-y-4 rounded border p-6">
          <h4 className="font-bold">Twitch Username</h4>
          <div
            className={cn(
              'flex items-center',
              twitchUsernameEditable && 'hidden'
            )}
          >
            <div className="mr-10">{profile?.twitch_username}</div>
            <Button
              size={'sm'}
              onClick={(e) => {
                e.preventDefault();
                setTwitchUsernameEditable(true);
              }}
            >
              <Pencil1Icon className="mr-2" />
              Edit
            </Button>
          </div>
          <div
            className={cn(
              'hidden items-center space-x-2',
              twitchUsernameEditable && 'flex'
            )}
          >
            <FormField
              control={control}
              name="twitch_username"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input className="w-full sm:w-[300px]" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className="border-border bg-light-dark space-y-4 rounded border p-6">
          <h4 className="font-bold">Discord Widget ID</h4>
          <div
            className={cn(
              'flex items-center',
              discordWidgetIdEditable && 'hidden'
            )}
          >
            <div className="mr-4">{form.getValues('discord_widget_id')}</div>
            <Button
              size={'sm'}
              onClick={(e) => {
                e.preventDefault();
                setDiscordWidgetIdEditable(true);
              }}
            >
              <Pencil1Icon className="mr-2" />
              Edit
            </Button>
          </div>
          <div
            className={cn(
              'hidden items-center space-x-2',
              discordWidgetIdEditable && 'flex'
            )}
          >
            <FormField
              control={control}
              name="discord_widget_id"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input className="w-full sm:w-[300px]" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className="border-border bg-light-dark space-y-4 rounded border p-6">
          <h4 className="font-bold">Discord Invite Code</h4>
          <div
            className={cn(
              'flex items-center',
              discordInviteCodeEditable && 'hidden'
            )}
          >
            {profile?.discord_invite_code && (
              <div className="mr-4">
                {form.getValues('discord_invite_code')}
              </div>
            )}

            <Button
              size={'sm'}
              onClick={(e) => {
                e.preventDefault();
                setDiscordInviteCodeEditable(true);
              }}
            >
              {profile?.discord_invite_code ? (
                <Pencil1Icon className="mr-2" />
              ) : (
                <PlusIcon className="mr-2" />
              )}
              {profile?.discord_invite_code ? 'Edit' : 'Add'}
            </Button>
          </div>
          <div
            className={cn(
              'hidden items-center space-x-2',
              discordInviteCodeEditable && 'flex'
            )}
          >
            <FormField
              control={control}
              name="discord_invite_code"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input className="w-full sm:w-[300px]" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className="border-border bg-light-dark space-y-4 rounded border p-6">
          <h4 className="font-bold">Twitter Username</h4>
          <div
            className={cn(
              'flex items-center',
              twitterUsernameEditable && 'hidden'
            )}
          >
            <div className="mr-4">{form.getValues('twitter_username')}</div>
            <Button
              size={'sm'}
              onClick={(e) => {
                e.preventDefault();
                setTwitterUsernameEditable(true);
              }}
            >
              <Pencil1Icon className="mr-2" />
              Edit
            </Button>
          </div>
          <div
            className={cn(
              'hidden items-center space-x-2',
              twitterUsernameEditable && 'flex'
            )}
          >
            <FormField
              control={control}
              name="twitter_username"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input className="w-full sm:w-[300px]" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div
          className={cn(
            'bg-light-dark flex items-center p-6',
            profile && !isEditing && 'hidden'
          )}
        >
          <div className="mr-10 font-medium">Save profile settings</div>

          <Button
            className="bg-brand text-dark mr-4 hover:bg-amber-500"
            type="submit"
            size={'sm'}
          >
            {profile ? 'Save changes' : 'Create profile'}
          </Button>
          <Button
            onClick={(e) => {
              e.preventDefault();
              onResetFormHandler();
              reset({
                twitch_username: profile?.twitch_username,
                discord_widget_id: profile?.discord_widget_id,
                discord_invite_code: profile?.discord_invite_code,
                twitter_username: profile?.twitter_username,
              });
            }}
            variant={'ghost'}
            size={'sm'}
            className={cn(!profile && 'hidden')}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProfileForm;
