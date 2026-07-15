const services = [
  {
    title: "Web Development",
    description: "Fast, scalable websites and applications tailored to your goals.",
  },
  {
    title: "Digital Strategy",
    description: "Data-informed planning that turns ideas into measurable growth.",
  },
  {
    title: "Brand Experience",
    description: "Design systems and interfaces that feel polished and memorable.",
  },
];

export function Services() {
  return (
    <section id="services" className="px-6 py-20">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-3xl font-semibold">Services</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {services.map((service) => (
            <div key={service.title} className="rounded-lg border p-6">
              <h3 className="font-semibold">{service.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
