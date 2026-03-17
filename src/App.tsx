import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Wine, 
  Search, 
  ShoppingBag, 
  Menu, 
  X, 
  ArrowRight, 
  Sparkles, 
  ChevronRight,
  Instagram,
  Twitter,
  Facebook,
  Send,
  User as UserIcon,
  Plus,
  Minus,
  Trash2,
  Globe,
  LogOut,
  Container,
  GlassWater,
  Wheat,
  Mountain,
  Wind,
  Droplets,
  LayoutGrid
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { translations } from './translations';

// --- Types ---
interface Product {
  id: number;
  name: string;
  nameCn: string;
  category: string;
  categoryCn: string;
  price: number;
  image: string;
  description: string;
  descriptionCn: string;
  vintage: string;
  vintageCn: string;
}

interface CartItem extends Product {
  quantity: number;
}

interface User {
  name: string;
  email: string;
}

// --- Constants ---
const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Yue (Moon) Resonance",
    nameCn: "月鸣 · 共鸣",
    category: "Earthenware Aged",
    categoryCn: "陶坛陈酿",
    price: 145,
    image: "https://images.unsplash.com/photo-1569058242253-92a9c71f9867?q=80&w=800&auto=format&fit=crop",
    description: "A coastal whisper of peat and sea salt, aged where the highlands meet the waves.",
    descriptionCn: "海风轻拂的泥煤与海盐气息，在高山与海浪交汇处陈酿。",
    vintage: "Vintage 2012",
    vintageCn: "2012年份"
  },
  {
    id: 2,
    name: "Mo (Ink) Deepened",
    nameCn: "墨染 · 深邃",
    category: "Single Batch",
    categoryCn: "单批次",
    price: 185,
    image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=800&auto=format&fit=crop",
    description: "Deep, dark, and mysterious with notes of dark chocolate and charred oak.",
    descriptionCn: "深邃而神秘，带有黑巧克力和焦木的香气。",
    vintage: "Limited Reserve",
    vintageCn: "限量珍藏"
  },
  {
    id: 3,
    name: "Tian (Sky) Clarity",
    nameCn: "天净 · 澄澈",
    category: "Vatted Grain",
    categoryCn: "谷物调配",
    price: 120,
    image: "https://images.unsplash.com/photo-1527281405623-3218953bc5b5?q=80&w=800&auto=format&fit=crop",
    description: "A symphony of clarity and brightness, with floral undertones and a crisp finish.",
    descriptionCn: "澄澈与明亮的交响乐，带有花香底蕴和清爽的回味。",
    vintage: "Legacy Blend",
    vintageCn: "传承调配"
  },
  {
    id: 4,
    name: "Shan (Mountain) Echo",
    nameCn: "山响 · 回音",
    category: "Highland Malt",
    categoryCn: "高地麦芽",
    price: 165,
    image: "https://images.unsplash.com/photo-1527281405623-3218953bc5b5?q=80&w=800&auto=format&fit=crop",
    description: "Robust and earthy, capturing the essence of the ancient peaks.",
    descriptionCn: "醇厚而带有大地气息，捕捉古老山峰的精髓。",
    vintage: "Vintage 2015",
    vintageCn: "2015年份"
  },
  {
    id: 5,
    name: "Feng (Wind) Whisper",
    nameCn: "风语 · 呢喃",
    category: "Light Grain",
    categoryCn: "轻盈谷物",
    price: 95,
    image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=800&auto=format&fit=crop",
    description: "Light and airy with a hint of citrus and spring blossoms.",
    descriptionCn: "轻盈通透，带有一丝柑橘和春花的芬芳。",
    vintage: "Spring Release",
    vintageCn: "春季发布"
  },
  {
    id: 6,
    name: "Gu (Ancient) Spirit",
    nameCn: "古魂 · 灵韵",
    category: "Triple Distilled",
    categoryCn: "三次蒸馏",
    price: 210,
    image: "https://images.unsplash.com/photo-1569058242253-92a9c71f9867?q=80&w=800&auto=format&fit=crop",
    description: "Exceptionally smooth and complex, a tribute to century-old techniques.",
    descriptionCn: "异常顺滑且复杂，向百年技艺致敬。",
    vintage: "Master's Choice",
    vintageCn: "大师之选"
  },
  {
    id: 7,
    name: "Yun (Cloud) Drift",
    nameCn: "云漂 · 随风",
    category: "Light Grain",
    categoryCn: "轻盈谷物",
    price: 88,
    image: "https://images.unsplash.com/photo-1527281405623-3218953bc5b5?q=80&w=800&auto=format&fit=crop",
    description: "A gentle breeze of vanilla and toasted almond.",
    descriptionCn: "香草和烤杏仁的柔和微风。",
    vintage: "2023 Edition",
    vintageCn: "2023版"
  },
  {
    id: 8,
    name: "Yan (Mist) Veil",
    nameCn: "烟笼 · 迷雾",
    category: "Single Batch",
    categoryCn: "单批次",
    price: 195,
    image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=800&auto=format&fit=crop",
    description: "Smoky and intense, with a lingering finish of dried fruits.",
    descriptionCn: "烟熏而强烈，带有干果的持久回味。",
    vintage: "Winter Reserve",
    vintageCn: "冬季珍藏"
  },
  {
    id: 9,
    name: "He (River) Flow",
    nameCn: "河川 · 奔流",
    category: "Vatted Grain",
    categoryCn: "谷物调配",
    price: 115,
    image: "https://images.unsplash.com/photo-1569058242253-92a9c71f9867?q=80&w=800&auto=format&fit=crop",
    description: "Smooth and rhythmic, like a calm river at dawn.",
    descriptionCn: "顺滑而有节奏，宛如黎明时分宁静的河流。",
    vintage: "Legacy Series",
    vintageCn: "传承系列"
  },
  {
    id: 10,
    name: "Lin (Forest) Breath",
    nameCn: "林息 · 呼吸",
    category: "Highland Malt",
    categoryCn: "高地麦芽",
    price: 155,
    image: "https://images.unsplash.com/photo-1527281405623-3218953bc5b5?q=80&w=800&auto=format&fit=crop",
    description: "Pine and cedar notes with a touch of wild honey.",
    descriptionCn: "松木和雪松的香气，带有一丝野蜂蜜的味道。",
    vintage: "Forest Cask",
    vintageCn: "森林桶"
  }
];

// --- Components ---

const IntroPage = ({ lang, onEnter }: { lang: 'en' | 'cn', onEnter: () => void }) => {
  const t = translations[lang].hero;
  const it = translations[lang].intro;
  
  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-[200] bg-slate-950 flex flex-col items-center justify-center text-center px-6"
    >
      <motion.div 
        initial={{ scale: 1.2, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.25 }}
        transition={{ duration: 4, ease: "easeOut" }}
        className="absolute inset-0 z-0"
      >
        <img 
          src="https://images.unsplash.com/photo-1569058242253-92a9c71f9867?q=80&w=2070&auto=format&fit=crop" 
          alt="Intro Background" 
          className="w-full h-full object-cover grayscale"
        />
      </motion.div>

      <div className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mb-12"
        >
          <div className="w-16 h-16 border border-primary/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <Wine className="w-8 h-8 text-primary" />
          </div>
          <span className="text-primary font-bold tracking-[0.6em] uppercase text-[10px]">{t.est}</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <h1 className="text-7xl md:text-9xl text-white font-light tracking-tighter leading-none mb-12">
            {lang === 'en' ? 'BANLAN' : '万物之'} <br />
            <span className="italic font-serif text-primary/60">{lang === 'en' ? 'Resonance' : '共鸣'}</span>
          </h1>
        </motion.div>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 1 }}
          className="text-white/40 text-sm tracking-[0.4em] uppercase mb-20 max-w-md mx-auto font-light"
        >
          {t.subtitle}
        </motion.p>

        <motion.button 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.2, duration: 0.8 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onEnter}
          className="group relative px-16 py-5 bg-transparent border border-white/20 text-white font-bold uppercase tracking-[0.4em] text-[10px] rounded-full overflow-hidden transition-all hover:border-primary hover:text-primary"
        >
          <span className="relative z-10">{it.enter}</span>
          <motion.div 
            className="absolute inset-0 bg-white opacity-0 group-hover:opacity-5 transition-opacity"
          />
        </motion.button>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3 }}
        className="absolute bottom-12 text-white/10 text-[9px] uppercase tracking-[0.6em]"
      >
        BANLAN SPIRITS · THE ART OF RESONANCE
      </motion.div>
    </motion.div>
  );
};

const Navbar = ({ 
  lang, 
  setLang, 
  cartCount, 
  onOpenCart, 
  onOpenSearch, 
  onOpenLogin, 
  user,
  onLogout,
  currentPage,
  onNavigate
}: { 
  lang: 'en' | 'cn', 
  setLang: (l: 'en' | 'cn') => void,
  cartCount: number,
  onOpenCart: () => void,
  onOpenSearch: () => void,
  onOpenLogin: () => void,
  user: User | null,
  onLogout: () => void,
  currentPage: string,
  onNavigate: (page: string) => void
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const t = translations[lang];

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { key: 'home', label: lang === 'en' ? 'Home' : '首页' },
    { key: 'allProducts', label: t.nav.allProducts },
    { key: 'philosophy', label: t.nav.philosophy },
    { key: 'living', label: t.nav.living },
    { key: 'joinUs', label: t.nav.joinUs },
    { key: 'contactUs', label: t.nav.contactUs },
  ];

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-700 ${isScrolled || currentPage !== 'home' ? 'bg-white/80 backdrop-blur-xl py-4 shadow-sm' : 'bg-transparent py-8'}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <button 
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2 group"
        >
          <Wine className={`w-7 h-7 transition-colors duration-500 ${isScrolled || currentPage !== 'home' ? 'text-primary' : 'text-white group-hover:text-primary'}`} />
          <span className={`text-xl font-bold tracking-tighter transition-colors duration-500 ${isScrolled || currentPage !== 'home' ? 'text-slate-900' : 'text-white group-hover:text-primary'}`}>BANLAN</span>
        </button>

        <div className="hidden md:flex items-center gap-12">
          {navItems.map((item) => (
            <button 
              key={item.key} 
              onClick={() => onNavigate(item.key)}
              className={`text-[10px] uppercase tracking-[0.3em] font-bold transition-all duration-500 relative py-2 group ${
                isScrolled || currentPage !== 'home' 
                  ? (currentPage === item.key ? 'text-primary' : 'text-slate-500 hover:text-primary') 
                  : (currentPage === item.key ? 'text-primary' : 'text-white/60 hover:text-white')
              }`}
            >
              {item.label}
              <motion.div 
                className="absolute bottom-0 left-0 w-full h-px bg-primary origin-left"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: currentPage === item.key ? 1 : 0 }}
                transition={{ duration: 0.5 }}
              />
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => setLang(lang === 'en' ? 'cn' : 'en')}
            className={`p-2 rounded-full transition-all duration-500 flex items-center gap-1 ${isScrolled || currentPage !== 'home' ? 'text-slate-900 hover:bg-slate-100' : 'text-white hover:bg-white/10'}`}
          >
            <Globe className="w-4 h-4" />
            <span className="text-[9px] font-bold uppercase">{lang}</span>
          </button>
          
          <button 
            onClick={onOpenSearch}
            className={`p-2 rounded-full transition-all duration-500 ${isScrolled || currentPage !== 'home' ? 'text-slate-900 hover:bg-slate-100' : 'text-white hover:bg-white/10'}`}
          >
            <Search className="w-4 h-4" />
          </button>
          
          <button 
            onClick={onOpenCart}
            className={`relative p-2 rounded-full transition-all duration-500 ${isScrolled || currentPage !== 'home' ? 'text-slate-900 hover:bg-slate-100' : 'text-white hover:bg-white/10'}`}
          >
            <ShoppingBag className="w-4 h-4" />
            {cartCount > 0 && (
              <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-primary text-white text-[8px] flex items-center justify-center rounded-full font-bold">
                {cartCount}
              </span>
            )}
          </button>

          {user ? (
            <div className="relative group">
              <button className={`p-2 rounded-full transition-all duration-500 ${isScrolled || currentPage !== 'home' ? 'text-slate-900 hover:bg-slate-100' : 'text-white hover:bg-white/10'}`}>
                <UserIcon className="w-4 h-4" />
              </button>
              <div className="absolute right-0 top-full mt-4 w-56 bg-white shadow-2xl rounded-2xl py-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                <div className="px-5 py-3 border-b border-slate-50">
                  <p className="text-[9px] text-slate-400 uppercase tracking-widest mb-1">{t.user.welcome}</p>
                  <p className="text-sm font-bold text-slate-900">{user.name}</p>
                </div>
                <div className="py-2">
                  <button className="w-full text-left px-5 py-2.5 text-xs text-slate-600 hover:bg-slate-50 flex items-center gap-3 transition-colors">
                    <UserIcon className="w-4 h-4 opacity-50" /> {t.user.profile}
                  </button>
                  <button 
                    onClick={onLogout}
                    className="w-full text-left px-5 py-2.5 text-xs text-red-500 hover:bg-red-50 flex items-center gap-3 transition-colors"
                  >
                    <LogOut className="w-4 h-4 opacity-50" /> {t.user.logout}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <button 
              onClick={onOpenLogin}
              className={`p-2 rounded-full transition-all duration-500 ${isScrolled || currentPage !== 'home' ? 'text-slate-900 hover:bg-slate-100' : 'text-white hover:bg-white/10'}`}
            >
              <UserIcon className="w-4 h-4" />
            </button>
          )}

          <button 
            className={`md:hidden p-2 transition-colors duration-500 ${isScrolled || currentPage !== 'home' ? 'text-slate-900' : 'text-white'}`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute top-full left-0 w-full bg-white shadow-xl overflow-hidden md:hidden"
          >
            <div className="py-8 px-6 flex flex-col gap-6">
              {navItems.map((item) => (
                <button 
                  key={item.key} 
                  onClick={() => {
                    onNavigate(item.key);
                    setIsMenuOpen(false);
                  }}
                  className={`text-sm font-bold uppercase tracking-widest text-left transition-colors ${currentPage === item.key ? 'text-primary' : 'text-slate-900'}`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const CraftsmanshipPage = ({ lang }: { lang: 'en' | 'cn' }) => {
  const t = translations[lang].craftsmanship;
  
  const elements = [
    { id: 'water', icon: Droplets, ...t.elements.water },
    { id: 'grain', icon: Wheat, ...t.elements.grain },
    { id: 'yeast', icon: Sparkles, ...t.elements.yeast },
    { id: 'earth', icon: Container, ...t.elements.earth },
    { id: 'time', icon: Wind, ...t.elements.time },
  ];

  return (
    <div className="bg-white">
      {/* Editorial Hero */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden bg-slate-950">
        <motion.div 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.4 }}
          transition={{ duration: 2 }}
          className="absolute inset-0"
        >
          <img 
            src="https://images.unsplash.com/photo-1569058242253-92a9c71f9867?q=80&w=2000&auto=format&fit=crop" 
            alt="Craftsmanship Hero" 
            className="w-full h-full object-cover grayscale"
          />
        </motion.div>
        
        <div className="relative z-10 text-center px-6 max-w-5xl">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-primary font-bold tracking-[0.5em] uppercase text-xs mb-8 block"
          >
            {t.tag}
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-6xl md:text-9xl text-white font-light tracking-tighter leading-none mb-12"
          >
            {t.title}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-xl md:text-2xl text-white/60 font-light leading-relaxed max-w-3xl mx-auto"
          >
            {t.intro}
          </motion.p>
        </div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 text-white/20 text-[10px] uppercase tracking-[0.4em] flex flex-col items-center gap-4"
        >
          <span>Scroll to Explore</span>
          <div className="w-px h-12 bg-white/20"></div>
        </motion.div>
      </section>

      {/* The Five Elements - Grid Layout */}
      <section className="py-32 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-12">
            {elements.map((el, idx) => (
              <motion.div 
                key={el.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="text-center group"
              >
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm group-hover:shadow-xl group-hover:bg-primary group-hover:text-white transition-all duration-500">
                  <el.icon className="w-8 h-8 stroke-[1px]" />
                </div>
                <h3 className="text-lg font-medium mb-4">{el.title}</h3>
                <p className="text-sm text-slate-500 font-light leading-relaxed">{el.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* The Process - Vertical Storytelling */}
      <section className="py-32 px-6 bg-white overflow-hidden">
        <div className="max-w-4xl mx-auto relative">
          <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-slate-100 -translate-x-1/2 hidden md:block"></div>
          
          <div className="space-y-32">
            {t.steps.map((step, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: idx % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                className={`relative flex flex-col ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-12 md:gap-24`}
              >
                <div className="w-full md:w-1/2">
                  <div className="aspect-[4/3] bg-slate-100 rounded-3xl overflow-hidden shadow-2xl">
                    <img 
                      src={`https://images.unsplash.com/photo-${[
                        '1569058242253-92a9c71f9867',
                        '1514362545857-3bc16c4c7d1b',
                        '1527281405623-3218953bc5b5',
                        '1569058242253-92a9c71f9867',
                        '1514362545857-3bc16c4c7d1b'
                      ][idx]}?q=80&w=1000&auto=format&fit=crop`} 
                      alt={step.title}
                      className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
                    />
                  </div>
                </div>
                
                <div className="w-full md:w-1/2 text-center md:text-left">
                  <span className="text-primary font-bold text-4xl font-serif italic mb-4 block opacity-20">0{idx + 1}</span>
                  <h3 className="text-3xl md:text-4xl font-light mb-6 tracking-tight">{step.title}</h3>
                  <p className="text-lg text-slate-500 font-light leading-relaxed">{step.desc}</p>
                </div>

                <div className="absolute left-0 md:left-1/2 top-0 w-4 h-4 bg-primary rounded-full -translate-x-1/2 hidden md:block">
                  <div className="absolute inset-0 bg-primary rounded-full animate-ping opacity-20"></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-32 px-6 bg-slate-950 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto"
        >
          <h2 className="text-4xl md:text-5xl text-white font-light mb-12 leading-tight">
            {lang === 'en' ? "Experience the Resonance in Every Drop" : "在每一滴酒中感受共鸣"}
          </h2>
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="px-12 py-5 bg-primary text-white font-bold uppercase tracking-[0.3em] text-[10px] rounded-full hover:bg-white hover:text-primary transition-all shadow-2xl"
          >
            {lang === 'en' ? "Back to Top" : "回到顶部"}
          </button>
        </motion.div>
      </section>
    </div>
  );
};

const AllProductsPage = ({ lang, onAddToCart, onProductClick }: { lang: 'en' | 'cn', onAddToCart: (p: Product) => void, onProductClick: (p: Product) => void }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'name'>('name');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  
  const t = translations[lang];

  const categories = [
    { id: 'earthenware', label: t.categories.earthenware, icon: Container, filter: 'Earthenware Aged' },
    { id: 'singleBatch', label: t.categories.singleBatch, icon: GlassWater, filter: 'Single Batch' },
    { id: 'vattedGrain', label: t.categories.vattedGrain, icon: Wheat, filter: 'Vatted Grain' },
    { id: 'highlandMalt', label: t.categories.highlandMalt, icon: Mountain, filter: 'Highland Malt' },
    { id: 'lightGrain', label: t.categories.lightGrain, icon: Wind, filter: 'Light Grain' },
    { id: 'tripleDistilled', label: t.categories.tripleDistilled, icon: Droplets, filter: 'Triple Distilled' },
  ];

  const filteredProducts = useMemo(() => {
    let result = PRODUCTS.filter(p => {
      const matchesCategory = !selectedCategory || p.category === selectedCategory;
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           p.nameCn.includes(searchQuery) ||
                           p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           p.categoryCn.includes(searchQuery);
      return matchesCategory && matchesSearch;
    });

    if (sortBy === 'price-asc') result.sort((a, b) => a.price - b.price);
    if (sortBy === 'price-desc') result.sort((a, b) => b.price - a.price);
    if (sortBy === 'name') result.sort((a, b) => a.name.localeCompare(b.name));

    return result;
  }, [selectedCategory, searchQuery, sortBy]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery, sortBy]);

  return (
    <div className="pt-40 pb-32 px-6 min-h-screen bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header & Search */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-24 gap-12">
          <div className="text-center md:text-left">
            <h1 className="text-5xl md:text-7xl font-light tracking-tight mb-4">{t.nav.allProducts}</h1>
            <p className="text-slate-400 text-sm font-light uppercase tracking-[0.3em]">{filteredProducts.length} {t.search.results}</p>
          </div>
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 w-4 h-4" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.search.placeholder}
                className="w-full bg-slate-50 border border-slate-100 rounded-full pl-12 pr-6 py-4 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-slate-300"
              />
            </div>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-50 border border-slate-100 rounded-full px-6 py-4 text-xs font-bold uppercase tracking-widest outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
            >
              <option value="name">Sort: A-Z</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Categories - Matching User's Image Style (Minimalist Row) */}
        <div className="mb-24 overflow-x-auto no-scrollbar">
          <div className="flex justify-between md:justify-center gap-12 md:gap-24 min-w-max px-4">
            <button 
              onClick={() => setSelectedCategory(null)}
              className="flex flex-col items-center gap-6 group transition-all"
            >
              <div className={`transition-all duration-500 ${!selectedCategory ? 'text-primary scale-110' : 'text-slate-300 group-hover:text-slate-900'}`}>
                <LayoutGrid className="w-10 h-10 stroke-[1px]" />
              </div>
              <div className="flex flex-col items-center gap-2">
                <span className={`text-[10px] font-bold uppercase tracking-[0.2em] transition-colors ${!selectedCategory ? 'text-primary' : 'text-slate-400'}`}>
                  {t.categories.all}
                </span>
                <motion.div 
                  className="h-0.5 bg-primary rounded-full"
                  initial={false}
                  animate={{ width: !selectedCategory ? '100%' : '0%' }}
                />
              </div>
            </button>
            
            {categories.map((cat) => (
              <button 
                key={cat.id}
                onClick={() => setSelectedCategory(cat.filter)}
                className="flex flex-col items-center gap-6 group transition-all"
              >
                <div className={`transition-all duration-500 ${selectedCategory === cat.filter ? 'text-primary scale-110' : 'text-slate-300 group-hover:text-slate-900'}`}>
                  <cat.icon className="w-10 h-10 stroke-[1px]" />
                </div>
                <div className="flex flex-col items-center gap-2">
                  <span className={`text-[10px] font-bold uppercase tracking-[0.2em] transition-colors ${selectedCategory === cat.filter ? 'text-primary' : 'text-slate-400'}`}>
                    {cat.label}
                  </span>
                  <motion.div 
                    className="h-0.5 bg-primary rounded-full"
                    initial={false}
                    animate={{ width: selectedCategory === cat.filter ? '100%' : '0%' }}
                  />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-20">
          <AnimatePresence mode="popLayout">
            {paginatedProducts.map((product) => (
              <motion.div 
                key={product.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="group cursor-pointer"
                onClick={() => onProductClick(product)}
              >
                <div className="relative aspect-[3/4] bg-slate-50 rounded-3xl mb-8 overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 group-hover:rotate-1"
                  />
                  <div className="absolute top-8 left-8">
                    <span className="bg-white/90 backdrop-blur-md px-4 py-1.5 text-[9px] uppercase tracking-[0.2em] font-bold text-slate-900 rounded-full shadow-sm">
                      {lang === 'en' ? product.vintage : product.vintageCn}
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                    <button 
                      onClick={() => onAddToCart(product)}
                      className="px-8 py-4 bg-white text-slate-900 text-[10px] font-bold uppercase tracking-widest rounded-full transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 hover:bg-primary hover:text-white"
                    >
                      {translations[lang].collection.addToCart}
                    </button>
                  </div>
                </div>
                <div className="px-2">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-2xl font-light tracking-tight group-hover:text-primary transition-colors duration-300">
                        {lang === 'en' ? product.name : product.nameCn}
                      </h3>
                      <p className="text-slate-400 text-[10px] tracking-[0.2em] uppercase mt-1">
                        {lang === 'en' ? product.category : product.categoryCn}
                      </p>
                    </div>
                    <span className="text-lg font-medium text-slate-900">${product.price}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-24 flex items-center justify-center gap-4">
            <button 
              disabled={currentPage === 1}
              onClick={() => {
                setCurrentPage(prev => Math.max(1, prev - 1));
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="p-4 border border-slate-100 rounded-full disabled:opacity-30 hover:bg-slate-50 transition-all"
            >
              <Minus className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setCurrentPage(i + 1);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`w-10 h-10 rounded-full text-[10px] font-bold transition-all ${currentPage === i + 1 ? 'bg-primary text-white' : 'hover:bg-slate-50 text-slate-400'}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button 
              disabled={currentPage === totalPages}
              onClick={() => {
                setCurrentPage(prev => Math.min(totalPages, prev + 1));
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="p-4 border border-slate-100 rounded-full disabled:opacity-30 hover:bg-slate-50 transition-all"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        )}

        {filteredProducts.length === 0 && (
          <div className="py-48 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Search className="w-12 h-12 mx-auto mb-8 text-slate-100" />
              <p className="text-2xl font-light italic text-slate-300">{t.search.noResults}</p>
              <button 
                onClick={() => {setSelectedCategory(null); setSearchQuery("");}}
                className="mt-8 text-xs font-bold uppercase tracking-widest text-primary border-b border-primary/30 pb-1"
              >
                Clear all filters
              </button>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

const JoinUsPage = ({ lang }: { lang: 'en' | 'cn' }) => {
  const t = translations[lang].careers;
  const jobs = [
    { title: lang === 'en' ? 'Brand Ambassador' : '品牌大使', type: lang === 'en' ? 'Full-time' : '全职', location: lang === 'en' ? 'Shanghai' : '上海' },
    { title: lang === 'en' ? 'Master Distiller' : '酿酒大师', type: lang === 'en' ? 'Full-time' : '全职', location: lang === 'en' ? 'Highland Distillery' : '高山蒸馏厂' },
    { title: lang === 'en' ? 'Digital Curator' : '数字策展人', type: lang === 'en' ? 'Contract' : '合同制', location: lang === 'en' ? 'Remote' : '远程' },
  ];

  return (
    <div className="pt-40 pb-32 px-6 min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-24"
        >
          <span className="text-primary font-bold tracking-[0.4em] uppercase text-xs mb-6 block">{t.tag}</span>
          <h1 className="text-5xl md:text-7xl font-light tracking-tight mb-8">{t.title}</h1>
          <p className="text-slate-500 text-lg font-light leading-relaxed max-w-2xl mx-auto">
            {t.desc}
          </p>
        </motion.div>

        <div className="space-y-6">
          <h2 className="text-xs uppercase tracking-[0.3em] font-bold text-slate-400 mb-8">{t.openings}</h2>
          {jobs.map((job, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-8 rounded-3xl border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-8 group hover:shadow-xl hover:shadow-slate-200/50 transition-all"
            >
              <div>
                <h3 className="text-2xl font-light mb-2 group-hover:text-primary transition-colors">{job.title}</h3>
                <div className="flex gap-4 text-[10px] uppercase tracking-widest font-bold text-slate-400">
                  <span>{job.type}</span>
                  <span>•</span>
                  <span>{job.location}</span>
                </div>
              </div>
              <button className="px-8 py-4 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest rounded-full hover:bg-primary transition-all">
                {t.apply}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

const ContactUsPage = ({ lang }: { lang: 'en' | 'cn' }) => {
  const t = translations[lang].contact;
  return (
    <div className="pt-40 pb-32 px-6 min-h-screen bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-24 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <span className="text-primary font-bold tracking-[0.4em] uppercase text-xs mb-6 block">{t.tag}</span>
            <h1 className="text-5xl md:text-7xl font-light tracking-tight mb-8">{t.title}</h1>
            <p className="text-slate-500 text-lg font-light leading-relaxed mb-12">
              {t.desc}
            </p>

            <div className="space-y-12">
              <div className="flex gap-6">
                <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center flex-shrink-0">
                  <Mountain className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-widest font-bold text-slate-400 mb-2">{t.location}</h4>
                  <p className="text-lg font-light">{t.address}</p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center flex-shrink-0">
                  <Send className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-widest font-bold text-slate-400 mb-2">Email</h4>
                  <p className="text-lg font-light">{t.email}</p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center flex-shrink-0">
                  <Wine className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-widest font-bold text-slate-400 mb-2">Phone</h4>
                  <p className="text-lg font-light">{t.phone}</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="aspect-square bg-slate-100 rounded-[3rem] overflow-hidden shadow-2xl relative"
          >
            <img 
              src="https://images.unsplash.com/photo-1569058242253-92a9c71f9867?q=80&w=1000&auto=format&fit=crop" 
              alt="Distillery Location" 
              className="w-full h-full object-cover grayscale"
            />
            <div className="absolute inset-0 bg-primary/10 mix-blend-overlay"></div>
            <div className="absolute bottom-12 left-12 right-12 bg-white/80 backdrop-blur-xl p-8 rounded-3xl border border-white/20">
              <div className="flex justify-between items-center">
                <div>
                  <h5 className="font-bold text-slate-900 uppercase tracking-widest text-[10px] mb-1">Flagship Distillery</h5>
                  <p className="text-xs text-slate-500">Open for tours by appointment</p>
                </div>
                <ArrowRight className="w-5 h-5 text-primary" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1569058242253-92a9c71f9867?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1527281405623-3218953bc5b5?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1594494024039-6616305d336a?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1592318963771-1710193bb992?q=80&w=2070&auto=format&fit=crop"
];

const Hero = ({ lang, onNavigate }: { lang: 'en' | 'cn', onNavigate: (page: string) => void }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const t = translations[lang].hero;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-slate-900">
      <AnimatePresence mode="wait">
        <motion.div 
          key={currentImageIndex}
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.6 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2 }}
          className="absolute inset-0 z-0"
        >
          <img 
            src={HERO_IMAGES[currentImageIndex]} 
            alt="Hero Background" 
            className="w-full h-full object-cover grayscale brightness-50"
          />
        </motion.div>
      </AnimatePresence>
      
      <div className="relative z-10 text-center px-6 max-w-4xl">
        <motion.span 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="inline-block mb-6 text-xs font-bold uppercase tracking-[0.4em] text-primary"
        >
          {t.est}
        </motion.span>
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="text-6xl md:text-8xl text-white font-light leading-tight mb-8"
        >
          {t.title} <br />
          <span className="italic font-serif text-primary/80">{t.resonance}</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-lg md:text-xl text-white/70 font-light tracking-widest uppercase mb-12"
        >
          {t.subtitle}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
        >
          <button 
            onClick={() => onNavigate('craftsmanship')}
            className="group relative px-10 py-4 bg-primary text-white text-sm font-bold tracking-[0.2em] uppercase rounded-lg overflow-hidden transition-all hover:pr-14"
          >
            <span className="relative z-10">{t.cta}</span>
            <ArrowRight className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all w-5 h-5" />
          </button>
        </motion.div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="text-[10px] uppercase tracking-[0.4em] text-white/40">{t.scroll}</span>
        <div className="w-px h-16 bg-gradient-to-b from-primary to-transparent"></div>
      </div>
    </section>
  );
};

const SpiritGuide = ({ lang }: { lang: 'en' | 'cn' }) => {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const t = translations[lang].aiGuide;

  const getRecommendation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
      const model = ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `You are a sophisticated sommelier for BANLAN, a premium spirit brand. 
        Based on this user mood or occasion: "${prompt}", recommend one of our spirits: 
        1. Yue (Moon) Resonance (Coastal, peat, sea salt, aged).
        2. Mo (Ink) Deepened (Dark chocolate, charred oak, mysterious).
        3. Tian (Sky) Clarity (Floral, crisp, bright).
        
        Provide a poetic, short recommendation in ${lang === 'en' ? 'English' : 'Chinese'} (max 60 words).`,
      });

      const result = await model;
      setResponse(result.text || (lang === 'en' ? "I recommend the Yue Resonance." : "我推荐月鸣系列。"));
    } catch (error) {
      console.error("AI Error:", error);
      setResponse(lang === 'en' ? "Our master distiller suggests the Yue Resonance." : "我们的酿酒大师推荐月鸣系列。");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-24 px-6 bg-slate-900 text-white overflow-hidden">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-12">
          <div className="p-3 bg-primary/20 rounded-full">
            <Sparkles className="text-primary w-6 h-6" />
          </div>
          <h2 className="text-3xl md:text-4xl font-light">{t.title}</h2>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 md:p-12 backdrop-blur-sm">
          <p className="text-slate-400 mb-8 text-lg font-light leading-relaxed">
            {t.desc}
          </p>

          <form onSubmit={getRecommendation} className="flex flex-col md:flex-row gap-4 mb-8">
            <input 
              type="text" 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={t.placeholder}
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            />
            <button 
              disabled={isLoading}
              className="px-8 py-4 bg-primary text-white font-bold uppercase tracking-widest text-xs rounded-xl hover:bg-primary/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? t.loading : t.button}
              {!isLoading && <ChevronRight className="w-4 h-4" />}
            </button>
          </form>

          <AnimatePresence>
            {response && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 bg-primary/10 border border-primary/20 rounded-xl"
              >
                <p className="font-serif italic text-xl leading-relaxed text-primary-100">
                  "{response}"
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

const ProductGrid = ({ lang, onAddToCart, onNavigate, onProductClick }: { lang: 'en' | 'cn', onAddToCart: (p: Product) => void, onNavigate: (page: string) => void, onProductClick: (p: Product) => void }) => {
  const [visibleCount, setVisibleCount] = useState(3);
  const t = translations[lang].collection;

  return (
    <section id="collection" className="py-32 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <div className="max-w-xl">
            <span className="text-primary font-bold tracking-[0.3em] uppercase text-xs mb-4 block">{t.tag}</span>
            <h2 className="text-4xl md:text-5xl font-light leading-tight">{t.title}</h2>
          </div>
          <button 
            onClick={() => onNavigate('allProducts')}
            className="text-xs uppercase tracking-[0.3em] font-bold border-b-2 border-primary pb-2 hover:text-primary transition-all"
          >
            {t.viewAll}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {PRODUCTS.slice(0, visibleCount).map((product) => (
            <motion.div 
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              onClick={() => onProductClick(product)}
              className="group cursor-pointer"
            >
              <div className="relative aspect-[3/4] bg-slate-100 rounded-2xl mb-8 overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-6 left-6 bg-primary px-3 py-1 text-[10px] uppercase tracking-widest font-bold text-white">
                  {lang === 'en' ? product.vintage : product.vintageCn}
                </div>
              </div>
              <h3 className="text-2xl font-light mb-2 group-hover:text-primary transition-colors">
                {lang === 'en' ? product.name : product.nameCn}
              </h3>
              <p className="text-slate-500 text-sm tracking-widest uppercase mb-4">
                {lang === 'en' ? product.category : product.categoryCn} / 53% Vol
              </p>
              <p className="text-slate-400 text-sm font-light leading-relaxed mb-6 line-clamp-2">
                {lang === 'en' ? product.description : product.descriptionCn}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xl font-medium text-slate-900">${product.price}</span>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddToCart(product);
                  }}
                  className="p-3 bg-slate-900 text-white rounded-full hover:bg-primary transition-colors"
                >
                  <ShoppingBag className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {visibleCount < PRODUCTS.length && (
          <div className="mt-20 text-center">
            <button 
              onClick={() => setVisibleCount(PRODUCTS.length)}
              className="px-10 py-4 border border-slate-200 text-slate-900 text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-slate-50 transition-all"
            >
              {t.viewMore}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

const CartDrawer = ({ 
  isOpen, 
  onClose, 
  items, 
  onUpdateQuantity, 
  onRemove,
  lang 
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  items: CartItem[],
  onUpdateQuantity: (id: number, delta: number) => void,
  onRemove: (id: number) => void,
  lang: 'en' | 'cn'
}) => {
  const t = translations[lang].cart;
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
          />
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-[70] shadow-2xl flex flex-col"
          >
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-2xl font-light">{t.title}</h2>
              <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-4">
                  <ShoppingBag className="w-12 h-12 opacity-20" />
                  <p>{t.empty}</p>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-24 h-32 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-medium text-slate-900">{lang === 'en' ? item.name : item.nameCn}</h3>
                        <p className="text-xs text-slate-400 uppercase tracking-widest">{lang === 'en' ? item.category : item.categoryCn}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 bg-slate-50 rounded-lg p-1">
                          <button 
                            onClick={() => onUpdateQuantity(item.id, -1)}
                            className="p-1 hover:bg-white rounded-md transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => onUpdateQuantity(item.id, 1)}
                            className="p-1 hover:bg-white rounded-md transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-bold text-slate-900">${item.price * item.quantity}</span>
                          <button 
                            onClick={() => onRemove(item.id)}
                            className="text-red-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="p-6 border-t border-slate-100 bg-slate-50">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-slate-500 uppercase tracking-widest text-xs font-bold">{t.total}</span>
                  <span className="text-3xl font-light text-slate-900">${total}</span>
                </div>
                <button className="w-full py-4 bg-primary text-white font-bold uppercase tracking-widest text-sm rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
                  {t.checkout}
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const SearchModal = ({ 
  isOpen, 
  onClose, 
  lang,
  onAddToCart,
  onProductClick
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  lang: 'en' | 'cn',
  onAddToCart: (p: Product) => void,
  onProductClick: (p: Product) => void
}) => {
  const [query, setQuery] = useState("");
  const t = translations[lang].search;

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return PRODUCTS.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.nameCn.includes(q) || 
      p.category.toLowerCase().includes(q) || 
      p.categoryCn.includes(q)
    );
  }, [query]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-white z-[100] p-6 md:p-20 overflow-y-auto"
        >
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-12">
              <div className="flex items-center gap-4 flex-1">
                <Search className="w-8 h-8 text-primary" />
                <input 
                  autoFocus
                  type="text" 
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t.placeholder}
                  className="w-full bg-transparent border-none text-3xl md:text-5xl font-light focus:ring-0 placeholder:text-slate-100"
                />
              </div>
              <button onClick={onClose} className="p-4 hover:bg-slate-100 rounded-full transition-colors">
                <X className="w-8 h-8" />
              </button>
            </div>

            <div className="space-y-12">
              {query && (
                <div>
                  <h3 className="text-xs uppercase tracking-[0.3em] font-bold text-slate-400 mb-8">
                    {results.length} {t.results}
                  </h3>
                  {results.length === 0 ? (
                    <p className="text-2xl text-slate-300 font-light italic">{t.noResults}</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {results.map(product => (
                        <div 
                          key={product.id} 
                          onClick={() => {
                            onProductClick(product);
                            onClose();
                          }}
                          className="flex gap-6 group cursor-pointer"
                        >
                          <div className="w-32 h-40 bg-slate-100 rounded-xl overflow-hidden flex-shrink-0">
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex flex-col justify-center">
                            <h4 className="text-xl font-medium text-slate-900 group-hover:text-primary transition-colors">
                              {lang === 'en' ? product.name : product.nameCn}
                            </h4>
                            <p className="text-xs text-slate-400 uppercase tracking-widest mb-4">
                              {lang === 'en' ? product.category : product.categoryCn}
                            </p>
                            <div className="flex items-center gap-4">
                              <span className="font-bold text-slate-900">${product.price}</span>
                              <button 
                                onClick={() => {
                                  onAddToCart(product);
                                  onClose();
                                }}
                                className="text-xs font-bold uppercase tracking-widest text-primary hover:text-primary-700"
                              >
                                + {translations[lang].collection.addToCart}
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const ProductDetailModal = ({ 
  product, 
  isOpen, 
  onClose, 
  lang, 
  onAddToCart 
}: { 
  product: Product | null, 
  isOpen: boolean, 
  onClose: () => void, 
  lang: 'en' | 'cn',
  onAddToCart: (p: Product) => void
}) => {
  if (!product) return null;
  const t = translations[lang].collection;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xl z-[100]"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl h-full max-h-[90vh] bg-white z-[110] shadow-2xl rounded-[3rem] overflow-hidden flex flex-col md:flex-row"
          >
            <button 
              onClick={onClose}
              className="absolute top-8 right-8 p-3 bg-white/80 backdrop-blur-md rounded-full text-slate-900 hover:bg-primary hover:text-white transition-all z-20 shadow-lg"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="w-full md:w-1/2 h-1/2 md:h-full relative overflow-hidden bg-slate-100">
              <motion.img 
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1.5 }}
                src={product.image} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-10 left-10 bg-primary/90 backdrop-blur-md px-6 py-2 text-xs uppercase tracking-[0.3em] font-bold text-white rounded-full">
                {lang === 'en' ? product.vintage : product.vintageCn}
              </div>
            </div>

            <div className="w-full md:w-1/2 h-1/2 md:h-full p-10 md:p-20 overflow-y-auto flex flex-col justify-center">
              <div className="mb-12">
                <span className="text-primary font-bold tracking-[0.4em] uppercase text-xs mb-4 block">
                  {lang === 'en' ? product.category : product.categoryCn}
                </span>
                <h2 className="text-4xl md:text-6xl font-light tracking-tight mb-6 leading-tight">
                  {lang === 'en' ? product.name : product.nameCn}
                </h2>
                <div className="flex items-center gap-6 mb-8">
                  <span className="text-3xl font-medium text-slate-900">${product.price}</span>
                  <div className="h-6 w-px bg-slate-200"></div>
                  <span className="text-slate-400 text-sm tracking-widest uppercase">53% Vol / 500ml</span>
                </div>
                <p className="text-slate-500 text-lg font-light leading-relaxed">
                  {lang === 'en' ? product.description : product.descriptionCn}
                </p>
              </div>

              <div className="space-y-8 mb-12">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-primary" />
                  </div>
                  <p className="text-sm text-slate-600 font-light">
                    {lang === 'en' ? "Handcrafted in small batches using ancient earthenware aging." : "采用古法陶坛陈酿，小批量手工制作。"}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center">
                    <Mountain className="w-5 h-5 text-primary" />
                  </div>
                  <p className="text-sm text-slate-600 font-light">
                    {lang === 'en' ? "Sourced from the pristine waters of the Highland Peaks." : "水源取自高山巅峰的纯净之水。"}
                  </p>
                </div>
              </div>

              <button 
                onClick={() => {
                  onAddToCart(product);
                  onClose();
                }}
                className="w-full py-6 bg-slate-900 text-white font-bold uppercase tracking-[0.3em] text-sm rounded-2xl hover:bg-primary transition-all flex items-center justify-center gap-4 group shadow-xl hover:shadow-primary/20"
              >
                <ShoppingBag className="w-5 h-5 transition-transform group-hover:-translate-y-1" />
                {t.addToCart}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const LoginModal = ({ 
  isOpen, 
  onClose, 
  lang, 
  onLogin 
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  lang: 'en' | 'cn',
  onLogin: (u: User) => void
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const t = translations[lang].user;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsLoading(false);
    setIsSuccess(true);
    
    await new Promise(resolve => setTimeout(resolve, 800));
    
    onLogin({ name: email.split('@')[0], email });
    onClose();
    setIsSuccess(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-md z-[80]"
          />
          <motion.div 
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white z-[90] shadow-2xl rounded-[2.5rem] overflow-hidden"
          >
            <div className="p-10 md:p-14">
              <div className="text-center mb-12">
                <motion.div 
                  initial={{ rotate: -10 }}
                  animate={{ rotate: 0 }}
                  className="inline-flex p-5 bg-primary/5 rounded-full mb-8"
                >
                  <Wine className="w-10 h-10 text-primary" />
                </motion.div>
                <h2 className="text-4xl font-light tracking-tight mb-2">{t.login}</h2>
                <p className="text-slate-400 text-xs uppercase tracking-widest">Access the Resonance Circle</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-6">
                  <div className="relative group">
                    <label className="absolute -top-2.5 left-4 bg-white px-2 text-[9px] uppercase tracking-widest font-bold text-slate-400 z-10">Email</label>
                    <input 
                      required
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white border border-slate-100 rounded-2xl px-6 py-4.5 text-sm focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all"
                      placeholder="name@example.com"
                    />
                  </div>
                  <div className="relative group">
                    <label className="absolute -top-2.5 left-4 bg-white px-2 text-[9px] uppercase tracking-widest font-bold text-slate-400 z-10">Password</label>
                    <input 
                      required
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-white border border-slate-100 rounded-2xl px-6 py-4.5 text-sm focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
                
                <button 
                  type="submit"
                  disabled={isLoading || isSuccess}
                  className="relative w-full py-5 bg-slate-900 text-white font-bold uppercase tracking-[0.2em] text-[10px] rounded-2xl overflow-hidden transition-all hover:bg-primary disabled:opacity-70 shadow-xl shadow-slate-900/10"
                >
                  <AnimatePresence mode="wait">
                    {isLoading ? (
                      <motion.div 
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center justify-center gap-2"
                      >
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Authenticating</span>
                      </motion.div>
                    ) : isSuccess ? (
                      <motion.div 
                        key="success"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-center gap-2"
                      >
                        <Sparkles className="w-4 h-4" />
                        <span>Welcome</span>
                      </motion.div>
                    ) : (
                      <motion.span key="idle">{t.login}</motion.span>
                    )}
                  </AnimatePresence>
                </button>
              </form>

              <div className="mt-10 text-center">
                <button className="text-[10px] uppercase tracking-widest text-slate-400 hover:text-primary transition-colors">
                  Forgot your password?
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const Footer = ({ lang, onNavigate }: { lang: 'en' | 'cn', onNavigate: (page: string) => void }) => {
  const t = translations[lang].footer;
  return (
    <footer className="bg-slate-50 py-24 px-6 border-t border-slate-200">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16">
        <div className="col-span-1 md:col-span-1">
          <div className="flex items-center gap-2 mb-8">
            <Wine className="w-6 h-6 text-primary" />
            <span className="text-xl font-bold tracking-tighter text-slate-900">BANLAN</span>
          </div>
          <p className="text-slate-500 text-sm font-light leading-relaxed mb-8">
            {t.desc}
          </p>
          <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold mb-4 text-slate-900">{t.followUs}</h4>
          <div className="flex gap-4">
            <button className="p-2 bg-white border border-slate-200 rounded-full hover:text-primary transition-colors">
              <Instagram className="w-4 h-4" />
            </button>
            <button className="p-2 bg-white border border-slate-200 rounded-full hover:text-primary transition-colors">
              <Twitter className="w-4 h-4" />
            </button>
            <button className="p-2 bg-white border border-slate-200 rounded-full hover:text-primary transition-colors">
              <Facebook className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-[0.2em] font-bold mb-8 text-slate-900">{t.nav}</h4>
          <ul className="flex flex-col gap-4 text-sm font-light text-slate-500">
            {Object.keys(translations[lang].nav).map(key => (
              <li key={key}>
                <button 
                  onClick={() => onNavigate(key)}
                  className="hover:text-primary transition-colors text-left"
                >
                  {(translations[lang].nav as any)[key]}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-[0.2em] font-bold mb-8 text-slate-900">{t.customerService}</h4>
          <ul className="flex flex-col gap-4 text-sm font-light text-slate-500">
            <li><a href="#" className="hover:text-primary transition-colors">{t.shippingPolicy}</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">{t.returns}</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">{t.faq}</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">{t.privacy}</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-[0.2em] font-bold mb-8 text-slate-900">{t.newsletter}</h4>
          <p className="text-slate-500 text-sm font-light mb-6">{t.newsDesc}</p>
          <div className="flex gap-2">
            <input 
              type="email" 
              placeholder="Email" 
              className="flex-1 bg-white border border-slate-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <button className="p-2 bg-slate-900 text-white rounded-lg hover:bg-primary transition-colors">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] uppercase tracking-widest text-slate-400">
        <div className="flex flex-col gap-2 items-center md:items-start">
          <p>© 2024 BANLAN Spirit of Resonance. {t.rights}</p>
          <p className="text-slate-300 font-medium">{t.warning}</p>
        </div>
        <div className="flex gap-8">
          <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
        </div>
      </div>
    </footer>
  );
};

export default function App() {
  const [hasEntered, setHasEntered] = useState(false);
  const [lang, setLang] = useState<'en' | 'cn'>('en');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState('home');

  const t = translations[lang];

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const handleNavigate = (page: string) => {
    if (page === 'home') {
      setCurrentPage('home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (page === 'allProducts' || page === 'craftsmanship') {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (['philosophy', 'living', 'joinUs', 'contactUs'].includes(page)) {
      if (currentPage !== 'home' && ['philosophy', 'living'].includes(page)) {
        setCurrentPage('home');
        // Wait for render then scroll
        setTimeout(() => {
          const el = document.getElementById(page);
          el?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else if (['joinUs', 'contactUs'].includes(page)) {
        setCurrentPage(page);
        window.scrollTo(0, 0);
      } else {
        const el = document.getElementById(page);
        el?.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      setCurrentPage(page);
      window.scrollTo(0, 0);
    }
  };

  const openProductDetail = (product: Product) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-primary/30">
      <AnimatePresence>
        {!hasEntered && (
          <IntroPage lang={lang} onEnter={() => setHasEntered(true)} />
        )}
      </AnimatePresence>

      {hasEntered && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <Navbar 
            lang={lang} 
            setLang={setLang} 
            cartCount={cart.reduce((s, i) => s + i.quantity, 0)}
            onOpenCart={() => setIsCartOpen(true)}
            onOpenSearch={() => setIsSearchOpen(true)}
            onOpenLogin={() => setIsLoginOpen(true)}
            user={user}
            onLogout={() => setUser(null)}
            currentPage={currentPage}
            onNavigate={handleNavigate}
          />
          
          <main>
            {currentPage === 'home' && (
              <>
                <Hero lang={lang} onNavigate={handleNavigate} />
                
                <section id="philosophy" className="py-32 px-6 bg-slate-50 overflow-hidden">
                  <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-24 items-center">
                    <motion.div 
                      initial={{ opacity: 0, x: -50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      className="relative"
                    >
                      <div className="aspect-[4/5] bg-slate-200 rounded-2xl overflow-hidden shadow-2xl">
                        <img 
                          src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=1000&auto=format&fit=crop" 
                          alt="Philosophy" 
                          className="w-full h-full object-cover grayscale"
                        />
                      </div>
                      <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10"></div>
                    </motion.div>
                    
                    <motion.div 
                      initial={{ opacity: 0, x: 50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      className="space-y-8"
                    >
                      <span className="text-primary font-bold tracking-[0.3em] uppercase text-xs">{t.philosophy.tag}</span>
                      <h2 className="text-4xl md:text-6xl font-light leading-tight">{t.philosophy.title}</h2>
                      <p className="text-lg text-slate-600 font-light leading-relaxed">
                        {t.philosophy.desc}
                      </p>
                      <div className="pt-8 border-t border-slate-200">
                        <blockquote className="font-serif italic text-2xl text-slate-500 leading-relaxed">
                          "{t.philosophy.quote}"
                        </blockquote>
                      </div>
                    </motion.div>
                  </div>
                </section>

                <ProductGrid lang={lang} onAddToCart={addToCart} onNavigate={handleNavigate} onProductClick={openProductDetail} />
                <SpiritGuide lang={lang} />
                
                <section id="living" className="py-32 px-6 bg-white">
                  <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-24">
                      <span className="text-primary font-bold tracking-[0.4em] uppercase text-xs mb-4 block">{t.lifestyle.tag}</span>
                      <h2 className="text-4xl md:text-5xl font-light">{t.lifestyle.title}</h2>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="relative group h-[600px] overflow-hidden rounded-2xl">
                        <img 
                          src="https://images.unsplash.com/photo-1527281405623-3218953bc5b5?q=80&w=1200&auto=format&fit=crop" 
                          alt="Lifestyle 1" 
                          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all"></div>
                        <div className="absolute bottom-12 left-12 text-white">
                          <h4 className="text-3xl font-light mb-4">{t.lifestyle.ritual.title}</h4>
                          <p className="text-white/70 font-light mb-8 max-w-sm">{t.lifestyle.ritual.desc}</p>
                          <button className="text-xs uppercase tracking-widest font-bold border-b-2 border-primary pb-1">{t.lifestyle.explore}</button>
                        </div>
                      </div>
                      
                      <div className="grid grid-rows-2 gap-8">
                        <div className="relative group overflow-hidden rounded-2xl">
                          <img 
                            src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=1200&auto=format&fit=crop" 
                            alt="Lifestyle 2" 
                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-all"></div>
                          <div className="absolute bottom-8 left-8 text-white">
                            <h4 className="text-2xl font-light mb-2">{t.lifestyle.spaces.title}</h4>
                            <button className="text-xs uppercase tracking-widest font-bold border-b border-primary/50 pb-1">{t.lifestyle.viewGallery}</button>
                          </div>
                        </div>
                        <div className="relative group overflow-hidden rounded-2xl">
                          <img 
                            src="https://images.unsplash.com/photo-1569058242253-92a9c71f9867?q=80&w=1200&auto=format&fit=crop" 
                            alt="Lifestyle 3" 
                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-all"></div>
                          <div className="absolute bottom-8 left-8 text-white">
                            <h4 className="text-2xl font-light mb-2">{t.lifestyle.craft.title}</h4>
                            <button 
                              onClick={() => handleNavigate('craftsmanship')}
                              className="text-xs uppercase tracking-widest font-bold border-b border-primary/50 pb-1"
                            >
                              {t.lifestyle.readStory}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </>
            )}

            {currentPage === 'allProducts' && (
              <AllProductsPage lang={lang} onAddToCart={addToCart} onProductClick={openProductDetail} />
            )}

            {currentPage === 'craftsmanship' && (
              <CraftsmanshipPage lang={lang} />
            )}

            {currentPage === 'joinUs' && (
              <JoinUsPage lang={lang} />
            )}

            {currentPage === 'contactUs' && (
              <ContactUsPage lang={lang} />
            )}
          </main>

          <Footer lang={lang} onNavigate={handleNavigate} />
        </motion.div>
      )}

      {/* Modals & Drawers */}
      <CartDrawer 
        lang={lang}
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        items={cart}
        onUpdateQuantity={updateQuantity}
        onRemove={removeFromCart}
      />
      
      <SearchModal 
        lang={lang}
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
        onAddToCart={addToCart}
        onProductClick={openProductDetail}
      />

      <ProductDetailModal 
        lang={lang}
        product={selectedProduct}
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        onAddToCart={addToCart}
      />

      <LoginModal 
        lang={lang}
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLogin={setUser}
      />
    </div>
  );
}
