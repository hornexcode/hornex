import FreeFireLogo from '@/assets/images/games/free-fire/logo.png';
import LeagueOfLegendsLogo from '@/assets/images/games/league-of-legends/logo.png';
import CsGoLogo from '@/assets/images/hero/csgo-logo.png';
import RocketLeagueLogo from '@/assets/images/hero/rl-logo.png';
import BullHorn from '@/assets/images/hornex/hornex-logo.png';
import Tournament from '@/assets/images/tournaments/tournament.png';
import Button from '@/components/ui/atoms/button/button';
import routes from '@/config/routes';
import { useAuthContext } from '@/lib/auth/auth-context';
import {
  ArrowRightOnRectangleIcon,
  ArrowUpRightIcon,
} from '@heroicons/react/20/solid';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function HomePage() {
  const router = useRouter();

  const { state, logout } = useAuthContext();
  if (state.isAuthenticated) {
    router.push(routes.compete);
  }

  return (
    <main className="">
      {/* <div className="bg-amber-500 py-1 text-center">
        <span className="text-xs text-white">
          We are still developing this platform, Hornex is lunching soon...
        </span>
      </div> */}
      <nav className="bg-dark/40 fixed top-0 z-10 w-full border-b border-slate-700">
        <div className="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between p-4 text-sm">
          <Link href="/" className="flex items-center">
            <span className="self-center text-2xl font-bold tracking-tighter dark:text-white md:text-3xl">
              Hornex
            </span>
          </Link>
          <div className="flex items-center gap-4 md:order-2 md:gap-8">
            {!state.isAuthenticated ? (
              <>
                <Link
                  href={routes.login}
                  className="flex items-center text-white transition-colors hover:text-amber-400"
                >
                  Login
                  <ArrowUpRightIcon className="ml-2 w-4" />
                </Link>
                <Link
                  href={routes.register}
                  className="rounded bg-amber-500 px-4 py-2 font-medium tracking-tight text-white transition-colors hover:bg-amber-400 focus:ring-2"
                >
                  Register now
                </Link>
              </>
            ) : (
              <Button onClick={logout}>
                <div className="flex items-center text-white">
                  logout
                  <ArrowRightOnRectangleIcon className="ml-2 w-4" />
                </div>
              </Button>
            )}
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
                  className="block rounded py-2 pl-3 pr-4 text-white transition-colors hover:text-amber-400 md:bg-transparent md:p-0"
                  aria-current="page"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#supported-games"
                  className="block rounded py-2 pl-3 pr-4 text-white transition-colors hover:text-amber-400 md:p-0"
                >
                  Supported Games
                </a>
              </li>
              <li>
                <a
                  href="#how-to-play"
                  className="block rounded py-2 pl-3 pr-4 text-white transition-colors hover:text-amber-400 md:p-0"
                >
                  How to play
                </a>
              </li>
              <li>
                <Link
                  href="#contact"
                  className="block rounded py-2 pl-3 pr-4 text-white transition-colors hover:text-amber-400 md:p-0"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <section id="home" className="relative h-[calc(90vh-68px)]">
        {/* <div className="absolute inset-0 top-0 -z-10 h-full w-full bg-[url('/images/major.avif')] bg-cover bg-no-Hornex">
          <div className="h-full w-full bg-dark/95" />
        </div> */}

        <div className="absolute left-0 right-0 m-auto h-full">
          <video
            className="bg-dark/70 left-0 top-0 h-full w-full object-cover object-center"
            autoPlay
            loop
            muted
          >
            <source src="/videos/hornex-gaming.webm" type="video/webm" />
          </video>
          <div className="bg-dark/80 absolute inset-0"></div>
        </div>

        <div className="absolute left-0 right-0 top-20 mx-auto max-w-screen-xl px-4 py-8 text-center lg:px-12 lg:py-16">
          <a
            href="#"
            className="mb-7 inline-flex items-center justify-between rounded-full bg-gray-100 px-1 py-1 pr-4 text-sm text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
            role="alert"
          >
            <span className="bg-primary-600 mr-3 rounded-full px-4 py-1.5 text-xs text-white transition-colors">
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

          <div className="mb-8 flex flex-col items-center">
            <Image src={BullHorn} alt="horn" width={128} height={128} />
          </div>
          <h1 className="mb-4 text-4xl font-extrabold uppercase leading-none tracking-tight text-gray-900 dark:text-white md:text-5xl lg:text-5xl">
            <span className="text-amber-400">get paid</span> playing your
            favorite games
          </h1>
          <p className="mb-8 text-xl font-normal text-gray-500 dark:text-white sm:px-16 lg:text-xl xl:px-48">
            The newest online sports tournaments company. A trustable company
            that allow you to compete on your favorite e-sports.
          </p>
          <div className="flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-x-4 sm:space-y-0">
            <Link
              href={routes.compete}
              className="dark:hover:text-light-dark inline-flex items-center justify-center rounded-lg border border-white px-5 py-3 text-center text-base font-medium transition-colors hover:border-amber-400 hover:bg-gray-100 hover:text-white focus:ring-2 focus:ring-gray-100 dark:border-white dark:text-white dark:hover:bg-white dark:focus:ring-white"
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
            </Link>
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

      <section id="supported-games" className="md:py-15 bg-light-dark py-14">
        <div className="container">
          <div className="px-4 text-center md:text-left">
            <h2 className="text-3xl font-extrabold leading-none tracking-tight dark:text-slate-200 md:text-2xl">
              {' '}
              Supported Games{' '}
            </h2>
            <img src="data:image/png;base64,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" />
            <p>
              Select your favorite game and get paid for playing tournaments
            </p>
          </div>

          <div className="mt-10 grid grid-cols-4 gap-4 px-4 text-gray-500">
            {/* league of legends */}
            <Link href={routes.compete} className="group">
              <div className="shadow-main relative h-[400px] w-full rounded-lg bg-[url('/images/jinks.jpg')] bg-cover bg-center bg-no-repeat transition-all group-hover:scale-105">
                <div className="absolute inset-0 rounded-md bg-sky-600/60"></div>
                <div className="absolute bottom-0 top-0 mx-0 my-auto h-full w-full text-center">
                  <Image
                    src={LeagueOfLegendsLogo}
                    width={200}
                    className="absolute bottom-0 left-0 right-0 top-0 m-auto pt-8 brightness-0 invert"
                    alt="League of Legends"
                  />
                </div>
                <div className="absolute bottom-0 mx-auto w-full rounded-b bg-sky-600/70 p-4 text-center">
                  <h4 className="text-xl font-bold text-white">Jogar</h4>
                </div>
              </div>
            </Link>

            {/* csgo */}
            <Link href={routes.compete} className="group">
              <div className="shadow-main relative h-[400px] w-full rounded-lg bg-[url('/images/cs-go/ct-bot.jpg')] bg-cover bg-center bg-no-repeat transition-all group-hover:scale-105">
                <div className="absolute inset-0 rounded-md bg-purple-600/60"></div>
                <div className="absolute bottom-0 top-0 mx-0 my-auto h-full w-full text-center">
                  <Image
                    src={CsGoLogo}
                    width={200}
                    className="absolute bottom-0 left-0 right-0 top-0 m-auto pt-8 brightness-0 invert"
                    alt="League of Legends"
                  />
                </div>
                <div className="absolute bottom-0 mx-auto w-full rounded-b bg-purple-600/70 p-4 text-center">
                  <h4 className="text-xl font-bold text-white">Jogar</h4>
                </div>
              </div>
            </Link>

            {/* free fire */}
            <Link href={routes.compete} className="group">
              <div className="shadow-main relative h-[400px] w-full rounded-lg bg-[url('/images/free-fire/battle-royale.jpg')] bg-cover bg-center bg-no-repeat transition-all group-hover:scale-105">
                <div className="absolute inset-0 rounded-md bg-red-600/60"></div>
                <div className="absolute bottom-0 top-0 mx-0 my-auto h-full w-full text-center">
                  <Image
                    src={FreeFireLogo}
                    width={200}
                    className="absolute bottom-0 left-0 right-0 top-0 m-auto pt-8 brightness-0 invert"
                    alt="League of Legends"
                  />
                </div>
                <div className="absolute bottom-0 mx-auto w-full rounded-b bg-red-600/70 p-4 text-center">
                  <h4 className="text-xl font-bold text-white">Jogar</h4>
                </div>
              </div>
            </Link>

            {/* rocket league */}
            <Link href={routes.compete} className="group">
              <div className="shadow-main relative h-[400px] w-full rounded-lg bg-[url('/images/bg-rocket-league.webp')] bg-cover bg-center bg-no-repeat transition-all group-hover:scale-105">
                <div className="absolute inset-0 rounded-md bg-green-600/60"></div>
                <div className="absolute bottom-0 top-0 mx-0 my-auto h-full w-full text-center">
                  <Image
                    src={RocketLeagueLogo}
                    width={200}
                    className="absolute bottom-0 left-0 right-0 top-0 m-auto pt-8 brightness-0 invert"
                    alt="League of Legends"
                  />
                </div>
                <div className="absolute bottom-0 mx-auto w-full rounded-b bg-green-600/70 p-4 text-center">
                  <h4 className="text-xl font-bold text-white">Jogar</h4>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <section
        className="bg-gradient-to-r from-amber-400 to-amber-600 pb-14 pt-10  text-slate-300 "
        id="how-to-play"
      >
        <div className="container mx-auto grid md:grid-cols-2">
          <div className="space-y-12 px-4 py-10 text-center md:py-20 md:text-left">
            <h2 className="text-4xl font-extrabold leading-none tracking-tight dark:text-white md:text-5xl">
              {' '}
              Play Unlimited Tournaments{' '}
            </h2>
            <p className="text-white sm:text-xl md:w-[500px]">
              On Hornex you can play in an unlimited number of tournaments with
              your team. All the results are automatically updated on the
              platform and we are going to ensure a fair competition.
            </p>

            <div>
              <Link
                href={routes.compete}
                className="dark:hover:text-light-dark inline-flex items-center justify-center rounded-lg border border-white px-5 py-3 text-center text-base font-medium transition-colors hover:border-amber-400 hover:bg-gray-100 hover:text-white focus:ring-2 focus:ring-gray-100 dark:border-white dark:text-white dark:hover:bg-white dark:focus:ring-white"
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
              </Link>
            </div>
          </div>
          <div className="relative hidden md:block">
            <div className="shadow-card absolute left-10 top-16">
              <Image
                src={Tournament}
                className="w-60 rounded"
                alt="Pick Game Screen"
              />
            </div>
            <div className="shadow-card absolute right-10 top-16">
              <Image
                src={Tournament}
                className="w-60 rounded"
                alt="Pick Game Screen"
              />
            </div>
            <div className="shadow-card absolute left-40 top-0">
              <Image
                src={Tournament}
                className="w-80 rounded"
                alt="Pick Game Screen"
              />
            </div>
            {/* <div className="absolute -left-10 top-40 w-[80%] rounded border border-slate-700">
              <Image
                src={PickGameScreen}
                className="rounded"
                alt="Pick Game Screen"
              />
            </div> */}
          </div>
        </div>
      </section>

      <section id="automatedResultTracking" className="bg-dark py-14 md:py-28">
        <div className="container mx-auto space-y-12 px-4 text-center">
          <h2 className="mb-4 text-center text-4xl font-extrabold leading-none tracking-tight dark:text-white md:text-5xl">
            Get paid organizing tournaments
          </h2>
          <p className="mx-auto mb-8 text-center font-light sm:text-xl md:w-[600px]">
            Our platform is going to help you to organize tournaments and get
            paid for it. We are going to provide you a fair competition and a
            lot of tools to help you to organize your tournaments.
          </p>

          <Link
            href={routes.compete}
            className="dark:hover:text-light-dark inline-flex items-center justify-center rounded-lg border border-white px-5 py-3 text-center text-base font-medium transition-colors hover:border-amber-400 hover:bg-gray-100 hover:text-white focus:ring-2 focus:ring-gray-100 dark:border-white dark:text-white dark:hover:bg-white dark:focus:ring-white"
          >
            More
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
          </Link>
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
              <ul className="text-sm font-medium text-gray-500 dark:text-gray-400">
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
                    rel="noreferrer"
                  >
                    +55 (24) 98165-5545
                  </a>
                </li>
                <li className="mb-4">
                  <a
                    href="mailto:accounts@hornex.gg"
                    className="hover:underline"
                  >
                    accounts@hornex.gg
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="mb-6 text-sm font-semibold uppercase text-gray-900 dark:text-white">
                Help center
              </h2>
              <ul className="text-sm font-medium text-gray-500 dark:text-gray-400">
                <li className="mb-4">
                  <a href="#" className="hover:underline">
                    Discord Server
                  </a>
                </li>
                <li className="mb-4">
                  <Link href="#contact" className="hover:underline">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="mb-6 text-sm font-semibold uppercase text-gray-900 dark:text-white">
                Account
              </h2>
              <ul className="text-sm font-medium text-gray-500 dark:text-gray-400">
                <li className="mb-4">
                  <Link href={routes.login} className="hover:underline">
                    Login
                  </Link>
                </li>
                <li className="mb-4">
                  <Link href={routes.register} className="hover:underline">
                    Register
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="mb-6 text-sm font-semibold uppercase text-gray-900 dark:text-white">
                Legal
              </h2>
              <ul className="text-sm font-medium text-gray-500 dark:text-gray-400">
                <li className="mb-4">
                  <Link href={routes.privacyPolicy} className="hover:underline">
                    Privacy Policy
                  </Link>
                </li>
                <li className="mb-4">
                  <Link
                    href={routes.termsAndConditions}
                    className="hover:underline"
                  >
                    Terms &amp; Conditions
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="mb-6 text-sm font-semibold uppercase text-gray-900 dark:text-white">
                Company
              </h2>
              <ul className="text-sm font-medium text-gray-500 dark:text-gray-400">
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
              © 2023 <Link href="/">Hornex™</Link>
              <br />
              All Rights Reserved.
            </span>
            <div className="mt-4 flex items-center space-x-5 sm:justify-center md:mt-0">
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
                href="https://twitter.com/hornexgg"
                target="_blank"
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
              <a
                href="https://www.instagram.com/hornexgg/"
                target="_blank"
                className="text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                <svg
                  className="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="sr-only">Instagram page</span>
              </a>
            </div>
          </div>
          <p className="p-6 text-sm md:px-16 md:text-center">
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
