import { authOptions } from './api/auth/[...nextauth]/options';
import AdminTournamentMockView from '@/assets/images/admin-tournament-mock-viewer.png';
import HeaderCtt from '@/assets/images/header_ctt.png';
import Teemo from '@/assets/images/teemo.png';
import TournamentMockView from '@/assets/images/tournament-mock-viewer.png';
import ProfileMenuItem from '@/components/profile/profile-menu-item';
import { Logo } from '@/components/ui/atoms/logo';
import { Button } from '@/components/ui/button';
import routes from '@/config/routes';
import { ArrowUpRightIcon, LogInIcon } from 'lucide-react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { getServerSession } from 'next-auth';

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  const renderHeaderRightArea = () => {
    if (session) {
      return (
        <>
          <Link href={routes.compete} className="mr-4">
            <div className=" flex items-center font-medium">Compete</div>
          </Link>
          <ProfileMenuItem
            user={{
              email: session.user?.email!,
              name: session.user?.name!,
            }}
          />
        </>
      );
    }
    return (
      <>
        <Link href={routes.login} className="mr-4">
          <div className=" flex items-center font-medium">
            Login <LogInIcon className=" ml-2 h-5 w-5" />
          </div>
        </Link>
        <Link href={routes.signup}>
          <div className=" flex items-center font-medium">
            Create account <ArrowUpRightIcon className=" ml-2 h-5 w-5" />
          </div>
        </Link>
      </>
    );
  };

  return (
    <div className="">
      <Head>
        <title>Hornex</title>
        <meta name="google" content="notranslate" key="notranslate" />
      </Head>
      <header className="bg-dark/20 fixed top-0 z-40 h-20 w-full px-8 backdrop-blur-sm">
        <div className="mx-auto flex h-full w-full max-w-[2160px] justify-between">
          <div className="text-title flex w-[230px] items-center text-xl font-bold">
            <Link href="/" className="flex items-center">
              <Logo size="xs" className="mr-2" />
              <span className="font-extrabold">HORNEX</span>
            </Link>
          </div>
          <div className="mr-4 flex items-center font-medium">
            {renderHeaderRightArea()}
          </div>
        </div>
      </header>
      <div className="relative h-[450px] w-full bg-[url('/images/league-of-legends/baron.jpg')] bg-cover bg-center bg-no-repeat">
        <div className="absolute top-0 h-full w-full backdrop-blur-sm"></div>
        <div className="bg-dark/60 absolute top-0 z-0 h-full w-full"></div>
        <div className="absolute left-20 top-[50%] z-10 flex justify-start">
          <Logo size="lg" className="mr-8" />
          <div>
            <h1 className="py-4 text-6xl font-extrabold text-white">
              Organize, Compete and{' '}
              <span className="text-dark bg-amber-500 px-2">Get Paid</span>
            </h1>
            <p className="w-[70%] text-2xl font-thin text-white">
              With Hornex you can easily organize and compete in tournaments. We
              make it easy to get paid for your skills.
            </p>
          </div>
        </div>
      </div>

      <section className="to-brand bg-gradient-to-r from-amber-600">
        <div className="container mx-auto py-20">
          <div className="grid grid-cols-2">
            <div>
              <h4 className="mb-4 text-6xl font-extrabold text-white">
                Built for organizers
              </h4>
              <p className="pr-10 text-xl text-white">
                Hornex is a platform that allows you to easily create and manage
                tournaments. We take care of the hard work so you can focus on
                organizing the best events.
              </p>
              <Image src={Teemo} alt="Hornex" width={200} className="mt-10" />
            </div>
            <div className="flex justify-start">
              <Image src={TournamentMockView} alt="Hornex" className="mt-10" />
            </div>
          </div>
        </div>
      </section>

      <section className="to-title bg-gradient-to-l from-white">
        <div className="container mx-auto pt-20">
          <div className="grid grid-cols-3">
            <div className="flex items-end justify-end">
              <Image
                src={HeaderCtt}
                alt="Hornex"
                width={400}
                className="mt-10"
                height={400}
              />
            </div>
            <div className="col-span-2 flex flex-col">
              <div className="">
                <h4 className="text-dark mb-4 text-6xl font-extrabold">
                  Results tracking
                </h4>
                <p className="text-dark text-left text-xl">
                  We will soon be launching a feature that allows you to track
                  your results and statistics from your games. That way you can
                  manage tournaments easily.
                </p>
                <div className="">
                  <Image
                    src={AdminTournamentMockView}
                    alt="Hornex"
                    className="mt-10"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="dark:bg-dark mx-auto border-t border-gray-800 bg-white p-6 md:p-14">
        <div className="mx-auto w-full max-w-screen-xl">
          <div className="grid grid-cols-2 gap-6 py-6 md:grid-cols-6">
            <div className="col-span-2">
              <h2 className="text-body mb-6  font-semibold uppercase dark:text-white">
                Hornex
              </h2>
              <ul className=" text-body font-medium ">
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
                  <a href="mailto:hornex@gmail.com" className="hover:underline">
                    hornex@gmail.com
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-body mb-6  font-semibold uppercase dark:text-white">
                Help center
              </h2>
              <ul className=" text-body font-medium ">
                <li className="mb-4">
                  <a
                    href="https://discord.gg/6FavTJXR"
                    className="hover:underline"
                  >
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
              <h2 className="text-body mb-6  font-semibold uppercase dark:text-white">
                Account
              </h2>
              <ul className=" text-body font-medium ">
                <li className="mb-4">
                  <Link href={routes.login} className="hover:underline">
                    Login
                  </Link>
                </li>
                <li className="mb-4">
                  <Link href={routes.register} className="hover:underline">
                    Sign Up
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="text-body mb-6  font-semibold uppercase dark:text-white">
                Legal
              </h2>
              <ul className=" text-body font-medium ">
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
              <h2 className="text-body mb-6  font-semibold uppercase dark:text-white">
                Company
              </h2>
              <ul className=" text-body font-medium">
                <li className="mb-4">
                  <a href="#" className=" hover:underline">
                    About
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mx-auto border-t border-gray-800 px-4 py-6 md:flex md:items-center md:justify-between">
            <span className=" text-body dark:text-gray-300 sm:text-center">
              © 2024 <Link href="/">Hornex™</Link>
              <br />
              rights reserverd
            </span>
            <div className="mt-4 flex items-center space-x-5 sm:justify-center md:mt-0">
              <a
                href="https://discord.gg/6FavTJXR"
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
          <p className="p-6  md:px-16 md:text-center">
            Hornex is not endorsed by, directly affiliated with, tained or
            sponsored by Apple Inc, Electronic Arts, Activision Blizzard,
            Take-Two Interactive, Riot Games, Microsoft, Xbox or Epic Games. All
            content, games titles, trade names and/or trade dress, trademarks,
            artwork and associated imagery are trademarks and/or copyright
            material of their respective owners.
          </p>
        </div>
      </footer>
    </div>
  );
}
