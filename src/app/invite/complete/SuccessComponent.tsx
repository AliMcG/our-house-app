'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SuccessRedirect({ householdName }: { householdName: string }) {
  const router = useRouter();
  const redirectTo = '/home';
  const redirectDelayMs = 3000;

  useEffect(() => {
    // Start the timer for the redirect
    const timer = setTimeout(() => {
      router.push(redirectTo);
    }, redirectDelayMs);

    // Cleanup the timer when the component unmounts
    // This prevents memory leaks and issues if the user navigates away
    return () => clearTimeout(timer);
  }, [router, redirectTo, redirectDelayMs]);

  return (
    <div className="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-md space-y-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-green-600">Success!</h2>
        <p className="mt-2 text-gray-700">
          You successfully joined Household <strong>{householdName}</strong>.
        </p>
        <p className="mt-4 text-gray-600 text-sm">
          You will be redirected to the home page in a few seconds...
        </p>
      </div>
    </div>
  );
}