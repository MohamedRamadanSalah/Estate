export function PropertyCardSkeleton() {
  return (
    <div className="rounded-xl overflow-hidden bg-white shadow-lg border border-gray-100">
      <div className="skeleton h-48 w-full" />
      <div className="p-4 space-y-3">
        <div className="skeleton h-3 w-24" />
        <div className="skeleton h-5 w-3/4" />
        <div className="skeleton h-5 w-1/2" />
        <div className="flex gap-4">
          <div className="skeleton h-3 w-16" />
          <div className="skeleton h-3 w-16" />
          <div className="skeleton h-3 w-16" />
        </div>
      </div>
    </div>
  );
}

export function PropertyDetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="skeleton h-96 w-full rounded-xl" />
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="skeleton w-20 h-20 rounded-lg shrink-0" />
            ))}
          </div>
          <div className="space-y-3 mt-6">
            <div className="skeleton h-7 w-48" />
            <div className="skeleton h-4 w-full" />
            <div className="skeleton h-4 w-full" />
            <div className="skeleton h-4 w-3/4" />
          </div>
        </div>
        <div className="space-y-4">
          <div className="skeleton h-[500px] w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export function StatsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="text-center space-y-2">
          <div className="skeleton h-9 w-20 mx-auto" />
          <div className="skeleton h-4 w-24 mx-auto" />
        </div>
      ))}
    </div>
  );
}

export function FilterSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-lg p-4 space-y-4">
      <div className="skeleton h-5 w-28" />
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="space-y-1">
          <div className="skeleton h-3 w-20" />
          <div className="skeleton h-10 w-full rounded-lg" />
        </div>
      ))}
      <div className="skeleton h-10 w-full rounded-lg" />
    </div>
  );
}

export function GovernorateCardSkeleton() {
  return (
    <div className="skeleton h-24 rounded-xl" />
  );
}
