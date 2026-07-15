export function Navbar() {
  return (
    <nav className="flex items-center justify-between px-6 py-4">
      <div className="text-lg font-semibold">SproutWFS</div>
      <div className="flex gap-4 text-sm">
        <a href="#services" className="hover:underline">Services</a>
        <a href="#industries" className="hover:underline">Industries</a>
        <a href="#contact" className="hover:underline">Contact</a>
      </div>
    </nav>
  );
}
