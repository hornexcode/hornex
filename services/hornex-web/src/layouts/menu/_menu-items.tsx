import routes from '@/config/routes';

type MenuItem = {
  name: string;
  href: string;
  dropdownItems?: MenuItem[];
};

export const menuItems: MenuItem[] = [
  {
    name: 'Termos de uso',
    href: routes.termsAndConditions,
  },
  {
    name: 'Sobre nós',
    href: routes.about,
  },
  {
    name: 'Contato',
    href: routes.contactUs,
  },
  {
    name: 'Fale conosco',
    href: routes.contactUs,
  },
  // {
  //   name: "Farm",
  //   icon: <FarmIcon />,
  //   href: routes.farms,
  // },
  // {
  //   name: "Swap",
  //   icon: <ExchangeIcon />,
  //   href: routes.swap,
  // },
  // {
  //   name: "Liquidity",
  //   icon: <PoolIcon />,
  //   href: routes.liquidity,
  // },
  // {
  //   name: "NFTs",
  //   icon: <CompassIcon />,
  //   href: routes.search,
  //   dropdownItems: [
  //     {
  //       name: "Explore NFTs",
  //       icon: <CompassIcon />,
  //       href: routes.search,
  //     },
  //     {
  //       name: "Create NFT",
  //       icon: <PlusCircle />,
  //       href: routes.createNft,
  //     },
  //     {
  //       name: "NFT Details",
  //       icon: <DiskIcon />,
  //       href: routes.nftDetails,
  //     },
  //   ],
  // },
];
