import { ServerComponentsPageClient } from './page-client';
import { SimpleServerDataWrapper, ComplexServerDataWrapper } from './server-components-content';

// Server Component that renders Server Components and passes them to Client Component
export default async function ServerComponentsPage() {
  return (
    <ServerComponentsPageClient
      simpleServerData={<SimpleServerDataWrapper />}
      complexServerData={
        <ComplexServerDataWrapper
          usersLabel="Users"
          growthLabel="Growth"
          vsLastMonth="vs last month"
          activeTodayLabel="Active Today"
          onlineUsers="online users"
        />
      }
    />
  );
}
