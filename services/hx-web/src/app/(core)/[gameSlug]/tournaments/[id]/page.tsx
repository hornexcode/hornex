"use client";
import classnames from "classnames";
import { useState } from "react";
import TournamentFooter from "@/components/tournaments/tournament-footer";
import face from "@/assets/images/face.jpg";
import { TournamentPhases } from "@/components/tournaments/tournament-phases";
import { TournamentTabs } from "@/components/tournaments/tournament-tabs";
import TournamentDetails from "@/components/tournaments/tournament-details/tournament-details";
import Button from "@/components/ui/button/button";
import TournamentCardAttr from "@/components/tournaments/tournament-list-item/tournament-card-attr";
import { MapPinIcon, TrophyIcon, UsersIcon } from "@heroicons/react/20/solid";
import { TournamentStatus } from "@/components/tournaments/tournament";
import { SwordsIcon } from "@/components/ui/icons";

type TournamentProps = {
  params: {
    id: string;
  };
};

export default function Tournament({ params }: TournamentProps) {
  const [isJoined, setJoin] = useState(false);
  const joinTournament = () => setJoin(!isJoined);

  const [creator] = useState({
    name: "@ShadowSlayer",
    logo: face,
  });

  return (
    <div className="">
      <section className="h-[250px]">
        <div className="group relative flex h-full items-end bg-gradient-to-br from-sky-400 to-sky-300">
          <figure className="flex h-full w-full flex-col justify-end bg-[url('http://localhost:3000/images/sion.jpg')] bg-cover bg-no-repeat"></figure>
          <div className="absolute -bottom-[200px] left-4 h-[240px] w-56 rounded-lg bg-light-dark"></div>
        </div>
      </section>

      <section className="space-y-4 divide-y divide-slate-800 p-8 pl-64">
        <div className="flex justify-between">
          {/* tournament name and due date */}
          <div>
            <span className="text-sm">SEP 02 - Starting at 06:00 PM (-3)</span>
            <h1 className="leading-1 text-2xl font-extrabold tracking-tighter text-white">
              LOL: Platinum Tournament 2023
            </h1>
          </div>

          <div className="flex items-end">
            <div className="flex flex-col justify-end pr-4 text-left">
              <p className="text-xs">Registration ends in:</p>
              <p className="text-white">5d 23:20:12</p>
            </div>
            <div className="w-64 border-l border-slate-800 pl-4">
              <TournamentStatus />
            </div>
          </div>
        </div>

        {/* tournament attrs list */}
        <div className="flex justify-between py-4">
          {/* tournament actions sidebar */}

          <div className="flex items-center space-x-8">
            <TournamentCardAttr
              icon={<TrophyIcon className="h-4 w-4" />}
              value="1500 BRL"
              attr="Prize Pool"
            />
            <TournamentCardAttr
              icon={<UsersIcon className="h-4 w-4" />}
              value="16"
              attr="Teams"
            />
            <TournamentCardAttr
              icon={<MapPinIcon className="h-4 w-4" />}
              value="Sum. Rift"
              attr="Prize Pool"
            />
          </div>

          <div className="flex w-64 items-start">
            <div className="w-full space-y-2 border-l border-slate-800 pl-6">
              <Button
                className="w-full"
                size="small"
                color="danger"
                shape="rounded"
              >
                <div className="flex items-center">
                  Join Tournament
                  <SwordsIcon className="ml-2 h-4 w-4 fill-slate-100" />
                </div>
              </Button>
            </div>
          </div>
        </div>
      </section>
      <section className=" p-8">
        <TournamentTabs />
      </section>
    </div>
  );
}
