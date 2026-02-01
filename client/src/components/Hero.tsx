export default function Hero() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="inicio"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/images/hero_bg.png)',
          opacity: 0.3,
        }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/40 to-primary/20" />

      {/* Content */}
      <div className="relative container flex flex-col items-center justify-center text-center gap-8 py-20">
        <div className="space-y-4">
          <p className="text-secondary font-semibold text-lg md:text-xl tracking-wide">
            BEM-VINDOS À LEGAL EASY
          </p>
          <h1 className="text-4xl md:text-6xl font-bold text-primary leading-tight">
            Facilitando a burocracia empresarial com eficiência e segurança
          </h1>
          <p className="text-lg md:text-xl text-foreground/80 max-w-2xl mx-auto">
            Legalize sua empresa com quem entende do assunto.
          </p>
        </div>

        {/* CTA Button */}
        <button
          onClick={() => scrollToSection('contato')}
          className="btn-primary text-lg md:text-base"
        >
          FALE CONOSCO
        </button>

        {/* Divider Line */}
        <div className="mt-12 w-16 h-1 bg-secondary rounded-full" />
      </div>
    </section>
  );
}
