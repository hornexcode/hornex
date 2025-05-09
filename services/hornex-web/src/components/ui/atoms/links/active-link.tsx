import AnchorLink from '@/components/ui/atoms/links/anchor-link';
import cn from 'classnames';
import type { LinkProps } from 'next/link';
import { usePathname } from 'next/navigation';

interface ActiveLinkProps extends LinkProps {
  activeClassName?: string;
}
const ActiveLink: React.FC<
  ActiveLinkProps & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>
> = ({ href, className, activeClassName = 'active', ...props }) => {
  const pathname = usePathname();
  const _href = typeof href === 'object' ? href.pathname : href;
  return (
    <AnchorLink
      href={href}
      className={cn(className, {
        [activeClassName]: pathname === _href,
      })}
      {...props}
    />
  );
};

export default ActiveLink;
