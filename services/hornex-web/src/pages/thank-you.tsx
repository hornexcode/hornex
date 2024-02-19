import Button from '@/components/ui/atoms/button/button';
import { AppLayout } from '@/layouts';
import Link from 'next/link';

const ThankYouPage = () => {
  return (
    <div className="mx-auto space-y-8 p-8">
      <>Thank you for your registration!</>
      <>
        <Link href="/dashboard">
          <Button>Go to dashboard</Button>
        </Link>
      </>
    </div>
  );
};

ThankYouPage.getLayout = (page: React.ReactElement) => {
  return <AppLayout>{page}</AppLayout>;
};

export default ThankYouPage;
