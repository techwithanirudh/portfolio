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
    <Section className="grid divide-y divide-dashed divide-border lg:grid-cols-2 lg:divide-x lg:divide-y-0">
      <div className="flex flex-col gap-2 px-6 py-10 md:py-14">
        <h4 className="text-3xl md:text-5xl font-regular tracking-tighter">
          The Moderator
        </h4>
        <p className="mt-4 text-lg text-muted-foreground leading-relaxed max-w-lg">
          I’m a community builder who loves transforming small forums into
          vibrant hangouts. I’m also a Discourse moderator, skilled in managing
          categories, plugins, and keeping conversations welcoming. When I’m not
          handling forum tasks, I play chess and binge‑watch YouTube.
        </p>
      </div>

      <div className="flex w-full items-center justify-center px-6 py-10 md:py-14">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative rounded-md overflow-hidden p-1 border-2 border-border shadow-sm hover:scale-110 transition-transform flex items-center justify-center"
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
    </Section>
  );
}
