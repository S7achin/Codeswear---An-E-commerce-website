import {
  IconBoxMultiple, IconCirclePlus, IconHome, IconUpload, IconLayout, IconLayoutGrid, IconPhoto, IconPoint, IconShoppingCart, IconEye, IconUser
} from "@tabler/icons-react";

import { uniqueId } from "lodash";

const Menuitems = [
  {
    id: uniqueId(),
    title: "Dashboard",
    icon: IconHome,
    href: "/admin",
  },
  {
    id: uniqueId(),
    title: "Add Product",
    icon: IconCirclePlus,
    href: "/admin/add",
  },
  {
    id: uniqueId(),
    title: "View Products",
    icon: IconEye,
    href: "/admin/allproducts",
  },
  {
    id: uniqueId(),
    title: "Image Uploader",
    icon: IconUpload,
    href: "/admin/imageuploader",
  },
  {
    id: uniqueId(),
    title: "Orders",
    icon: IconShoppingCart,
    href: "/admin/allorders",
  },
];

export default Menuitems;
