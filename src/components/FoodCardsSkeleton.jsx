export default function LoadingSkeleton() {
  return (
    <div className="flex gap-4 overflow-x-auto p-4 animate-pulse">
      <div className="min-w-[280px] border rounded-lg p-4 space-y-3">
        <div className="h-40 bg-gray-300 rounded"></div>
        <div className="h-4 w-3/4 bg-gray-300 rounded"></div>
        <div className="h-4 w-1/2 bg-gray-300 rounded"></div>
      </div>
      <div className="min-w-[280px] border rounded-lg p-4 space-y-3">
        <div className="h-40 bg-gray-300 rounded"></div>
        <div className="h-4 w-3/4 bg-gray-300 rounded"></div>
        <div className="h-4 w-1/2 bg-gray-300 rounded"></div>
      </div>
      <div className="min-w-[280px] border rounded-lg p-4 space-y-3">
        <div className="h-40 bg-gray-300 rounded"></div>
        <div className="h-4 w-3/4 bg-gray-300 rounded"></div>
        <div className="h-4 w-1/2 bg-gray-300 rounded"></div>
      </div>
    </div>
  );
}
