// Server Component - Simple Data Fetching
// This component fetches REAL data from an API on the server
export async function SimpleServerData() {
  // Real API call - this runs on the server, not in the browser!
  const response = await fetch('https://jsonplaceholder.typicode.com/posts/1', {
    cache: 'no-store', // Force fresh data on each request
  });

  const post = await response.json();
  const timestamp = new Date().toISOString();

  return (
    <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
      <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">
        Données récupérées côté serveur
      </h3>
      <p className="text-xs text-green-600 dark:text-green-400 mb-3">
        Timestamp serveur: {timestamp}
      </p>
      <div className="space-y-2">
        <p className="text-sm font-medium text-green-800 dark:text-green-200">
          Post #{post.id}: {post.title}
        </p>
        <p className="text-sm text-green-700 dark:text-green-300 line-clamp-2">
          {post.body}
        </p>
      </div>
    </div>
  );
}
