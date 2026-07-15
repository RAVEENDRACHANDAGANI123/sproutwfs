const points = [
  "Strategic thinking with execution focus",
  "Modern stack and maintainable architecture",
  "Clear communication from kickoff to launch",
];

export function WhyChooseUs() {
  return (
    <section className="bg-muted/40 px-6 py-20">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-3xl font-semibold">Why choose us</h2>
        <ul className="mt-8 space-y-3">
          {points.map((point) => (
            <li key={point} className="rounded-md border bg-background p-4">
              {point}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
