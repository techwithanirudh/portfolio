import { Icons } from "@/components/icons/icons";
import { Section } from "@/components/section";
import { Button } from "@/components/ui/button";
import { env } from "@/env";
import Link from "next/link";
import type React from "react";
import Balancer from "react-wrap-balancer";
import * as motion from "motion/react-client";
import Image from "next/image";

export default function CTA(): React.ReactElement {
  return (
    <Section className="flex flex-wrap items-center divide-y divide-dashed divide-border lg:divide-x lg:divide-y-0">
      <div className="flex w-fit items-center p-6  justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative rounded-md overflow-hidden p-1 border-2 border-border shadow-sm transition-transform hover:scale-110 "
        >
          <Image
            src="/icon.png"
            alt="Profile picture"
            width={300}
            height={300}
            className="rounded-sm"
            priority
          />
        </motion.div>
      </div>

      <div className="flex flex-col gap-2 p-6 flex-1 justify-center">
        <h4 className="max-w-xl text-left font-regular text-3xl tracking-tighter md:text-5xl">
          The Moderator
        </h4>
        <p className="max-w-xl text-left text-lg text-muted-foreground leading-relaxed tracking-tight lg:max-w-lg">
          I’m a community builder who loves transforming small forums into
          vibrant hangouts. I’m also a Discourse moderator, skilled in managing
          categories, plugins, and keeping conversations welcoming. When I’m not
          handling forum tasks, I play chess and binge-watch YouTube.
        </p>
      </div>
    </Section>
  );
}
