interface EmptyStateProps {
  title: string;
  description?: string;
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 px-6 py-10 text-center">
      <div className="text-sm font-medium text-gray-700">{title}</div>
      {description ? (
        <div className="mt-2 text-sm text-gray-500">{description}</div>
      ) : null}
    </div>
  );
}
