import TournamentDetailsBody from '../../molecules/tournament-detail-body/tournament-details-body';
import TournamentDetailsWidgets from '../../molecules/tournament-details-widgets';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import TournamentDetailsHeadline from '@/components/ui/molecules/tournament-details-headline';
import { useTournament } from '@/contexts';
import { FC } from 'react';

type TournamentDetailsTemplateProps = {
  participantCheckedInStatus?: boolean;
};

const TournamentDetailsTemplate: FC<TournamentDetailsTemplateProps> = ({}) => {
  const { tournament, isRegistered } = useTournament();

  return (
    <div className="mx-auto px-8 pt-8">
      {/* breadcrumb */}
      <div className="mb-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hover:text-title">
              <BreadcrumbLink href="/compete">Compete</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{tournament.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* headline */}
      <TournamentDetailsHeadline isCheckedIn={false} />

      <div className="mt-8 flex space-x-8">
        <TournamentDetailsWidgets
          tournament={tournament}
          registered={isRegistered}
        />
        <TournamentDetailsBody />
      </div>
    </div>
  );
};

export default TournamentDetailsTemplate;
