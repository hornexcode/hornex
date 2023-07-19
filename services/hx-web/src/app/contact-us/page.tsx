import { ArrowLongLeftIcon } from '@/components/ui/icons';
import { EnvelopeIcon, MapPinIcon, PhoneIcon } from '@heroicons/react/20/solid';
import Link from 'next/link';

export default function ContactUsPage() {
  return (
    <div className="container mx-auto bg-dark py-20">
      <Link href={'/'} className="mb-8 text-white">
        <div className="flex items-center">
          <ArrowLongLeftIcon className="mr-2 h-6 w-6" />
          Back
        </div>
      </Link>
      <h1 className="mt-6 text-left text-xl font-bold tracking-tighter text-white md:text-2xl lg:text-6xl">
        Contact Us
      </h1>
      <div className="mt-8 grid grid-cols-3 gap-4">
        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="flex items-center space-x-6">
            <div className="rounded bg-sky-400 p-4">
              <MapPinIcon className="w-9 rounded-md fill-white" />
            </div>
            <div className="">
              <h4 className="text-lg font-extrabold text-white">Address</h4>
              <Link
                href={
                  'https://www.google.com/maps/place/R.+Dailton+Fernandes+de+Carvalho,+32+-+S%C3%A3o+Pedro,+Barra+Mansa+-+RJ,+27340-010/@-22.5741039,-44.172524,17z/data=!3m1!4b1!4m6!3m5!1s0x9e9c2765cde3fb:0xe14e22a0f778d62b!8m2!3d-22.5741039!4d-44.172524!16s%2Fg%2F11c2gymxc8?entry=ttu'
                }
                className="text-lg font-light text-slate-400 hover:underline"
              >
                Rua dos Bobos, nº 0, Centro, São Paulo - SP
              </Link>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="flex items-center space-x-6">
            <div className="rounded bg-sky-400 p-4">
              <PhoneIcon className="w-9 rounded-md fill-white" />
            </div>
            <div className="">
              <h4 className="text-lg font-extrabold text-white">Phone</h4>
              <p className="text-lg font-light text-slate-400">
                +55 24 98165-5545
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="flex items-center space-x-6">
            <div className="rounded bg-sky-400 p-4">
              <EnvelopeIcon className="w-9 rounded-md fill-white" />
            </div>
            <div className="">
              <h4 className="text-lg font-extrabold text-white">Email</h4>
              <p className="text-lg font-light text-slate-400">
                pedro357bm@gmail.com
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
