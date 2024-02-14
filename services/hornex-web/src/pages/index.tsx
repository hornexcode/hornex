import FreeFireLogo from '@/assets/images/games/free-fire/logo.png';
import LeagueOfLegendsLogo from '@/assets/images/games/league-of-legends/logo.png';
import CsGoLogo from '@/assets/images/hero/csgo-logo.png';
import RocketLeagueLogo from '@/assets/images/hero/rl-logo.png';
import BullHorn from '@/assets/images/hornex/hornex-logo.png';
import Tournament from '@/assets/images/tournaments/tournament.png';
import Button from '@/components/ui/atoms/button/button';
import routes from '@/config/routes';
import { AppLayout } from '@/layouts';
import { useSession } from 'next-auth/react';
import {
  ArrowRightOnRectangleIcon,
  ArrowUpRightIcon,
} from '@heroicons/react/20/solid';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

function HomePage() {
  const router = useRouter();

  const { status, data: session } = useSession();

  const logout = () => {
    if (status === "authenticated") {
      router.push(routes.compete);
    }
  }

  return (
    <main className="">
      <nav className="bg-dark/40 fixed top-0 z-10 w-full border-b border-slate-700">
        <div className="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between p-4 text-sm">
          <Link href="/" className="flex items-center">
            <span className="self-center text-2xl font-bold tracking-tighter dark:text-white md:text-3xl">
              Hornex
            </span>
          </Link>
          <div className="flex items-center gap-4 md:order-2 md:gap-8">
            {status !== "authenticated" ? (
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
          <h1 className="text-body mb-4 text-4xl font-extrabold uppercase leading-none tracking-tight dark:text-white md:text-5xl lg:text-5xl">
            <span className="text-amber-400">get paid</span> playing your
            favorite games
          </h1>
          <p className="text-title text-lg font-thin">
            by playing tournaments of your favorite game
          </p>
        </div>
      </div>
      <div className="container mx-auto py-8">
        <h4 className="text-title text-xl font-bold">Next tournaments</h4>
      </div>
      <footer className="dark:bg-dark mx-auto border-t border-gray-800 bg-white p-6 md:p-14">
        <div className="mx-auto w-full max-w-screen-xl">
          <div className="grid grid-cols-2 gap-6 py-6 md:grid-cols-6">
            <div className="col-span-2">
              <h2 className="text-body mb-6 text-sm font-semibold uppercase dark:text-white">
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
              <h2 className="text-body mb-6 text-sm font-semibold uppercase dark:text-white">
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
              <h2 className="text-body mb-6 text-sm font-semibold uppercase dark:text-white">
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
              <h2 className="text-body mb-6 text-sm font-semibold uppercase dark:text-white">
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
              <h2 className="text-body mb-6 text-sm font-semibold uppercase dark:text-white">
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
                className="hover:text-body text-gray-400 dark:hover:text-white"
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
                className="hover:text-body text-gray-400 dark:hover:text-white"
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
                className="hover:text-body text-gray-400 dark:hover:text-white"
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
            Hornex is not endorsed by, directly affiliated with, tained or
            sponsored by Apple Inc, Electronic Arts, Activision Blizzard,
            Take-Two Interactive, Riot Games, Microsoft, Xbox or Epic Games. All
            content, games titles, trade names and/or trade dress, trademarks,
            artwork and associated imagery are trademarks and/or copyright
            material of their respective owners.
          </p>
        </div>
      </footer>
    </>
  );
}

HomePage.getLayout = (page: React.ReactElement) => {
  return <AppLayout>{page}</AppLayout>;
};

export default HomePage;
