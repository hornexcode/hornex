import routes from "@/config/routes";
import { HomeIcon, UsersIcon } from "@heroicons/react/20/solid";

type MenuItem = {
  name: string;
  icon: JSX.Element;
  href: string;
  dropdownItems?: MenuItem[];
};

export const menuItems: MenuItem[] = [
  {
    name: "Home",
    icon: <HomeIcon />,
    href: routes.home,
  },
  {
    name: "Teams",
    icon: <UsersIcon />,
    href: routes.teams,
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
