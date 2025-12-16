import { Suspense } from 'react';
import { SimpleServerData } from './simple-server-data';
import { ComplexServerData } from './complex-server-data';
import { LoadingCard } from './loading-card';

export function SimpleServerDataWrapper() {
  return (
    <Suspense fallback={<LoadingCard />}>
      <SimpleServerData />
    </Suspense>
  );
}

export function ComplexServerDataWrapper({
  usersLabel,
  growthLabel,
  vsLastMonth,
  activeTodayLabel,
  onlineUsers,
}: {
  usersLabel: string;
  growthLabel: string;
  vsLastMonth: string;
  activeTodayLabel: string;
  onlineUsers: string;
}) {
  return (
    <Suspense
      fallback={
        <div className="grid md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <LoadingCard key={i} />
          ))}
        </div>
      }
    >
      <ComplexServerData
        usersLabel={usersLabel}
        growthLabel={growthLabel}
        vsLastMonth={vsLastMonth}
        activeTodayLabel={activeTodayLabel}
        onlineUsers={onlineUsers}
      />
    </Suspense>
  );
}
