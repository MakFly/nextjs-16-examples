// Server Component - Simple Data Fetching
export async function SimpleServerData() {
  // Simulate API call with a real fetch (works in production)
  const response = await fetch('https://jsonplaceholder.typicode.com/posts/1', {
    cache: 'no-store', // Force fresh data on each request
    next: { revalidate: 0 }
  });
  await response.json(); // Wait for the fetch to complete
  
  const data = {
    timestamp: new Date().toISOString(),
    message: "This data was fetched on the server!"
  };
  
  return (
    <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
      <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">Server-side Data</h3>
      <p className="text-sm text-green-700 dark:text-green-300">Fetched at: {data.timestamp}</p>
      <p className="text-green-600 dark:text-green-400">{data.message}</p>
    </div>
  );
}
