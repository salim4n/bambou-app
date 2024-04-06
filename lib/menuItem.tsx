
import { HomeIcon, ArchiveIcon } from "@radix-ui/react-icons";
import { MenuProps } from "antd";
import Link from "next/link";


export const generateMenuItem = () => {
    return [
        {
          label: 'Accueil',
          key: 'Accueil',
          icon: <Link href={"/"}><HomeIcon /></Link>,
        },
        {
          label: 'Statistiques',
          key: 'statistiques',
          icon: <Link href={"/statistic"}><ArchiveIcon /></Link>,
        },
        
      ] as MenuProps['items'] ;
}