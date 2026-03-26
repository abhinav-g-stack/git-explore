import Image from 'next/image';
import { LoginForm } from '@/components/login-form';
import Link from 'next/link';

export default function AdminLoginPage() {
  return (
    <div className="w-full min-h-screen lg:grid lg:grid-cols-2">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold font-headline">Admin Portal</h1>
            <p className="text-balance text-muted-foreground">
              Enter your credentials to access the dashboard.
            </p>
          </div>
          <LoginForm isAdminLogin={true} />
          <div className="mt-4 text-center text-sm">
            Not an admin?{' '}
            <Link href="/login" className="underline">
              Go to user login
            </Link>
          </div>
        </div>
      </div>
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-l lg:flex">
        <div className="absolute inset-0 bg-zinc-900" />
        <Image 
          src="https://placehold.co/1200x1600.png"
          alt="Data analytics dashboard"
          fill
          className="object-cover opacity-30"
          data-ai-hint="business analytics"
        />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <Link href="/" className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2 h-6 w-6"
            >
              <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
            </svg>
            EcomWave
          </Link>
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              &ldquo;This dashboard provides the insights we need to drive our business forward and stay ahead of the curve.&rdquo;
            </p>
            <footer className="text-sm">Marketing Director</footer>
          </blockquote>
        </div>
      </div>
    </div>
  );
}
