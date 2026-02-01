import { Zap, BookOpen, Users } from 'lucide-react';

export default function WhyUs() {
  const reasons = [
    {
      icon: Zap,
      title: 'Agilidade Comprovada',
      description: 'Reduzimos prazos e entregamos resultados eficientes para sua empresa.',
    },
    {
      icon: BookOpen,
      title: 'Especialistas em Legislação',
      description: 'Conhecimento técnico e prático aprofundado em normas reguladoras e empresariais.',
    },
    {
      icon: Users,
      title: 'Profissionais Experientes',
      description: 'Uma equipe de profissionais com mais de 20 anos de experiência, preparada para oferecer o suporte que você precisa.',
    },
  ];

  return (
    <section id="por-que-nos" className="py-20 md:py-32 bg-gradient-to-b from-primary/5 to-white">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-secondary font-semibold text-lg tracking-wide mb-4">
            POR QUE NÓS
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
            Por que escolher Legal Easy?
          </h2>
          <p className="text-lg text-foreground/80 max-w-2xl mx-auto leading-relaxed">
            Escolher a Legal Easy é optar por segurança, eficiência e um parceiro estratégico para o sucesso da sua empresa. Entendemos os desafios da burocracia e entregamos soluções ágeis e personalizadas. Nosso conhecimento avançado nas legislações empresariais garante processos realizados com excelência e total tranquilidade para você.
          </p>
          <div className="w-16 h-1 bg-secondary rounded-full mx-auto mt-6" />
        </div>

        {/* Reasons Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {reasons.map((reason, index) => {
            const Icon = reason.icon;
            return (
              <div
                key={index}
                className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-border"
              >
                <div className="flex items-center justify-center w-16 h-16 bg-secondary/10 rounded-full mb-6">
                  <Icon className="text-secondary" size={32} />
                </div>
                <h3 className="text-xl font-bold text-primary mb-4">
                  {reason.title}
                </h3>
                <p className="text-foreground/80 leading-relaxed">
                  {reason.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="bg-primary text-white rounded-lg p-8 md:p-12 text-center">
          <p className="text-lg mb-6">
            Toque no botão para falar conosco por WhatsApp e saber mais agora mesmo!
          </p>
          <a
            href="https://wa.me/5511999579319"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-3 bg-white text-primary font-semibold rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-105"
          >
            Fale Conosco
          </a>
        </div>
      </div>
    </section>
  );
}
