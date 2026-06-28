export function Panel({
  title,
  children,
  action,
}: {
  title?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border border-line bg-panel p-5 shadow-soft">
      {title || action ? (
        <div className="mb-4 flex items-center justify-between gap-4">
          {title ? <h2 className="section-title">{title}</h2> : <span />}
          {action}
        </div>
      ) : null}
      {children}
    </section>
  );
}
