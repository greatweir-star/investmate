export function PageHeader({
  title,
  description,
  question,
}: {
  title: string;
  description: string;
  question?: string;
}) {
  return (
    <section className="mb-6 flex flex-col gap-3">
      <h1 className="text-3xl font-extrabold leading-tight text-ink md:text-4xl">{title}</h1>
      <p className="max-w-3xl text-base leading-7 text-slate-600">{description}</p>
      {question ? (
        <p className="max-w-3xl rounded-md border border-line bg-white px-4 py-3 text-sm leading-6 text-slate-700">
          {question}
        </p>
      ) : null}
    </section>
  );
}
