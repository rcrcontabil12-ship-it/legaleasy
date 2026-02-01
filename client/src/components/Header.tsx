import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
      <div className="container flex items-center justify-between py-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <img src="/images/logo.png" alt="Legal Easy" className="h-10 w-auto" />
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <button
            onClick={() => scrollToSection('inicio')}
            className="text-foreground hover:text-primary transition-colors duration-300 font-medium"
          >
            Início
          </button>
          <button
            onClick={() => scrollToSection('quem-somos')}
            className="text-foreground hover:text-primary transition-colors duration-300 font-medium"
          >
            Quem Somos
          </button>
          <button
            onClick={() => scrollToSection('servicos')}
            className="text-foreground hover:text-primary transition-colors duration-300 font-medium"
          >
            Serviços
          </button>
          <button
            onClick={() => scrollToSection('contato')}
            className="text-foreground hover:text-primary transition-colors duration-300 font-medium"
          >
            Contato
          </button>
        </nav>

        {/* WhatsApp Button */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href="https://wa.me/5511999579319"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 btn-primary"
          >
            <img src="/images/whatsapp_icon.png" alt="WhatsApp" className="h-5 w-5" />
            <span className="hidden lg:inline">(11) 99957-9319</span>
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-foreground"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-border">
          <nav className="container py-4 flex flex-col gap-4">
            <button
              onClick={() => scrollToSection('inicio')}
              className="text-foreground hover:text-primary transition-colors duration-300 font-medium text-left"
            >
              Início
            </button>
            <button
              onClick={() => scrollToSection('quem-somos')}
              className="text-foreground hover:text-primary transition-colors duration-300 font-medium text-left"
            >
              Quem Somos
            </button>
            <button
              onClick={() => scrollToSection('servicos')}
              className="text-foreground hover:text-primary transition-colors duration-300 font-medium text-left"
            >
              Serviços
            </button>
            <button
              onClick={() => scrollToSection('contato')}
              className="text-foreground hover:text-primary transition-colors duration-300 font-medium text-left"
            >
              Contato
            </button>
            <a
              href="https://wa.me/5511999579319"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex items-center justify-center gap-2"
            >
              <img src="/images/whatsapp_icon.png" alt="WhatsApp" className="h-5 w-5" />
              (11) 99957-9319
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
