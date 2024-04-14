import { TournamentRegistrationForm } from './tournament-registration-form';
import { Tournament } from '@/lib/models/Tournament';
import type { Meta, StoryObj } from '@storybook/react';
import { SessionProvider } from 'next-auth/react';

const meta = {
  title: 'v2/TournamentRegistrationForm',
  component: TournamentRegistrationForm,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {},
  decorators: [
    (Story) => (
      <SessionProvider
        session={{
          user: { name: 'test-user' },
          expires: Date.now().toString(),
        }}
      >
        <Story />
      </SessionProvider>
    ),
  ],
} satisfies Meta<typeof TournamentRegistrationForm>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default: Story = {
  // wrap component with nextauth js provider
  args: {
    tournament: { id: 'test-id', name: 'test-tournament' } as Tournament,
  },
};
