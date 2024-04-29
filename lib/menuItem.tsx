
import { HeaderInput } from "@/app/components/HeaderInput/HeaderInput";
import { HomeIcon, ArchiveIcon, RocketIcon } from "@radix-ui/react-icons";
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
    {
      label: 'Model Machine Learning',
      key: 'ml',
      icon: <Link href={"/ml-model"}><RocketIcon /></Link>,
    },

  ] as MenuProps['items'] ;
}