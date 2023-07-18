import routes from '@/config/routes';

type MenuItem = {
  name: string;
  href: string;
  dropdownItems?: MenuItem[];
};

export const menuItems: MenuItem[] = [
  {
    name: 'Terms and Services',
    href: routes.termsAndConditions,
  },
  {
    name: 'About',
    href: routes.about,
  },
  {
    name: 'Contact',
    href: routes.contact,
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
