import face from '@/assets/images/face.jpg';
import HornexLogo from '@/assets/images/hornex/hornex-logo.png';
import TournamentDetailsTemplate from '@/components/templates/tournament-details-template';
import { TournamentStatus } from '@/components/tournaments/tournament';
import TournamentCardAttr from '@/components/tournaments/tournament-list-item/tournament-card-attr';
import { TournamentTabs } from '@/components/tournaments/tournament-tabs';
import Button from '@/components/ui/button/button';
import { SwordsIcon } from '@/components/ui/icons';
import { AppLayout } from '@/layouts';
import { MapPinIcon, TrophyIcon, UsersIcon } from '@heroicons/react/20/solid';
import Image from 'next/image';
import { useState } from 'react';

type TournamentProps = {
  params: {
    id: string;
  };
};

export default function Tournament({ params }: TournamentProps) {
  // TODO: add switch to render different types of tournament template
  return <TournamentDetailsTemplate />;
}

Tournament.getLayout = (page: React.ReactElement) => {
  return <AppLayout>{page}</AppLayout>;
};
