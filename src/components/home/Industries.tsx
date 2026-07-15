const industries = ["Healthcare", "Finance", "Retail", "Technology", "Education"];

export function Industries() {
  return (
    <section id="industries" className="px-6 py-20">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-3xl font-semibold">Industries we support</h2>
        <div className="mt-8 flex flex-wrap gap-3">
          {industries.map((industry) => (
            <span key={industry} className="rounded-full border px-4 py-2 text-sm">
              {industry}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
