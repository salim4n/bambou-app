
import { HeaderInput } from "@/app/components/HeaderInput/HeaderInput";
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
      label: 'Form',
      key: 'Form',
      icon: <Link href={"/form"}><ArchiveIcon /></Link>,
    },
    {
      label: 'Data',
      key: 'SubMenu',
      children: [
        {
          type: 'group',
          label: 'File Upload',
          children: [
            {
              label: <HeaderInput buttonText="Upload Excel " type="excel" />,
              key: 'Excel',
              style: {float: 'right'}
            },
            {
              label: <HeaderInput buttonText="Upload CSV" type="csv" />,
              key: 'CSV',
              style: {float: 'right'}
            },
          ],
        }
      ],
    },

  ] as MenuProps['items'] ;
}