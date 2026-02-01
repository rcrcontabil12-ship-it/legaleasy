import { MessageCircle, Phone, MapPin, Mail, Instagram } from 'lucide-react';

export default function Contact() {
  const contactMethods = [
    {
      icon: MessageCircle,
      title: 'Fale conosco pelo WhatsApp',
      value: '(11) 99957-9319',
      link: 'https://wa.me/5511999579319',
    },
    {
      icon: Phone,
      title: 'Ligue para nós',
      value: '(11) 99957-9319',
      link: 'tel:+5511999579319',
    },
    {
      icon: MapPin,
      title: 'Endereço',
      value: 'R. Paulo di Favari, 694 - Sala 1, 2º Andar - Rudge Ramos, São Bernardo do Campo - SP, 09618-100',
      link: 'https://maps.google.com/?q=R.+Paulo+di+Favari,+694',
    },
  ];

  return (
    <>
      {/* Contact Section */}
      <section id="contato" className="py-20 md:py-32 bg-gradient-to-b from-white to-primary/5">
        <div className="container">
          {/* Section Header */}
          <div className="text-center mb-16">
            <p className="text-secondary font-semibold text-lg tracking-wide mb-4">
              CONTATO
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
              Alguma dúvida? Entre em contato conosco!
            </h2>
            <div className="w-16 h-1 bg-secondary rounded-full mx-auto" />
          </div>

          {/* Contact Methods Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {contactMethods.map((method, index) => {
              const Icon = method.icon;
              return (
                <a
                  key={index}
                  href={method.link}
                  target={method.link.startsWith('http') && !method.link.startsWith('tel') ? '_blank' : '_self'}
                  rel={method.link.startsWith('http') && !method.link.startsWith('tel') ? 'noopener noreferrer' : ''}
                  className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-border group"
                >
                  <div className="flex items-center justify-center w-16 h-16 bg-secondary/10 rounded-full mb-6 group-hover:bg-secondary/20 transition-colors duration-300">
                    <Icon className="text-secondary" size={32} />
                  </div>
                  <h3 className="text-lg font-semibold text-primary mb-2">
                    {method.title}
                  </h3>
                  <p className="text-foreground/80 break-words">
                    {method.value}
                  </p>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-white py-12 md:py-16">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            {/* Logo Column */}
            <div className="flex flex-col gap-4">
              <img src="/images/logo.png" alt="Legal Easy" className="h-10 w-auto" />
              <p className="text-white/80 text-sm">
                Assessoria de Legalização Empresarial
              </p>
            </div>

            {/* Navigation Column */}
            <div>
              <h4 className="font-semibold mb-4">Navegação</h4>
              <ul className="space-y-2 text-white/80 text-sm">
                <li>
                  <a href="#inicio" className="hover:text-white transition-colors duration-300">
                    Início
                  </a>
                </li>
                <li>
                  <a href="#quem-somos" className="hover:text-white transition-colors duration-300">
                    Quem Somos
                  </a>
                </li>
                <li>
                  <a href="#servicos" className="hover:text-white transition-colors duration-300">
                    Serviços
                  </a>
                </li>
                <li>
                  <a href="#contato" className="hover:text-white transition-colors duration-300">
                    Contato
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact Column */}
            <div>
              <h4 className="font-semibold mb-4">Contato</h4>
              <ul className="space-y-2 text-white/80 text-sm">
                <li>
                  <a
                    href="https://wa.me/5511999579319"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors duration-300"
                  >
                    WhatsApp
                  </a>
                </li>
                <li>
                  <a
                    href="tel:+5511999579319"
                    className="hover:text-white transition-colors duration-300"
                  >
                    (11) 99957-9319
                  </a>
                </li>
                <li>
                  <a
                    href="https://maps.google.com/?q=R.+Paulo+di+Favari,+694"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors duration-300"
                  >
                    São Bernardo do Campo - SP
                  </a>
                </li>
              </ul>
            </div>

            {/* Social Column */}
            <div>
              <h4 className="font-semibold mb-4">Redes Sociais</h4>
              <div className="flex gap-4">
                <a
                  href="https://wa.me/5511999579319"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors duration-300"
                  title="WhatsApp"
                >
                  <MessageCircle size={20} />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors duration-300"
                  title="Instagram"
                >
                  <Instagram size={20} />
                </a>
                <a
                  href="mailto:contato@legaleasy.com.br"
                  className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors duration-300"
                  title="E-mail"
                >
                  <Mail size={20} />
                </a>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-white/20 pt-8 text-center text-white/80 text-sm">
            <p>© Copyright 2024 | Legal Easy</p>
            <p className="mt-2">Desenvolvido cuidadosamente por Digital Bloom</p>
          </div>
        </div>
      </footer>
    </>
  );
}
