import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, MapPin, Phone, Instagram, Star, ArrowRight, ChevronRight, Calendar } from 'lucide-react';

// --- Custom Cursor ---
const CustomCursor = () => {
  useEffect(() => {
    if (window.innerWidth < 768) return;

    const cursor = document.getElementById('custom-cursor');
    const follower = document.getElementById('custom-cursor-follower');
    
    const onMouseMove = (e) => {
      if (cursor) cursor.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      if (follower) follower.style.transform = `translate3d(${e.clientX - 14}px, ${e.clientY - 14}px, 0)`;
    };

    const handleHover = () => follower?.classList.add('cursor-hover');
    const handleLeave = () => follower?.classList.remove('cursor-hover');

    window.addEventListener('mousemove', onMouseMove);
    
    const interactiveElements = document.querySelectorAll('a, button, .hover-trigger');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', handleHover);
      el.addEventListener('mouseleave', handleLeave);
    });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', handleHover);
        el.removeEventListener('mouseleave', handleLeave);
      });
    };
  }, []);

  return (
    <>
      <div id="custom-cursor" className="fixed w-3 h-3 bg-[#C5A880] rounded-full pointer-events-none z-[9999] top-0 left-0 hidden md:block" />
      <div id="custom-cursor-follower" className="fixed w-10 h-10 border border-[#C5A880] rounded-full pointer-events-none z-[9998] top-0 left-0 transition-all duration-200 ease-out hidden md:block" />
    </>
  );
};

// --- Global Scroll Progress Bar ---
const ProgressBar = () => {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const updateProgress = () => {
      const scrollPx = document.documentElement.scrollTop;
      const winHeightPx = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      setProgress((scrollPx / winHeightPx) * 100);
    };
    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
    return () => window.removeEventListener('scroll', updateProgress);
  }, []);
  return <div className="fixed bottom-0 left-0 h-[3px] bg-[#C5A880] z-[100] transition-all duration-75 ease-out" style={{ width: `${progress}%` }} />;
};

// --- Custom Hook for Scroll Animations ---
const useScrollReveal = () => {
  const ref = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
    if (ref.current) observer.observe(ref.current);
    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, []);
  return ref;
};

// --- Components ---

const TopBar = () => (
  <div className="bg-slate-950 text-white text-[10px] md:text-xs py-2 px-4 flex justify-between items-center hidden md:flex font-sans tracking-widest uppercase">
    <div className="flex items-center space-x-6">
      <span className="flex items-center"><MapPin size={12} className="mr-2 text-[#C5A880]"/> 222 NE 25th St Unit 101, Miami, FL 33137</span>
      <span className="flex items-center"><Phone size={12} className="mr-2 text-[#C5A880]"/> 305-571-7279</span>
    </div>
    <div className="flex items-center space-x-6">
      <a href="https://booking.mangomint.com/elitestyles" target="_blank" rel="noopener noreferrer" className="hover:text-[#C5A880] transition-colors hover-trigger">Client Portal</a>
      <a href="https://www.instagram.com/elite.medspa/" target="_blank" rel="noopener noreferrer" className="hover:text-[#C5A880] transition-colors flex items-center hover-trigger"><Instagram size={12} className="mr-2"/> Follow Us</a>
    </div>
  </div>
);

const Navbar = ({ scrolled }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-500 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex-shrink-0 flex items-center cursor-pointer hover-trigger" onClick={() => window.scrollTo(0,0)}>
            <h1 className={`font-serif text-2xl md:text-3xl tracking-wider ${scrolled ? 'text-slate-900' : 'text-white'}`}>
              ELITE<span className="font-light italic ml-1">Styles</span>
              <span className="block text-[9px] md:text-[10px] tracking-[0.35em] uppercase font-sans mt-1 text-[#C5A880]">Salon & Med Spa</span>
            </h1>
          </div>

          <div className="hidden lg:flex items-center space-x-8">
            {['About', 'Treatments', 'Team', 'Membership', 'Journal'].map((item) => (
              <a key={item} href={`#${item.toLowerCase().replace(' ', '-')}`} className={`text-[10px] tracking-widest uppercase font-bold nav-link relative ${scrolled ? 'text-slate-800' : 'text-white/90'} hover-trigger`}>
                {item}
              </a>
            ))}
            <a 
              href="https://booking.mangomint.com/elitestyles" 
              target="_blank" 
              rel="noopener noreferrer"
              className={`px-6 py-3 text-xs tracking-widest uppercase transition-all duration-300 border flex items-center hover-trigger
                ${scrolled 
                  ? 'bg-slate-900 text-white border-slate-900 hover:bg-[#C5A880] hover:border-[#C5A880]' 
                  : 'bg-white/10 text-white border-white/30 backdrop-blur-sm hover:bg-white hover:text-slate-900'}`}
            >
              Book Now
            </a>
          </div>

          <div className="lg:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className={`${scrolled ? 'text-slate-900' : 'text-white'} hover-trigger`}>
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      <div className={`lg:hidden absolute top-full left-0 w-full bg-white shadow-2xl transition-all duration-300 origin-top ${isOpen ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0'}`}>
        <div className="px-4 pt-2 pb-6 space-y-1">
          {['About', 'Treatments', 'Team', 'Membership', 'Journal', 'Contact'].map((item) => (
            <a key={item} href={`#${item.toLowerCase().replace(' ', '-')}`} className="block px-3 py-4 text-sm font-medium text-slate-800 border-b border-slate-100 uppercase tracking-widest" onClick={() => setIsOpen(false)}>
              {item}
            </a>
          ))}
          <div className="pt-6 pb-2">
             <a href="https://booking.mangomint.com/elitestyles" target="_blank" rel="noopener noreferrer" className="w-full block text-center bg-slate-900 text-white px-6 py-4 uppercase tracking-widest text-sm hover:bg-[#C5A880] transition-colors">
              Book Appointment
             </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

const Hero = () => {
  return (
    <div className="relative h-screen min-h-[700px] flex flex-col justify-end pb-24 md:pb-32 overflow-hidden bg-slate-950">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=2940&auto=format&fit=crop" 
          alt="Luxury Aesthetic Patient" 
          className="w-full h-full object-cover object-top opacity-50 animate-[imageScale_4s_cubic-bezier(0.16,1,0.3,1)_forwards]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-transparent to-transparent"></div>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl">
          <div className="overflow-hidden mb-6">
            <span className="block text-[#C5A880] text-xs md:text-sm tracking-[0.4em] uppercase font-medium animate-[revealText_1.2s_cubic-bezier(0.16,1,0.3,1)_0.2s_both]">
              Melasma Specialists & Advanced Injectables
            </span>
          </div>

          <h1 className="font-serif text-white flex flex-col text-5xl sm:text-7xl md:text-8xl lg:text-[7rem] leading-[0.9] mb-8">
            <div className="overflow-hidden pb-2 md:pb-4">
              <span className="block animate-[revealText_1.2s_cubic-bezier(0.16,1,0.3,1)_0.4s_both]">
                Elite
              </span>
            </div>
            <div className="overflow-hidden pb-2 md:pb-4">
              <span className="block animate-[revealText_1.2s_cubic-bezier(0.16,1,0.3,1)_0.6s_both] text-transparent italic ml-8 md:ml-24 text-stroke">
                Aesthetics
              </span>
            </div>
          </h1>

          <div className="animate-[fadeBlur_1.5s_cubic-bezier(0.16,1,0.3,1)_0.9s_both]">
            <p className="text-white/70 text-base md:text-lg font-light mb-10 max-w-xl leading-relaxed">
              Providing hyperpigmentation solutions, anti-aging results, and luxury salon services at the intersection of lifestyle and medical science in Edgewater, Miami.
            </p>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-8">
              <a 
                href="https://booking.mangomint.com/elitestyles" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="group relative px-8 py-4 bg-white overflow-hidden w-full sm:w-auto text-center hover-trigger"
              >
                <div className="absolute inset-0 bg-[#C5A880] translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 cubic-bezier(0.16,1,0.3,1)"></div>
                <span className="relative z-10 text-slate-900 group-hover:text-white text-xs tracking-[0.2em] uppercase font-medium transition-colors duration-500">
                  Book Appointment
                </span>
              </a>
              
              <a href="#treatments" className="group flex items-center text-white text-xs tracking-[0.2em] uppercase font-medium hover:text-[#C5A880] transition-colors duration-500 hover-trigger">
                Explore Services 
                <span className="ml-3 w-8 h-[1px] bg-white group-hover:bg-[#C5A880] group-hover:w-12 transition-all duration-500"></span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AboutSection = () => {
  const textRef = useScrollReveal();
  const imageRef = useScrollReveal();
  const badgeRef = useScrollReveal();

  return (
    <section id="about" className="py-32 md:py-48 bg-[#FAF9F6] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">

          <div ref={textRef} className="lg:col-span-7 flex flex-col justify-center reveal-item">
            <div className="flex items-center space-x-6 mb-10">
               <div className="w-16 h-[1px] bg-[#C5A880]"></div>
               <span className="text-[#C5A880] text-xs tracking-[0.4em] uppercase font-bold">The Elite Experience</span>
            </div>

            <h2 className="font-serif text-5xl md:text-6xl lg:text-7xl text-slate-900 mb-12 leading-[1.1]">
              Where Clinical Science <br className="hidden md:block"/> 
              <span className="italic text-slate-400">Meets Luxury Artistry.</span>
            </h2>

            <div className="space-y-8 pl-0 md:pl-12 border-l border-transparent md:border-slate-200">
              <p className="text-slate-600 font-light text-lg md:text-xl leading-relaxed">
                Established in 2016 by partners Beto Pellegrino and Franco Hernandez, Elite Styles Salon and Med Spa is a beacon of elegance nestled in Miami’s vibrant Edgewater neighborhood.
              </p>
              <p className="text-slate-600 font-light text-lg md:text-xl leading-relaxed">
                We operate at the unique intersection of luxury hair care and advanced clinical dermatology. Whether you require meticulous melasma management, precision dermal fillers, or a flawless balayage, our highly trained practitioners design personalized regimens for both immediate cosmetic results and long-term biological maintenance.
              </p>

              <div className="pt-8">
                <a 
                  href="https://booking.mangomint.com/elitestyles" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="group inline-flex items-center text-slate-900 uppercase tracking-[0.2em] text-xs font-bold hover-trigger"
                >
                  <span className="border-b border-slate-900 pb-2 group-hover:text-[#C5A880] group-hover:border-[#C5A880] transition-colors">Book a Consultation</span>
                  <ArrowRight size={16} className="ml-6 transform group-hover:translate-x-3 transition-transform duration-300" />
                </a>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 relative mt-12 lg:mt-0">
             <div ref={imageRef} className="relative w-full aspect-[3/4] overflow-hidden rounded-sm group reveal-item" style={{ transitionDelay: '200ms' }}>
                <img 
                  src="https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?q=80&w=2940&auto=format&fit=crop" 
                  className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-[2s] ease-out" 
                  alt="Elite Styles Med Spa Interior" 
                />
                <div className="absolute inset-0 bg-slate-900/5 group-hover:bg-transparent transition-colors duration-700"></div>
             </div>
             
             <div ref={badgeRef} className="absolute -bottom-12 -left-8 md:-left-16 w-48 md:w-56 aspect-square bg-white p-3 shadow-2xl z-10 reveal-item" style={{ transitionDelay: '400ms' }}>
                <div className="w-full h-full border border-[#C5A880]/30 flex flex-col items-center justify-center p-6 text-center bg-[#FAF9F6]">
                   <span className="font-serif text-3xl md:text-4xl text-slate-900 block mb-2 italic">Est.</span>
                   <span className="text-[#C5A880] text-base md:text-lg tracking-[0.3em] font-bold">2016</span>
                   <span className="w-12 h-[1px] bg-slate-300 my-4"></span>
                   <span className="text-slate-500 text-[9px] md:text-[10px] tracking-widest uppercase font-bold">Edgewater, FL</span>
                </div>
             </div>
          </div>

        </div>
      </div>
    </section>
  );
};

// --- NEW SECTION: Clinical Expertise (Melasma Focus) ---
const ClinicalExpertise = () => {
  const textRef = useScrollReveal();
  const imageRef = useScrollReveal();

  return (
    <section className="py-24 md:py-32 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <div ref={imageRef} className="relative aspect-square md:aspect-[4/3] overflow-hidden rounded-sm reveal-item">
            <img 
              src="https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?q=80&w=2940&auto=format&fit=crop" 
              className="w-full h-full object-cover" 
              alt="Clear, radiant skin"
            />
            <div className="absolute inset-0 bg-[#C5A880]/10 mix-blend-multiply"></div>
          </div>

          <div ref={textRef} className="flex flex-col justify-center reveal-item lg:pl-10">
            <h3 className="font-serif text-3xl md:text-4xl lg:text-5xl text-slate-900 mb-6 leading-tight">
              Miami's Premier <br/> <span className="italic text-[#C5A880]">Melasma Specialists</span>
            </h3>
            <p className="text-slate-600 font-light text-base md:text-lg leading-relaxed mb-6">
              Hyperpigmentation and melasma require more than just surface-level treatments. They demand a profound clinical understanding of the skin's biology. 
            </p>
            <p className="text-slate-600 font-light text-base md:text-lg leading-relaxed mb-10">
              Understanding the causes of melasma is our first step in managing and treating it effectively. From specialized medical-grade Chemical Peels to advanced collagen induction therapy via SkinPen® Microneedling, we craft targeted interventions that clear your complexion and prevent future flare-ups.
            </p>
            
            <ul className="space-y-4 mb-10 border-t border-slate-100 pt-8">
              {['Comprehensive Pigment Analysis', 'Customized Chemical Peels', 'SkinPen® Microneedling Integration', 'Long-term Maintenance Regimens'].map((item, i) => (
                <li key={i} className="flex items-center text-sm font-bold tracking-widest uppercase text-slate-800">
                  <span className="w-1.5 h-1.5 bg-[#C5A880] mr-4 rotate-45"></span> {item}
                </li>
              ))}
            </ul>

            <a href="https://booking.mangomint.com/elitestyles" target="_blank" rel="noopener noreferrer" className="text-xs tracking-[0.2em] font-bold uppercase text-slate-900 border-b-2 border-[#C5A880] pb-1 w-max hover:text-[#C5A880] transition-colors hover-trigger">
              Start Your Skin Journey
            </a>
          </div>

        </div>
      </div>
    </section>
  );
};

// --- HORIZONTAL SCROLLING GALLERY ---
const HorizontalGallery = () => {
  const containerRef = useRef(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const scrollableDistance = rect.height - viewportHeight;
      const currentScroll = -rect.top;
      
      let p = currentScroll / scrollableDistance;
      p = Math.max(0, Math.min(1, p));
      setProgress(p);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const translateX = `-${progress * 80}%`;

  const slides = [
    {
      subtitle: "01 / INJECT IT",
      title: "Neuromodulators & Fillers",
      desc: "Restore youthful volume and smooth dynamic wrinkles with premium injectables including Botox, Dysport, Xeomin, and dermal fillers like Radiesse.",
      img: "https://images.unsplash.com/photo-1552693673-1bf958298935?q=80&w=2940&auto=format&fit=crop"
    },
    {
      subtitle: "02 / FACE IT",
      title: "Advanced Skin Treatments",
      desc: "Specializing in Melasma and hyperpigmentation. Featuring SkinPen® Microneedling, medical-grade Chemical Peels, and HydraFacials.",
      img: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?q=80&w=2940&auto=format&fit=crop"
    },
    {
      subtitle: "03 / BEAUTIFY IT",
      title: "Salon & Eyelash Services",
      desc: "Complete head-to-toe beauty. Luxurious hair care, extensions, coloring, balayage, alongside expert microblading and eyelash lifts/tinting.",
      img: "https://images.unsplash.com/photo-1562322140-8baeececf3df?q=80&w=2938&auto=format&fit=crop"
    },
    {
      subtitle: "04 / HEAL IT",
      title: "Regenerative IV Therapy",
      desc: "Boost your immune system, enhance athletic recovery, and achieve a radiant glow from the inside out with our custom-formulated IV cocktails.",
      img: "https://images.unsplash.com/photo-1584362917165-526a968579e8?q=80&w=2940&auto=format&fit=crop"
    }
  ];

  return (
    <section id="treatments" ref={containerRef} className="h-[500vh] relative bg-white border-y border-slate-100">
      <div className="sticky top-0 h-screen overflow-hidden flex items-center pt-20 md:pt-28">
        <div 
          className="flex h-full w-[500vw] will-change-transform ease-out transition-transform duration-75"
          style={{ transform: `translate3d(${translateX}, 0, 0)` }}
        >
          <div className="w-[100vw] h-full flex items-center justify-center p-8 md:p-20 border-r border-slate-200 bg-[#FAF9F6]">
            <div className="max-w-3xl text-center">
              <span className="text-[#C5A880] text-xs tracking-[0.4em] uppercase mb-6 block font-medium">Curated Offerings</span>
              <h2 className="font-serif text-5xl md:text-7xl lg:text-8xl text-slate-900 mb-8 leading-[1.1]">The Art of <br/><span className="italic">Refinement.</span></h2>
              <p className="text-slate-600 font-light text-lg mb-10">Scroll to explore our signature treatments.</p>
              <div className="w-[1px] h-24 bg-slate-300 mx-auto animate-[scrollLine_2.5s_cubic-bezier(0.8,0,0.2,1)_infinite] origin-top"></div>
            </div>
          </div>

          {slides.map((s, i) => (
            <div key={i} className="w-[100vw] h-full flex items-center justify-center p-8 md:p-20 border-r border-slate-200">
              <div className="grid md:grid-cols-2 w-full max-w-7xl gap-12 md:gap-24 items-center">
                <div className={`flex flex-col justify-center ${i % 2 === 0 ? 'order-2 md:order-1' : 'order-2'}`}>
                  <span className="text-xs font-sans font-bold text-slate-400 tracking-widest mb-4 uppercase">{s.subtitle}</span>
                  <h3 className="text-5xl md:text-6xl lg:text-7xl font-serif mb-6 text-slate-900">{s.title}</h3>
                  <p className="text-lg text-slate-600 mb-10 max-w-md font-light leading-relaxed">{s.desc}</p>
                  <a href="https://booking.mangomint.com/elitestyles" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-slate-900 uppercase tracking-widest text-xs border-b border-slate-900 pb-1 hover:text-[#C5A880] hover:border-[#C5A880] transition-colors w-max hover-trigger">
                    Book Procedure <ArrowRight size={14} className="ml-2" />
                  </a>
                </div>
                <div className={`relative overflow-hidden group aspect-[3/4] md:h-[70vh] w-full ${i % 2 === 0 ? 'order-1 md:order-2' : 'order-1'}`}>
                  <img src={s.img} className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-[1.5s] ease-out" alt={s.title} />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-700"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- TEAM SECTION ---
const TeamSection = () => {
  const headerRef = useScrollReveal();
  
  const team = [
    { 
      name: "Beto Pellegrino & Franco Hernandez", 
      role: "Founders & Master Stylists",
      bio: "Establishing Elite Styles in 2016, our founders blend visionary hair artistry with luxury service. Beto is celebrated by clients as Florida's premier colorist.",
      specialties: ["Balayage", "Master Color", "Luxury Hair Care"]
    },
    { 
      name: "Angela M. Rivera", 
      role: "APRN, FNP-C / Lead Injector",
      bio: "With over 7 years of experience in facial and body aesthetics, Angela crafts highly personalized injectable treatment plans to meet your exact cosmetic goals.",
      specialties: ["Neuromodulators", "Dermal Fillers", "Liquid BBL"]
    },
    { 
      name: "Vivian Mokwa", 
      role: "LME / Medical Esthetician",
      bio: "A highly sought-after esthetician specializing in total skin rejuvenation. Vivian delivers glowing, flawless results tailored to your unique complexion.",
      specialties: ["SkinPen® Microneedling", "HydraFacials", "Lash Lifts"]
    },
    { 
      name: "Jennifer Cody", 
      role: "FNP-BC / Aesthetic Injector",
      bio: "Dedicated to enhancing natural beauty, Jennifer specializes in precision facial balancing, lip enhancements, and restorative volume treatments.",
      specialties: ["Lip Filler", "Facial Contouring", "Anti-Aging"]
    }
  ];

  return (
    <section id="team" className="py-32 md:py-48 bg-[#FAF9F6] relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-[#C5A880]/10 blur-[100px] rounded-full"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-[#1E3A8A]/5 blur-[100px] rounded-full"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div ref={headerRef} className="text-center mb-20 reveal-item">
          <span className="text-[#C5A880] text-xs tracking-[0.4em] uppercase mb-4 block font-medium">The Experts</span>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-slate-900">Clinical & Styling Directors</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {team.map((member, i) => {
            const cardRef = useScrollReveal();
            return (
              <div key={i} ref={cardRef} className="reveal-item h-full" style={{ transitionDelay: `${i * 150}ms` }}>
                <div className="relative h-full p-8 md:p-10 flex flex-col justify-between overflow-hidden rounded-sm group hover-trigger bg-[#1E3A8A] border border-transparent hover:border-[#C5A880]/50 transition-all duration-500 ease-out shadow-lg hover:shadow-2xl hover:-translate-y-2 cursor-pointer">
                  
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
                  
                  <div className="relative z-10">
                    <div className="w-8 h-[1px] bg-[#C5A880] mb-8 transition-all duration-500 group-hover:w-16"></div>
                    <h3 className="font-serif text-2xl md:text-3xl text-white mb-3 leading-tight">{member.name}</h3>
                    <p className="text-[#C5A880] text-[9px] uppercase tracking-[0.2em] font-bold mb-6">{member.role}</p>
                    <p className="text-white/70 font-light text-sm leading-relaxed mb-8">
                      {member.bio}
                    </p>
                  </div>

                  <div className="relative z-10 mt-auto border-t border-white/10 pt-6">
                    <p className="text-white/40 text-[10px] uppercase tracking-widest mb-4">Specialties</p>
                    <ul className="space-y-3">
                      {member.specialties.map((spec, idx) => (
                        <li key={idx} className="text-white/90 text-xs font-light flex items-center">
                          <span className="w-1.5 h-1.5 bg-[#C5A880] rounded-full mr-3 opacity-80"></span>
                          {spec}
                        </li>
                      ))}
                    </ul>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// --- NEW SECTION: Memberships ---
const MembershipSection = () => {
  const ref = useScrollReveal();
  
  return (
    <section id="membership" className="py-32 bg-slate-950 relative overflow-hidden text-white">
      {/* Decorative background lines */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 left-[20%] w-[1px] h-full bg-gradient-to-b from-transparent via-[#C5A880] to-transparent"></div>
        <div className="absolute top-0 left-[80%] w-[1px] h-full bg-gradient-to-b from-transparent via-[#C5A880] to-transparent"></div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <div ref={ref} className="reveal-item">
          <Star className="text-[#C5A880] mx-auto mb-6" size={32} strokeWidth={1} />
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl mb-8">The Elite Membership</h2>
          <p className="font-light text-white/70 text-lg max-w-2xl mx-auto mb-12">
            Elevate your self-care routine. Join the Elite Styles Membership service to unlock exclusive discounts, priority booking, and curated monthly treatments designed to maintain your perfect look year-round.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 text-left">
            {['Exclusive Pricing on Injectables', 'Monthly VIP Salon Perks', 'Priority Event Invitations'].map((perk, i) => (
              <div key={i} className="border border-white/10 p-8 rounded-sm hover:border-[#C5A880]/40 transition-colors bg-white/5">
                <span className="text-[#C5A880] font-serif text-2xl block mb-4">0{i+1}</span>
                <p className="font-sans text-sm tracking-widest uppercase font-bold">{perk}</p>
              </div>
            ))}
          </div>

          <a href="#" className="inline-block bg-[#C5A880] text-slate-900 px-10 py-4 uppercase tracking-[0.2em] text-xs font-bold hover:bg-white transition-colors hover-trigger">
            Inquire About Membership
          </a>
        </div>
      </div>
    </section>
  );
};

// --- NEW SECTION: Editorial & Insights (Blog) ---
const JournalSection = () => {
  const headerRef = useScrollReveal();
  
  const articles = [
    {
      category: "Injectables",
      title: "Miami Botox & Fillers: Why Choose Us?",
      date: "Oct 2024",
      img: "https://images.unsplash.com/photo-1552693673-1bf958298935?q=80&w=2940&auto=format&fit=crop"
    },
    {
      category: "Skin Rejuvenation",
      title: "Shrinking Pores with SkinPen® Microneedling",
      date: "May 2025",
      img: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?q=80&w=2938&auto=format&fit=crop"
    },
    {
      category: "Beautify It",
      title: "How Long Can Eyelash Lift Results Last?",
      date: "Aug 2024",
      img: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?q=80&w=2940&auto=format&fit=crop"
    }
  ];

  return (
    <section id="journal" className="py-32 bg-[#FAF9F6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={headerRef} className="flex flex-col md:flex-row justify-between items-end mb-16 reveal-item">
          <div>
            <span className="text-[#C5A880] text-xs tracking-[0.4em] uppercase mb-4 block font-medium">Editorial</span>
            <h2 className="font-serif text-4xl md:text-5xl text-slate-900">Aesthetic Insights</h2>
          </div>
          <a href="#" className="hidden md:inline-flex items-center text-slate-900 uppercase tracking-widest text-xs border-b border-slate-900 pb-1 hover:text-[#C5A880] hover:border-[#C5A880] transition-colors hover-trigger">
            Read The Journal <ArrowRight size={14} className="ml-2" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.map((article, i) => {
            const cardRef = useScrollReveal();
            return (
              <a key={i} href="#" ref={cardRef} className="group reveal-item block hover-trigger" style={{ transitionDelay: `${i * 150}ms` }}>
                <div className="relative aspect-[4/3] overflow-hidden mb-6 rounded-sm">
                  <img src={article.img} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1.5s] ease-out grayscale opacity-90 group-hover:grayscale-0 group-hover:opacity-100" alt={article.title} />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 text-[9px] uppercase tracking-widest font-bold text-slate-900">
                    {article.category}
                  </div>
                </div>
                <div className="flex justify-between items-start mb-2">
                   <p className="text-[#C5A880] text-[10px] uppercase tracking-widest font-bold">{article.date}</p>
                </div>
                <h3 className="font-serif text-2xl text-slate-900 leading-snug group-hover:text-[#C5A880] transition-colors">{article.title}</h3>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const Testimonials = () => {
  const ref = useScrollReveal();
  const reviews = [
    { text: "I have no words to express how satisfied I am with everybody there. I walked in with my blonde hair a complete mess... I walked out with my dream hair color... My perfect eyebrows, and makeup done by the sweetest Laura. I recommend this spa 200%.", author: "L.C.", source: "Google Review" },
    { text: "I've recommended everyone I know to this salon. Every service I've had done here is amazing. From facials to blowouts they never miss the mark and I always leave happy with my results.", author: "J.M.", source: "Google Review" },
    { text: "I had a Hydrafacial with Vivian and it was so great!! I left glowing and relaxed, and could tell she really cared about my skin. Highly recommend her services.", author: "S.R.", source: "Google Review" }
  ];

  return (
    <section className="py-32 bg-slate-950 text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-[#C5A880]/5 blur-[150px] rounded-full pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div ref={ref} className="text-center reveal-item">
          <span className="text-[#C5A880] text-xs tracking-[0.4em] uppercase mb-4 block font-medium">Patient Stories</span>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl mb-20">Real Elite Results</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map((r, i) => (
              <div key={i} className="bg-white/5 p-10 border border-white/10 hover:border-[#C5A880]/50 hover:bg-white/10 transition-all duration-500 text-left flex flex-col justify-between group">
                <div>
                  <div className="flex text-[#C5A880] mb-6">
                    {[1,2,3,4,5].map(s => <Star key={s} size={14} fill="currentColor" className="mr-1" />)}
                  </div>
                  <p className="text-white/80 font-light italic mb-8 leading-relaxed text-sm lg:text-base">"{r.text}"</p>
                </div>
                <div className="border-t border-white/10 pt-6 group-hover:border-[#C5A880]/30 transition-colors">
                  <p className="font-serif text-lg tracking-wide">{r.author}</p>
                  <p className="text-[#C5A880] text-[10px] uppercase tracking-widest mt-1">{r.source}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const Location = () => {
  const ref = useScrollReveal();
  return (
    <section id="contact" className="py-32 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row shadow-2xl overflow-hidden rounded-sm bg-[#FAF9F6]">
          
          <div ref={ref} className="w-full lg:w-1/2 p-12 md:p-16 lg:p-24 flex flex-col justify-center reveal-item z-20">
            <span className="text-[#C5A880] text-xs tracking-[0.4em] uppercase mb-4 block font-medium">Visit Us</span>
            <h2 className="font-serif text-4xl lg:text-5xl text-slate-900 mb-12">Elite Styles Salon & Med Spa</h2>
            
            <div className="space-y-10">
              <div className="flex items-start group">
                <MapPin className="text-[#C5A880] mt-1 mr-6 flex-shrink-0 transition-transform" />
                <div>
                  <h4 className="uppercase tracking-widest text-[10px] font-bold text-slate-400 mb-2">Edgewater District</h4>
                  <p className="text-slate-900 font-light text-lg">222 NE 25th St, Unit 101<br/>Miami, FL, 33137</p>
                </div>
              </div>
              <div className="flex items-start group">
                <Phone className="text-[#C5A880] mt-1 mr-6 flex-shrink-0 transition-transform" />
                <div>
                  <h4 className="uppercase tracking-widest text-[10px] font-bold text-slate-400 mb-2">Direct Line</h4>
                  <p className="text-slate-900 font-light text-lg">305-571-7279</p>
                </div>
              </div>
            </div>

            <div className="mt-16 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 relative z-20">
              <a href="https://booking.mangomint.com/elitestyles" target="_blank" rel="noopener noreferrer" className="bg-slate-900 text-white text-center px-8 py-4 uppercase tracking-widest text-xs hover:bg-[#C5A880] transition-colors hover-trigger">
                Book Appointment
              </a>
              <a href="https://www.google.com/maps/place/222+NE+25th+St+Unit+101,+Miami,+FL+33137" target="_blank" rel="noopener noreferrer" className="border border-slate-900 text-slate-900 text-center px-8 py-4 uppercase tracking-widest text-xs hover:bg-slate-900 hover:text-white transition-colors hover-trigger">
                Get Directions
              </a>
            </div>
          </div>
          
          <div 
            className="w-full lg:w-1/2 min-h-[500px] lg:min-h-full relative overflow-hidden group hover-trigger cursor-pointer"
            onClick={() => window.open('https://www.google.com/maps/place/222+NE+25th+St+Unit+101,+Miami,+FL+33137', '_blank')}
          >
            <img 
              src="https://images.unsplash.com/photo-1533481405265-e9ce0c044abb?q=80&w=2940&auto=format&fit=crop" 
              alt="Miami Edgewater" 
              className="absolute inset-0 w-full h-full object-cover scale-125 group-hover:scale-110 transition-transform duration-[15s] ease-out opacity-90"
            />
            <div className="absolute inset-0 bg-slate-900/30 group-hover:bg-slate-900/10 transition-colors duration-1000"></div>
            
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="relative">
                    <div className="absolute -inset-6 border border-white/60 rounded-full animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
                    <div className="absolute -inset-3 border border-white/80 rounded-full animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite] delay-75"></div>
                    <MapPin className="text-white relative z-10 drop-shadow-2xl filter" size={42} />
                </div>
            </div>

            <div className="absolute bottom-8 left-8 right-8 bg-white/80 backdrop-blur-md p-6 shadow-2xl transform translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700 ease-out flex justify-between items-center border border-white/40 rounded-sm">
                <div>
                  <p className="font-serif text-slate-900 text-xl mb-1">Edgewater, Miami</p>
                  <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Florida, 33137</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-white transform group-hover:-rotate-45 transition-transform duration-500">
                  <ArrowRight size={16} />
                </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

const Footer = () => (
  <footer className="bg-slate-950 text-white/70 py-20 border-t border-white/5">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-8">
      
      <div className="col-span-1 md:col-span-4">
        <h1 className="font-serif text-2xl text-white mb-6">ELITE<span className="font-light italic">Styles</span></h1>
        <p className="font-light text-sm max-w-sm mb-8 leading-relaxed">
          The premier full-service med spa and beauty salon in Miami. Specialized in melasma treatments, advanced injectables, and luxury hair care.
        </p>
        <div className="flex space-x-6">
          <a href="https://www.instagram.com/elite.medspa" target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#C5A880] transition-colors hover-trigger"><Instagram size={20}/></a>
        </div>
      </div>

      <div className="col-span-1 md:col-span-2 md:col-start-6">
        <h4 className="text-white uppercase tracking-widest text-[10px] font-bold mb-6">Services</h4>
        <ul className="space-y-4 text-xs font-light tracking-wide">
          <li><a href="#treatments" className="hover:text-[#C5A880] transition-colors hover-trigger">Injectables</a></li>
          <li><a href="#treatments" className="hover:text-[#C5A880] transition-colors hover-trigger">Skin Rejuvenation</a></li>
          <li><a href="#treatments" className="hover:text-[#C5A880] transition-colors hover-trigger">Melasma Treatment</a></li>
          <li><a href="#treatments" className="hover:text-[#C5A880] transition-colors hover-trigger">Salon & Hair Care</a></li>
          <li><a href="#treatments" className="hover:text-[#C5A880] transition-colors hover-trigger">IV Therapy</a></li>
        </ul>
      </div>

      <div className="col-span-1 md:col-span-2">
        <h4 className="text-white uppercase tracking-widest text-[10px] font-bold mb-6">Company</h4>
        <ul className="space-y-4 text-xs font-light tracking-wide">
          <li><a href="#about" className="hover:text-[#C5A880] transition-colors hover-trigger">About Us</a></li>
          <li><a href="#membership" className="hover:text-[#C5A880] transition-colors hover-trigger">Membership</a></li>
          <li><a href="#team" className="hover:text-[#C5A880] transition-colors hover-trigger">Our Team</a></li>
          <li><a href="#journal" className="hover:text-[#C5A880] transition-colors hover-trigger">The Journal</a></li>
        </ul>
      </div>

      <div className="col-span-1 md:col-span-3">
        <h4 className="text-white uppercase tracking-widest text-[10px] font-bold mb-6">Contact</h4>
        <ul className="space-y-4 text-xs font-light tracking-wide">
          <li>222 NE 25th St, Unit 101</li>
          <li>Miami, FL 33137</li>
          <li className="pt-2"><a href="tel:305-571-7279" className="hover:text-[#C5A880] transition-colors text-white text-sm hover-trigger">305-571-7279</a></li>
          <li><a href="mailto:info@elite-medspa.com" className="hover:text-[#C5A880] transition-colors hover-trigger">info@elite-medspa.com</a></li>
        </ul>
      </div>

    </div>

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 pt-8 border-t border-white/10 text-[10px] uppercase tracking-widest font-light flex flex-col md:flex-row justify-between items-center opacity-60">
      <p>&copy; {new Date().getFullYear()} Elite Styles Salon and Med Spa. All rights reserved.</p>
      <div className="space-x-6 mt-6 md:mt-0">
        <a href="#" className="hover:text-white transition-colors hover-trigger">Privacy Policy</a>
        <a href="#" className="hover:text-white transition-colors hover-trigger">Terms & Disclaimer</a>
      </div>
    </div>
  </footer>
);

export default function App() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#FAF9F6] font-sans selection:bg-[#C5A880] selection:text-white">
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400&display=swap');
        .font-sans { font-family: 'Inter', sans-serif; }
        .font-serif { font-family: 'Playfair Display', serif; }

        /* Disable default cursor for custom cursor */
        @media (min-width: 768px) {
          body, a, button, .hover-trigger { cursor: none !important; }
        }
        
        /* Custom Cursor Follower Hover State */
        .cursor-hover {
          width: 80px !important;
          height: 80px !important;
          transform: translate3d(-34px, -34px, 0) !important;
          background-color: rgba(197, 168, 128, 0.1);
          border-color: transparent !important;
        }
        
        /* Text Stroke Transition from HTML */
        .text-stroke {
          -webkit-text-stroke: 1px rgba(255, 255, 255, 0.4);
          color: transparent;
        }

        /* Nav Link Hover from HTML */
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          width: 0%;
          height: 1px;
          background: #C5A880;
          transition: width 0.3s ease;
        }
        .nav-link:hover::after { width: 100%; }

        /* Keyframes */
        @keyframes revealText {
          from { transform: translateY(110%); rotate: 2deg; opacity: 0; }
          to { transform: translateY(0); rotate: 0deg; opacity: 1; }
        }
        @keyframes fadeBlur {
          from { opacity: 0; filter: blur(10px); transform: translateY(15px); }
          to { opacity: 1; filter: blur(0); transform: translateY(0); }
        }
        @keyframes imageScale {
          from { transform: scale(1.15); }
          to { transform: scale(1); }
        }
        @keyframes scrollLine {
          0% { transform: scaleY(0); transform-origin: top; }
          50% { transform: scaleY(1); transform-origin: top; }
          50.1% { transform: scaleY(1); transform-origin: bottom; }
          100% { transform: scaleY(0); transform-origin: bottom; }
        }

        /* Image Mask Reveal from HTML */
        .hero-img-container {
           clip-path: inset(100% 0 0 0);
        }
        .is-visible .hero-img-container {
           animation: maskReveal 1.5s cubic-bezier(0.7,0,0.3,1) forwards;
        }
        @keyframes maskReveal {
           from { clip-path: inset(100% 0 0 0); }
           to { clip-path: inset(0 0 0 0); }
        }

        /* Scroll Reveal Utility */
        .reveal-item {
          opacity: 0;
          transform: translateY(50px);
          transition: all 1s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .reveal-item.is-visible {
          opacity: 1;
          transform: translateY(0);
        }
        
        html { scroll-behavior: smooth; }
      `}} />
      
      <CustomCursor />
      <ProgressBar />
      <TopBar />
      <Navbar scrolled={scrolled} />
      
      <main>
        <Hero />
        
        <div className="bg-[#C5A880] text-white py-5 overflow-hidden flex whitespace-nowrap border-y border-white/20 shadow-inner">
          <div className="animate-[slide_35s_linear_infinite] inline-block font-sans uppercase tracking-[0.25em] text-[11px] font-medium">
             BOTOX & NEUROMODULATORS • DERMAL FILLERS • MELASMA SPECIALISTS • SKINPEN MICRONEEDLING • LUXURY SALON SERVICES • IV THERAPY • CHEMICAL PEELS • EYELASH ENHANCEMENT • 
             BOTOX & NEUROMODULATORS • DERMAL FILLERS • MELASMA SPECIALISTS • SKINPEN MICRONEEDLING • LUXURY SALON SERVICES • IV THERAPY • CHEMICAL PEELS • EYELASH ENHANCEMENT •
          </div>
          <style dangerouslySetInnerHTML={{__html:`
            @keyframes slide {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
          `}}/>
        </div>

        <AboutSection />
        <ClinicalExpertise />
        <HorizontalGallery />
        <TeamSection />
        <MembershipSection />
        <JournalSection />
        <Testimonials />
        <Location />
      </main>

      <Footer />
    </div>
  );
}