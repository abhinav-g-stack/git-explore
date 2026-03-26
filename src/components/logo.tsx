import Link from 'next/link';
import { Waves } from 'lucide-react';

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <Waves className="h-7 w-7 text-primary" />
      <span className="text-xl font-bold font-headline tracking-tight">
        EcomWave
      </span>
    </Link>
  );
}
