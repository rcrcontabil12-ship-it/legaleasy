import { CheckCircle } from 'lucide-react';

export default function About() {
  const highlights = [
    { title: 'Profissionais Experientes', icon: '👥' },
    { title: 'Atendimento Ágil e Seguro', icon: '⚡' },
    { title: 'Expertise em Legislações', icon: '📋' },
    { title: 'Soluções Personalizadas', icon: '🎯' },
  ];

  return (
    <section id="quem-somos" className="py-20 md:py-32 bg-white">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-secondary font-semibold text-lg tracking-wide mb-4">
            QUEM SOMOS
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            Experiência e credibilidade na legalização de empresas
          </h2>
          <div className="w-16 h-1 bg-secondary rounded-full mx-auto" />
        </div>

        {/* Content */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          {/* Left Column - Text */}
          <div className="space-y-6">
            <p className="text-lg text-foreground/80 leading-relaxed">
              Estabelecida em 2020, a <strong>Legal Easy Assessoria de Legalização</strong> rapidamente se consolidou como referência em soluções empresariais e societárias. Somos especialistas em lidar com a burocracia dos órgãos públicos, oferecendo agilidade e segurança jurídica em processos de abertura, alteração, extinção e regularização de empresas.
            </p>
            <p className="text-lg text-foreground/80 leading-relaxed">
              Nosso diferencial está no profundo conhecimento técnico e prático das legislações empresariais e normas reguladoras. Atendemos escritórios contábeis e empresas que buscam terceirizar processos com qualidade, confiança e resultados. Conte com a nossa equipe para simplificar o que é complexo e garantir tranquilidade para o seu negócio.
            </p>
          </div>

          {/* Right Column - Highlights */}
          <div className="grid grid-cols-2 gap-6">
            {highlights.map((item, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-secondary/10 to-primary/10 p-6 rounded-lg border border-secondary/20 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-start gap-3">
                  <CheckCircle className="text-secondary flex-shrink-0 mt-1" size={24} />
                  <h3 className="font-semibold text-primary text-sm md:text-base">
                    {item.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Button */}
        <div className="flex justify-center">
          <a
            href="https://wa.me/5511999579319"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary"
          >
            Fale Conosco
          </a>
        </div>
      </div>
    </section>
  );
}
