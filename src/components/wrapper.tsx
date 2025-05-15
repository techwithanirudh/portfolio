'use client';

import type { LenisOptions } from 'lenis';
import { Lenis } from './lenis';

interface WrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  lenis?: boolean | LenisOptions;
}

export function Wrapper({
  children,
  className,
  lenis = true,
  ...props
}: WrapperProps) {
  return (
    <>
      {children}
      {lenis && <Lenis root options={typeof lenis === 'object' ? lenis : {}} />}
    </>
  );
}
