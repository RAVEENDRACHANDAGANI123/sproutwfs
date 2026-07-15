export function Hero() {
  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          Build smarter digital experiences for your business.
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
          From strategy to execution, we help ambitious brands grow with modern web solutions.
        </p>
        <div className="mt-8 flex gap-4">
          <a href="#contact" className="rounded-md bg-primary px-4 py-2 text-primary-foreground">
            Get Started
          </a>
          <a href="#services" className="rounded-md border px-4 py-2">
            Explore Services
          </a>
        </div>
      </div>
    </section>
  );
}
