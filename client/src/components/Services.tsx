import { CheckCircle } from 'lucide-react';

export default function Services() {
  const services = [
    {
      id: 1,
      title: 'Legalização de Empresas',
      description: 'Constituição, alteração, extinção e regularização de sociedades, incluindo elaboração de contratos e distratos.',
      image: '/images/service1.png',
    },
    {
      id: 2,
      title: 'Certidões e Licenças',
      description: 'Emissão de certidões negativas e obtenção de licenças municipais e sanitárias para funcionamento.',
      image: '/images/service2.png',
    },
    {
      id: 3,
      title: 'Consultoria Tributária e Societária',
      description: 'Assessoria para alterações tributárias e planejamento sucessório por meio de holdings e reestruturações.',
      image: '/images/service3.png',
    },
    {
      id: 4,
      title: 'Documentação para Licitações',
      description: 'Orientação e preparo completo para empresas que precisam participar de processos licitatórios.',
      image: '/images/service4.png',
    },
  ];

  return (
    <section id="servicos" className="py-20 md:py-32 bg-white">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-secondary font-semibold text-lg tracking-wide mb-4">
            NOSSOS SERVIÇOS
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
            Soluções inteligentes para legalizar e planejar sua empresa
          </h2>
          <div className="w-16 h-1 bg-secondary rounded-full mx-auto" />
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {services.map((service) => (
            <div
              key={service.id}
              className="card-service overflow-hidden group"
            >
              {/* Image Container */}
              <div className="relative h-64 overflow-hidden bg-gray-200">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {/* Icon Overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-colors duration-300">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <CheckCircle className="text-white" size={32} />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 md:p-8">
                <h3 className="text-2xl font-bold text-primary mb-3">
                  {service.title}
                </h3>
                <p className="text-foreground/80 mb-6 leading-relaxed">
                  {service.description}
                </p>
                <a
                  href="https://wa.me/5511999579319"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-secondary font-semibold hover:text-primary transition-colors duration-300 border-b-2 border-secondary hover:border-primary pb-1"
                >
                  FALE CONOSCO
                  <span>→</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
