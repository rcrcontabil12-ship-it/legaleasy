import Header from '@/components/Header';
import Hero from '@/components/Hero';
import About from '@/components/About';
import WhyUs from '@/components/WhyUs';
import Services from '@/components/Services';
import Contact from '@/components/Contact';
import { useAuth } from "@/_core/hooks/useAuth";

/**
 * Design: Minimalismo Corporativo Moderno
 * Cores: Azul profundo (#1a3a5c) + Verde suave (#2d9d78)
 * Tipografia: Montserrat (títulos) + Inter (corpo)
 * Estilo: Profissional, limpo, com muito espaço negativo
 */

export default function Home() {
  // Auth context disponível para futuras funcionalidades
  const { user, loading, isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <About />
        <WhyUs />
        <Services />
        <Contact />
      </main>
    </div>
  );
}
