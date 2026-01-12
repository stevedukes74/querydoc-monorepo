
export const EmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center py-12">
      <div className="text-6xl mb-4">📄💬</div>
      <p className="empty-state">
        Ask a question about your document to get started
      </p>
      <p className="text-slate-500 text-sm mt-2">
        I'll analyze your PDF and provide detailed answers
      </p>
    </div>
  );
};