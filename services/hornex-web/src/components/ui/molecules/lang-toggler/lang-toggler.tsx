import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/atoms/select';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

export const LangToggler: React.FC = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const onToggleLanguageClick = (newLocale: string) => {
    const { pathname, query } = router;
    router.push({ pathname, query }, router.asPath, { locale: newLocale });
  };
  return (
    <Select onValueChange={onToggleLanguageClick}>
      <SelectTrigger className="text-title border-light-dark outline-none ring-0 ring-offset-0 dark:outline-none dark:ring-0 dark:ring-offset-0">
        <SelectValue placeholder={t('lang-toggler.title')} />
      </SelectTrigger>
      <SelectContent className="border-light-dark bg-medium-dark">
        <SelectItem value="en">{t('lang-toggler.en')}</SelectItem>
        <SelectItem value="pt">{t('lang-toggler.pt')}</SelectItem>
        <SelectItem value="fr">{t('lang-toggler.fr')}</SelectItem>
      </SelectContent>
    </Select>
  );
};
