'use client';
import Image from 'next/image';
import { Team } from '@/types/team';
import LeagueOfLegends from '@/assets/images/hero/league-of-legends-icon.png';
import CsGo from '@/assets/images/hero/csgo-logo.png';
import Dota2 from '@/assets/images/hero/dota-logo.png';
import RocketLeague from '@/assets/images/hero/rl-logo.png';
import BullHorn from '@/assets/images/bull-horn.png';

import PickGameScreen from '@/assets/images/hero/pick-game.png';
import GameScreen from '@/assets/images/hero/game.png';
import TournamentScreen from '@/assets/images/hero/tournament.png';
import {
  ArrowRightOnRectangleIcon,
  ArrowUturnRightIcon,
  LinkIcon,
} from '@heroicons/react/20/solid';
import Link from 'next/link';
import routes from '@/config/routes';

const team: Team = {
  id: '1',
  name: 'Team 1',
  ownerId: '1',
  gameId: 1,
};

export default function HomePage() {
  return (
    <main className="">
      <div className="bg-red-600 py-1 text-center">
        <span className="text-xs text-white">
          We are still developing this platform, Hornex is lunching soon...
        </span>
      </div>
      <nav className="w-full border-b border-slate-700 bg-dark/75">
        <div className="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between p-4">
          <a href="/hero" className="flex items-center">
            <span className="self-center text-2xl font-bold tracking-tighter dark:text-white md:text-3xl">
              Hornex
            </span>
          </a>
          <div className="flex items-center gap-4 md:order-2 md:gap-8">
            <a href="#" className="flex items-center text-white">
              Login
              <ArrowRightOnRectangleIcon className="ml-2 w-4" />
            </a>
            <Link
              href={'/register'}
              className="rounded bg-sky-400/90 px-4 py-2 font-medium tracking-tight text-white hover:bg-sky-400 focus:ring-2"
            >
              Register now
            </Link>
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
                  fillRule="evenodd"
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

      <section id="home" className="h-[calc(100vh-68px)] bg-dark/75">
        {/* <div className="absolute inset-0 top-0 -z-10 h-full w-full bg-[url('http://localhost:3000/images/major.avif')] bg-cover bg-no-Hornex">
          <div className="h-full w-full bg-dark/95" />
        </div> */}

        <video
          className="absolute top-0 -z-10 h-full w-full object-cover object-center"
          preload="metadata"
          data-object-fit="cover"
          autoPlay
          loop
          muted
          playsInline
          data-object-position="center center"
        >
          <source
            src="/videos/hero-0632cbf2872c5cc0dffa93d2ae8a29e8.webm"
            type="video/webm"
          />
          <source
            src="/videos/hero-de0ba45b1d0959277d12545fbb645722.mp4"
            type="video/mp4"
          />
        </video>

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
                fillRule="evenodd"
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
            The newest online sports tournaments company. A trustable company
            that allow you to compete on your favorite e-sports.
          </p>
          <div className="flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-x-4 sm:space-y-0">
            <a
              href="#"
              className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-5 py-3 text-center text-base font-medium text-gray-900 hover:border-sky-400 hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 dark:border-white dark:text-white dark:hover:bg-sky-400 dark:focus:ring-sky-600"
            >
              Play now
              <svg
                className="-mr-1 ml-2 h-5 w-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </a>
            {/* <a
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
            </a> */}
          </div>
        </div>
      </section>

      <section id="supported-games" className="bg-dark py-14 md:py-28">
        <div className="container mx-auto text-center">
          <h2 className="mb-8 text-4xl font-extrabold leading-none tracking-tight dark:text-white  md:text-5xl">
            Supported Games
          </h2>

          <div className="flex items-center justify-evenly px-2 text-gray-500">
            <a
              href="#"
              className="p-2 hover:text-gray-800 dark:hover:text-gray-400 md:p-0"
            >
              <Image
                src={LeagueOfLegends}
                className="contrast-0"
                alt="League of Legends icon"
                width={150}
                height={150}
              />
            </a>
            <a
              href="#"
              className="p-2 hover:text-gray-800 dark:hover:text-gray-400 md:p-0"
            >
              <Image
                src={CsGo}
                className="contrast-0"
                alt="Counter Strike Global Offensive icon"
                width={150}
                height={150}
              />
            </a>
            <a
              href="#"
              className="p-2 hover:text-gray-800 dark:hover:text-gray-400 md:p-0"
            >
              <Image
                src={Dota2}
                className="contrast-0"
                alt="Counter Strike Global Offensive icon"
                width={150}
                height={150}
              />
            </a>
            <a
              href="#"
              className="p-2 hover:text-gray-800 dark:hover:text-gray-400 md:p-0"
            >
              <Image
                src={RocketLeague}
                className="contrast-0"
                alt="Counter Strike Global Offensive icon"
                width={150}
                height={150}
              />
            </a>
          </div>
        </div>
      </section>

      <section
        className="bg-light-dark py-14 text-slate-300 md:py-28"
        id="how-to-play"
      >
        <div className="container mx-auto grid md:grid-cols-2">
          <div className="space-y-12 px-4 text-center md:text-left">
            <h2 className="text-4xl font-extrabold leading-none tracking-tight dark:text-white md:text-5xl">
              {' '}
              Play Unlimited Tournaments{' '}
            </h2>
            <p className="font-light sm:text-xl md:w-[500px]">
              On Hornex you can play in an unlimited number of tournaments with
              your team. All the results are automatically updated on the
              platform and we are going to ensure a fair competition.
            </p>

            <div>
              <Link
                href={'/register'}
                className="rounded bg-sky-400/90 px-4 py-2 font-medium tracking-tight text-white hover:bg-sky-400 focus:ring-2"
              >
                Register now
              </Link>
            </div>
          </div>
          <div className="relative hidden px-4 md:block">
            <div className="absolute left-0 top-0 rounded border border-slate-700">
              <Image
                src={GameScreen}
                className="rounded"
                alt="Pick Game Screen"
              />
            </div>
            <div className="absolute -left-10 top-40 w-[80%] rounded border border-slate-700">
              <Image
                src={PickGameScreen}
                className="rounded"
                alt="Pick Game Screen"
              />
            </div>
          </div>
        </div>
      </section>

      <section id="automatedResultTracking" className="bg-dark py-14 md:py-28">
        <div className="container mx-auto space-y-12 px-4 text-center">
          <h2 className="mb-4 text-center text-4xl font-extrabold leading-none tracking-tight dark:text-white md:text-5xl">
            Automated Result Tracking
          </h2>
          <p className="mx-auto mb-8 text-center font-light sm:text-xl md:w-[500px]">
            Once you have connected your game account to Hornex Profile you are
            good to go. Everything afterwards is on us, no downloads and no
            match & result submission.
          </p>
          <div className="mx-auto hidden w-[50%] rounded border border-slate-700 md:block">
            <Image
              src={TournamentScreen}
              className="rounded"
              alt="Pick Game Screen"
            />
          </div>
        </div>
      </section>

      {/* <section className="bg-sky-500 py-28" id="contact">
        <div className="container mx-auto max-w-screen-md p-6">
          <h2 className="mb-4 text-center text-4xl font-extrabold leading-none tracking-tight dark:text-white md:text-5xl">
            Contact Us
          </h2>

          <p className="mb-8 text-center font-light text-white sm:text-xl lg:mb-16">
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
                className="dark:shadow-sm-light dark:white block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 shadow-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 dark:focus:border-sky-500 dark:focus:ring-sky-500"
                placeholder="name@hornex.com"
                required
              />
            </div>
            <div>
              <label
                htmlFor="subject"
                className="mb-2 block text-sm font-medium text-white"
              >
                Subject
              </label>
              <input
                type="text"
                id="subject"
                className="dark:shadow-sm-light block w-full rounded-lg border border-gray-300 bg-gray-50 p-3 text-sm text-white shadow-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500 dark:border-sky-400 dark:bg-white dark:text-white dark:placeholder-gray-400 dark:focus:border-sky-500 dark:focus:ring-sky-500"
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
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 shadow-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500 dark:border-sky-400 dark:bg-white dark:text-white dark:placeholder-gray-400 dark:focus:border-sky-500 dark:focus:ring-sky-500"
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
      </section> */}

      <footer className="mx-auto border-t border-gray-800 bg-white p-6 dark:bg-gray-900 md:p-14">
        <div className="mx-auto w-full max-w-screen-xl">
          <div className="grid grid-cols-2 gap-6 py-6 md:grid-cols-6">
            <div className="col-span-2">
              <h2 className="mb-6 text-sm font-semibold uppercase text-gray-900 dark:text-white">
                Hornex
              </h2>
              <ul className="font-medium text-gray-500 dark:text-gray-400">
                <li className="mb-4">
                  <a
                    href="https://www.google.com/maps/place/R.+Dailton+Fernandes+de+Carvalho,+32+-+S%C3%A3o+Pedro,+Barra+Mansa+-+RJ,+27340-010/@-22.5741039,-44.172524,17z/data=!3m1!4b1!4m6!3m5!1s0x9e9c2765cde3fb:0xe14e22a0f778d62b!8m2!3d-22.5741039!4d-44.172524!16s%2Fg%2F11c2gymxc8?entry=ttu"
                    className="hover:underline"
                  >
                    R. Dailton Fernandes de Carvalho, 32
                    <br />
                    Rio de Janeiro, Brasil - CEP 27340-010
                  </a>
                </li>
                <li className="mb-4">
                  <a
                    target="_blank"
                    href="tel:+55(24)981655545"
                    className="hover:underline"
                  >
                    +55 (24) 98165-5545
                  </a>
                </li>
                <li className="mb-4">
                  <a
                    href="mailto:pedro357bm@gmail.com"
                    className="hover:underline"
                  >
                    pedro357bm@gmail.com
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
                  <Link href={routes.contactUs} className="hover:underline">
                    Contact Us
                  </Link>
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
                    Login
                  </a>
                </li>
                <li className="mb-4">
                  <a href="#" className="hover:underline">
                    Register
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
                  <Link href={routes.privacyPolicy} className="hover:underline">
                    Privacy Policy
                  </Link>
                </li>
                <li className="mb-4">
                  <Link href={routes.termsOfUse} className="hover:underline">
                    Terms &amp; Conditions
                  </Link>
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
              </ul>
            </div>
          </div>
          <div className="mx-auto border-t border-gray-800 px-4 py-6 md:flex md:items-center md:justify-between">
            <span className="text-sm text-gray-500 dark:text-gray-300 sm:text-center">
              © 2023 <a href="/hero">Hornex™</a>
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
                    fillRule="evenodd"
                    d="M20 1.892a8.178 8.178 0 0 1-2.355.635 4.074 4.074 0 0 0 1.8-2.235 8.344 8.344 0 0 1-2.605.98A4.13 4.13 0 0 0 13.85 0a4.068 4.068 0 0 0-4.1 4.038 4 4 0 0 0 .105.919A11.705 11.705 0 0 1 1.4.734a4.006 4.006 0 0 0 1.268 5.392 4.165 4.165 0 0 1-1.859-.5v.05A4.057 4.057 0 0 0 4.1 9.635a4.19 4.19 0 0 1-1.856.07 4.108 4.108 0 0 0 3.831 2.807A8.36 8.36 0 0 1 0 14.184 11.732 11.732 0 0 0 6.291 16 11.502 11.502 0 0 0 17.964 4.5c0-.177 0-.35-.012-.523A8.143 8.143 0 0 0 20 1.892Z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="sr-only">Twitter page</span>
              </a>
            </div>
          </div>
          <p className="p-6 md:px-16 md:text-center">
            Hornex is not endorsed by, directly affiliated with, maintained or
            sponsored by Apple Inc, Electronic Arts, Activision Blizzard,
            Take-Two Interactive, Riot Games, Microsoft, Xbox or Epic Games. All
            content, games titles, trade names and/or trade dress, trademarks,
            artwork and associated imagery are trademarks and/or copyright
            material of their respective owners.
          </p>
        </div>
      </footer>
    </main>
  );
}
