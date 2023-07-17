'use client';
import Image from 'next/image';
import { GameList } from '@/components/games/game-list';
import { Team } from '@/types/team';
import LeagueOfLegends from '@/assets/images/hero/league-of-legends-icon.png';
import CsGo from '@/assets/images/hero/csgo-logo.png';
import Dota2 from '@/assets/images/hero/dota-logo.png';
import RocketLeague from '@/assets/images/hero/rl-logo.png';
import BullHorn from '@/assets/images/bull-horn.png';

import PickGameScreen from '@/assets/images/hero/pick-game.png';
import GameScreen from '@/assets/images/hero/game.png';
import TournamentScreen from '@/assets/images/hero/tournament.png';
import styles from './styles.module.scss';
import Button from '@/components/ui/button/button';

const team: Team = {
  id: '1',
  name: 'Team 1',
  ownerId: '1',
  gameId: 1
};

export default function HeroPage() {
  return (
    <main>
      <nav className="w-full border-b border-gray-800">
        <div className="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between p-4">
          <a href="/hero" className="flex items-center">
            <span className="self-center text-3xl font-bold tracking-tighter dark:text-white">
              Hornex.gg
            </span>
          </a>
          <div className="flex md:order-2">
            <button
              type="button"
              className="dark:bg-sky-00 mr-3 rounded-lg bg-sky-400 px-4 py-2 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-400 dark:hover:bg-sky-400/90 dark:focus:ring-sky-800 md:mr-0"
            >
              Start playing
            </button>
            <button
              data-collapse-toggle="navbar-sticky"
              type="button"
              className="inline-flex items-center rounded-lg p-2 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-300 dark:hover:bg-gray-700 dark:focus:ring-gray-600 md:hidden"
              aria-controls="navbar-sticky"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="h-6 w-6"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </button>
          </div>
          <div
            className="hidden w-full items-center justify-between md:order-1 md:flex md:w-auto"
            id="navbar-sticky"
          >
            <ul className="mt-4 flex flex-col rounded-lg border border-gray-100 p-4 font-medium dark:border-gray-700 md:mt-0 md:flex-row md:space-x-8 md:border-0  md:p-0">
              <li>
                <a
                  href="#home"
                  className="block rounded py-2 pl-3 pr-4 text-white md:bg-transparent md:p-0 md:text-sky-400"
                  aria-current="page"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#supported-games"
                  className="block rounded py-2 pl-3 pr-4 text-white hover:text-sky-400 md:p-0"
                >
                  Supported Games
                </a>
              </li>
              <li>
                <a
                  href="#how-to-play"
                  className="block rounded py-2 pl-3 pr-4 text-white hover:text-sky-400 md:p-0"
                >
                  How to play
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className="block rounded py-2 pl-3 pr-4 text-white hover:text-sky-400 md:p-0"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <section id="home">
        <div className="absolute inset-0 -z-10 h-full w-full bg-[url('http://localhost:3000/images/major.avif')] bg-cover bg-no-repeat">
          <div className="h-full w-full bg-dark/95" />
        </div>
        <div className="mx-auto max-w-screen-xl px-4 py-8 text-center lg:px-12 lg:py-16">
          <a
            href="#"
            className="mb-7 inline-flex items-center justify-between rounded-full bg-gray-100 px-1 py-1 pr-4 text-sm text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
            role="alert"
          >
            <span className="bg-primary-600 mr-3 rounded-full px-4 py-1.5 text-xs text-white">
              Coming soon
            </span>
            <span className="text-sm font-medium">Hx is launching soon. </span>
            <svg
              className="ml-2 h-5 w-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              ></path>
            </svg>
          </a>

          <div className="flex flex-col items-center">
            <Image src={BullHorn} alt="horn" width={250} height={250} />
          </div>
          <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 dark:text-white md:text-5xl lg:text-6xl">
            Compete in Tournaments within a few clicks
          </h1>
          <p className="mb-8 text-xl font-normal text-gray-500 dark:text-gray-400 sm:px-16 lg:text-xl xl:px-48">
            The newest online sports betting company. A trustable company that
            allow you to bet on your favorite e-sports.
          </p>
          <div className="mb-8 flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-x-4 sm:space-y-0 lg:mb-16">
            <a
              href="#"
              className="bg-primary-700 hover:bg-primary-800 focus:ring-primary-300 dark:focus:ring-primary-900 inline-flex items-center justify-center rounded-lg px-5 py-3 text-center text-base font-medium text-white focus:ring-4"
            >
              Learn more
              <svg
                className="-mr-1 ml-2 h-5 w-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </a>
            <a
              href="#"
              className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-5 py-3 text-center text-base font-medium text-gray-900 hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-800"
            >
              <svg
                className="-ml-1 mr-2 h-5 w-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z"></path>
              </svg>
              Watch video
            </a>
          </div>
        </div>
        <div className="mx-auto p-6 text-center md:max-w-screen-md lg:max-w-screen-lg lg:px-36">
          <span className="font-semibold uppercase text-gray-400">
            SUPPORTED GAMES
          </span>
          <div className="mt-8 grid grid-cols-2 items-center justify-between text-gray-500 md:grid-cols-4">
            <a
              href="#"
              className="mb-5 mr-5 hover:text-gray-800 dark:hover:text-gray-400 lg:mb-0"
            >
              <Image
                src={LeagueOfLegends}
                className={styles.image}
                alt="League of Legends icon"
                width={150}
                height={150}
              />
            </a>
            <a
              href="#"
              className="mb-5 mr-5 hover:text-gray-800 dark:hover:text-gray-400 lg:mb-0"
            >
              <Image
                src={CsGo}
                className={styles.image}
                alt="Counter Strike Global Offensive icon"
                width={150}
                height={150}
              />
            </a>
            <a
              href="#"
              className="mb-5 mr-5 hover:text-gray-800 dark:hover:text-gray-400 lg:mb-0"
            >
              <Image
                src={Dota2}
                className={styles.image}
                alt="Counter Strike Global Offensive icon"
                width={150}
                height={150}
              />
            </a>
            <a
              href="#"
              className="mb-5 mr-5 hover:text-gray-800 dark:hover:text-gray-400 lg:mb-0"
            >
              <Image
                src={RocketLeague}
                className={styles.image}
                alt="Counter Strike Global Offensive icon"
                width={150}
                height={150}
              />
            </a>
          </div>
        </div>
      </section>

      <section id="supported-games"></section>

      <section className="border-t border-gray-800 "></section>

      <section className="text-slate-300" id="how-to-play">
        <div className="container mx-auto p-6 py-14 text-center">
          <h2 className="mb-20 text-4xl font-extrabold leading-none tracking-tight dark:text-white md:text-5xl">
            How to play?
          </h2>

          <div className="container">
            <div className="grid grid-cols-1 items-center gap-y-16 md:grid-cols-2 md:gap-y-32">
              <div className="block skew-y-6 rounded border border-gray-800 shadow-2xl md:ml-10 md:w-[500px] md:skew-y-12">
                <Image
                  src={PickGameScreen}
                  alt="League of Legends icon"
                  width={500}
                />
              </div>
              <div>
                <h3 className="mb-2 text-3xl font-bold tracking-tighter text-white">
                  Pick a game
                </h3>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin
                  id risus ut ante ultrices varius vel nec ante. Proin accumsan
                  aliquam lorem, quis pulvinar enim tempus vitae. Nam efficitur
                  purus eros, a rhoncus nisl sollicitudin auctor. Donec in
                  fermentum velit, nec feugiat nibh. Maecenas nec ligula at
                  ligula blandit consequat. Phasellus sodales dolor id enim
                  fringilla sollicitudin. Morbi tempus convallis augue, id
                  auctor nulla efficitur ac.
                </p>
              </div>

              <div className="block skew-y-6 rounded border border-gray-800 shadow-2xl md:hidden">
                <Image
                  src={GameScreen}
                  alt="League of Legends icon"
                  width={500}
                />
              </div>

              <div>
                <h3 className="mb-2 text-3xl font-bold tracking-tighter text-white">
                  Chose a tournament
                </h3>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin
                  id risus ut ante ultrices varius vel nec ante. Proin accumsan
                  aliquam lorem, quis pulvinar enim tempus vitae. Nam efficitur
                  purus eros, a rhoncus nisl sollicitudin auctor. Donec in
                  fermentum velit, nec feugiat nibh. Maecenas nec ligula at
                  ligula blandit consequat. Phasellus sodales dolor id enim
                  fringilla sollicitudin. Morbi tempus convallis augue, id
                  auctor nulla efficitur ac.
                </p>
              </div>

              <div className="hidden w-[500px] skew-y-12 rounded border border-gray-800 shadow-2xl md:ml-56 md:block">
                <Image
                  src={GameScreen}
                  alt="League of Legends icon"
                  width={500}
                />
              </div>

              <div className="block skew-y-6 rounded border border-gray-800 shadow-2xl md:ml-10 md:w-[500px] md:skew-y-12">
                <Image
                  src={TournamentScreen}
                  alt="League of Legends icon"
                  width={500}
                />
              </div>
              <div>
                <h3 className="mb-2 text-3xl font-bold tracking-tighter text-white">
                  Start to play
                </h3>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin
                  id risus ut ante ultrices varius vel nec ante. Proin accumsan
                  aliquam lorem, quis pulvinar enim tempus vitae. Nam efficitur
                  purus eros, a rhoncus nisl sollicitudin auctor. Donec in
                  fermentum velit, nec feugiat nibh. Maecenas nec ligula at
                  ligula blandit consequat. Phasellus sodales dolor id enim
                  fringilla sollicitudin. Morbi tempus convallis augue, id
                  auctor nulla efficitur ac.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto p-6 py-14 text-center">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded p-6 text-left">
              <h2 className="mb-10 text-3xl font-bold tracking-tighter text-white">
                Tournaments
              </h2>

              <h4 className="text-xl font-bold text-white">About</h4>
              <p className="text-md mb-8 leading-7 tracking-wide">
                A tournament is a competition involving a relatively large
                amount of teams competing against each other. The competition
                can be open by any team and the winner will be the team that
                wins the most matches.
              </p>
              <h4 className="text-xl font-bold text-white">Price Pool</h4>
              <div className="pl-6 leading-7 tracking-wide">
                <ul className="list-disc">
                  <li>
                    The competition has the final price pool according to the
                    number of teams participating
                  </li>
                  <li>
                    The price pool will be divided between the 3 best teams
                  </li>
                  <li>
                    Each team will receive a percentage of the total price pool
                    according to their final position
                  </li>
                </ul>
              </div>
            </div>

            <div className="rounded p-6 text-left">
              <h2 className="mb-4 text-3xl font-bold tracking-tighter text-white">
                Arena Battle
              </h2>
              <p className="text-md leading-7 tracking-wide">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum,
                quasi! Voluptas rerum, harum porro modi soluta atque beatae
                iusto illo aliquam similique totam nostrum earum neque incidunt
                quidem reprehenderit,
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="" id="contact">
        <div className="container mx-auto max-w-screen-md p-6 px-4 py-14 lg:py-16">
          <h2 className="mb-4 text-center text-4xl font-extrabold leading-none tracking-tight dark:text-white md:text-5xl">
            Contact Us
          </h2>

          <p className="mb-8 text-center font-light sm:text-xl lg:mb-16">
            Got a technical issue? Want to send feedback about a beta feature?
            Need details about our Business plan? Let us know.
          </p>
          <form action="#" className="space-y-8">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Your email
              </label>
              <input
                type="email"
                id="email"
                className="focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-500 dark:focus:border-primary-500 dark:shadow-sm-light block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                placeholder="name@hornex.gg"
                required
              />
            </div>
            <div>
              <label
                htmlFor="subject"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Subject
              </label>
              <input
                type="text"
                id="subject"
                className="focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-500 dark:focus:border-primary-500 dark:shadow-sm-light block w-full rounded-lg border border-gray-300 bg-gray-50 p-3 text-sm text-slate-300 shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                placeholder="Let us know how we can help you"
                required
              />
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="message"
                className="mb-2 block text-sm font-medium text-gray-300"
              >
                Your message
              </label>
              <textarea
                id="message"
                rows={6}
                className="focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-500 dark:focus:border-primary-500 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                placeholder="Leave a comment..."
              ></textarea>
            </div>
            <Button
              type="submit"
              className="rounded-lg bg-sky-400/90 px-5 py-3 text-center text-sm font-medium text-white hover:bg-sky-400 focus:outline-none focus:ring-4 focus:ring-sky-300 sm:w-fit"
            >
              Send message
            </Button>
          </form>
        </div>
      </section>

      <footer className="mx-auto border-t border-gray-800 bg-white p-6 dark:bg-gray-900 md:p-14">
        <div className="mx-auto w-full max-w-screen-xl">
          <div className="grid grid-cols-2 gap-6 py-6 md:grid-cols-6">
            <div className="col-span-2">
              <h2 className="mb-6 text-sm font-semibold uppercase text-gray-900 dark:text-white">
                Hornex.gg
              </h2>
              <ul className="font-medium text-gray-500 dark:text-gray-400">
                <li className="mb-4">
                  <a href="#" className="hover:underline">
                    623 Harrison St., 2nd Floor,
                    <br />
                    San Francisco, CA 94107
                  </a>
                </li>
                <li className="mb-4">
                  <a href="#" className="hover:underline">
                    415-201-6370
                  </a>
                </li>
                <li className="mb-4">
                  <a href="#" className="hover:underline">
                    hello@hornex.gg
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="mb-6 text-sm font-semibold uppercase text-gray-900 dark:text-white">
                Company
              </h2>
              <ul className="font-medium text-gray-500 dark:text-gray-400">
                <li className="mb-4">
                  <a href="#" className=" hover:underline">
                    About
                  </a>
                </li>
                <li className="mb-4">
                  <a href="#" className="hover:underline">
                    Careers
                  </a>
                </li>
                <li className="mb-4">
                  <a href="#" className="hover:underline">
                    Brand Center
                  </a>
                </li>
                <li className="mb-4">
                  <a href="#" className="hover:underline">
                    Blog
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="mb-6 text-sm font-semibold uppercase text-gray-900 dark:text-white">
                Help center
              </h2>
              <ul className="font-medium text-gray-500 dark:text-gray-400">
                <li className="mb-4">
                  <a href="#" className="hover:underline">
                    Discord Server
                  </a>
                </li>
                <li className="mb-4">
                  <a href="#" className="hover:underline">
                    Twitter
                  </a>
                </li>
                <li className="mb-4">
                  <a href="#" className="hover:underline">
                    Facebook
                  </a>
                </li>
                <li className="mb-4">
                  <a href="#" className="hover:underline">
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="mb-6 text-sm font-semibold uppercase text-gray-900 dark:text-white">
                Account
              </h2>
              <ul className="font-medium text-gray-500 dark:text-gray-400">
                <li className="mb-4">
                  <a href="#" className="hover:underline">
                    Create account
                  </a>
                </li>
                <li className="mb-4">
                  <a href="#" className="hover:underline">
                    Sign in
                  </a>
                </li>
                <li className="mb-4">
                  <a href="#" className="hover:underline">
                    Manage Account
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="mb-6 text-sm font-semibold uppercase text-gray-900 dark:text-white">
                Legal
              </h2>
              <ul className="font-medium text-gray-500 dark:text-gray-400">
                <li className="mb-4">
                  <a href="#" className="hover:underline">
                    Privacy Policy
                  </a>
                </li>
                <li className="mb-4">
                  <a href="#" className="hover:underline">
                    Licensing
                  </a>
                </li>
                <li className="mb-4">
                  <a href="#" className="hover:underline">
                    Terms &amp; Conditions
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mx-auto border-t border-gray-800 px-4 py-6 md:flex md:items-center md:justify-between">
            <span className="text-sm text-gray-500 dark:text-gray-300 sm:text-center">
              © 2023 <a href="/hero">Hornex.gg™</a>
              <br />
              All Rights Reserved.
            </span>
            <div className="mt-4 flex space-x-5 sm:justify-center md:mt-0">
              <a
                href="#"
                className="text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                <svg
                  className="h-4 w-4"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 8 19"
                >
                  <path
                    fill-rule="evenodd"
                    d="M6.135 3H8V0H6.135a4.147 4.147 0 0 0-4.142 4.142V6H0v3h2v9.938h3V9h2.021l.592-3H5V3.591A.6.6 0 0 1 5.592 3h.543Z"
                    clip-rule="evenodd"
                  />
                </svg>
                <span className="sr-only">Facebook page</span>
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                <svg
                  className="h-4 w-4"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 21 16"
                >
                  <path d="M16.942 1.556a16.3 16.3 0 0 0-4.126-1.3 12.04 12.04 0 0 0-.529 1.1 15.175 15.175 0 0 0-4.573 0 11.585 11.585 0 0 0-.535-1.1 16.274 16.274 0 0 0-4.129 1.3A17.392 17.392 0 0 0 .182 13.218a15.785 15.785 0 0 0 4.963 2.521c.41-.564.773-1.16 1.084-1.785a10.63 10.63 0 0 1-1.706-.83c.143-.106.283-.217.418-.33a11.664 11.664 0 0 0 10.118 0c.137.113.277.224.418.33-.544.328-1.116.606-1.71.832a12.52 12.52 0 0 0 1.084 1.785 16.46 16.46 0 0 0 5.064-2.595 17.286 17.286 0 0 0-2.973-11.59ZM6.678 10.813a1.941 1.941 0 0 1-1.8-2.045 1.93 1.93 0 0 1 1.8-2.047 1.919 1.919 0 0 1 1.8 2.047 1.93 1.93 0 0 1-1.8 2.045Zm6.644 0a1.94 1.94 0 0 1-1.8-2.045 1.93 1.93 0 0 1 1.8-2.047 1.918 1.918 0 0 1 1.8 2.047 1.93 1.93 0 0 1-1.8 2.045Z" />
                </svg>
                <span className="sr-only">Discord community</span>
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                <svg
                  className="h-4 w-4"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 17"
                >
                  <path
                    fill-rule="evenodd"
                    d="M20 1.892a8.178 8.178 0 0 1-2.355.635 4.074 4.074 0 0 0 1.8-2.235 8.344 8.344 0 0 1-2.605.98A4.13 4.13 0 0 0 13.85 0a4.068 4.068 0 0 0-4.1 4.038 4 4 0 0 0 .105.919A11.705 11.705 0 0 1 1.4.734a4.006 4.006 0 0 0 1.268 5.392 4.165 4.165 0 0 1-1.859-.5v.05A4.057 4.057 0 0 0 4.1 9.635a4.19 4.19 0 0 1-1.856.07 4.108 4.108 0 0 0 3.831 2.807A8.36 8.36 0 0 1 0 14.184 11.732 11.732 0 0 0 6.291 16 11.502 11.502 0 0 0 17.964 4.5c0-.177 0-.35-.012-.523A8.143 8.143 0 0 0 20 1.892Z"
                    clip-rule="evenodd"
                  />
                </svg>
                <span className="sr-only">Twitter page</span>
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                <svg
                  className="h-4 w-4"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 .333A9.911 9.911 0 0 0 6.866 19.65c.5.092.678-.215.678-.477 0-.237-.01-1.017-.014-1.845-2.757.6-3.338-1.169-3.338-1.169a2.627 2.627 0 0 0-1.1-1.451c-.9-.615.07-.6.07-.6a2.084 2.084 0 0 1 1.518 1.021 2.11 2.11 0 0 0 2.884.823c.044-.503.268-.973.63-1.325-2.2-.25-4.516-1.1-4.516-4.9A3.832 3.832 0 0 1 4.7 7.068a3.56 3.56 0 0 1 .095-2.623s.832-.266 2.726 1.016a9.409 9.409 0 0 1 4.962 0c1.89-1.282 2.717-1.016 2.717-1.016.366.83.402 1.768.1 2.623a3.827 3.827 0 0 1 1.02 2.659c0 3.807-2.319 4.644-4.525 4.889a2.366 2.366 0 0 1 .673 1.834c0 1.326-.012 2.394-.012 2.72 0 .263.18.572.681.475A9.911 9.911 0 0 0 10 .333Z"
                    clip-rule="evenodd"
                  />
                </svg>
                <span className="sr-only">GitHub account</span>
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                <svg
                  className="h-4 w-4"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 0a10 10 0 1 0 10 10A10.009 10.009 0 0 0 10 0Zm6.613 4.614a8.523 8.523 0 0 1 1.93 5.32 20.094 20.094 0 0 0-5.949-.274c-.059-.149-.122-.292-.184-.441a23.879 23.879 0 0 0-.566-1.239 11.41 11.41 0 0 0 4.769-3.366ZM8 1.707a8.821 8.821 0 0 1 2-.238 8.5 8.5 0 0 1 5.664 2.152 9.608 9.608 0 0 1-4.476 3.087A45.758 45.758 0 0 0 8 1.707ZM1.642 8.262a8.57 8.57 0 0 1 4.73-5.981A53.998 53.998 0 0 1 9.54 7.222a32.078 32.078 0 0 1-7.9 1.04h.002Zm2.01 7.46a8.51 8.51 0 0 1-2.2-5.707v-.262a31.64 31.64 0 0 0 8.777-1.219c.243.477.477.964.692 1.449-.114.032-.227.067-.336.1a13.569 13.569 0 0 0-6.942 5.636l.009.003ZM10 18.556a8.508 8.508 0 0 1-5.243-1.8 11.717 11.717 0 0 1 6.7-5.332.509.509 0 0 1 .055-.02 35.65 35.65 0 0 1 1.819 6.476 8.476 8.476 0 0 1-3.331.676Zm4.772-1.462A37.232 37.232 0 0 0 13.113 11a12.513 12.513 0 0 1 5.321.364 8.56 8.56 0 0 1-3.66 5.73h-.002Z"
                    clip-rule="evenodd"
                  />
                </svg>
                <span className="sr-only">Dribbble account</span>
              </a>
            </div>
          </div>
          <p className="p-6 md:px-16 md:text-center">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin id
            risus ut ante ultrices varius vel nec ante. Proin accumsan aliquam
            lorem, quis pulvinar enim tempus vitae. Nam efficitur purus eros, a
            rhoncus nisl sollicitudin auctor. Donec in fermentum velit, nec
            feugiat nibh. Maecenas nec ligula at ligula blandit consequat.
            Phasellus sodales dolor id enim fringilla sollicitudin. Morbi tempus
            convallis augue, id auctor nulla efficitur ac.
          </p>
        </div>
      </footer>
    </main>
  );
}
