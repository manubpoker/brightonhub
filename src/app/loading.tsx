import { LoadingState } from '@/components/shared/loading-state';

export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <LoadingState cards={3} />
    </div>
  );
}
