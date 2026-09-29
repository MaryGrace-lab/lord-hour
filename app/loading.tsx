export default function RootLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-3">
        <div
          className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"
          aria-hidden
        />
        <p className="text-sm text-gray-500">Loading...</p>
      </div>
    </div>
  );
}