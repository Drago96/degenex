"use client";

import { Tab } from "@headlessui/react";

import Typography from "@/components/ui/typography";

export default function AssetBalanceTabs() {
  return (
    <Tab.Group>
      <Tab.List className="flex flex-row gap-5">
        <Tab>
          <Typography>Fiat Money</Typography>
        </Tab>
        <Tab>
          <Typography>Stocks</Typography>
        </Tab>
        <Tab>
          <Typography>Crypto</Typography>
        </Tab>
      </Tab.List>
      <Tab.Panels>
        <Tab.Panel>
          <Typography>Content 1</Typography>
        </Tab.Panel>
        <Tab.Panel>
          <Typography>Content 2</Typography>
        </Tab.Panel>
        <Tab.Panel>
          <Typography>Content 3</Typography>
        </Tab.Panel>
      </Tab.Panels>
    </Tab.Group>
  );
}
