import { Facebook, Instagram, MessageCircle, MapPin, Mail, ChevronRight } from 'lucide-react';

export default function Footer({ onAdminLogin }: { onAdminLogin?: () => void }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-midnight pt-20 pb-10 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="lg:col-span-1">
            <div className="relative mb-8">
              <img 
                src="logo.png" 
                alt="Cafe Midnight" 
                className="h-24 md:h-32 transition-transform hover:scale-105" 
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                  (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                }}
              />
              <div className="hidden flex items-center gap-2">
                <div className="w-12 h-12 bg-gold rounded-full flex items-center justify-center">
                  <span className="text-midnight font-black text-2xl">M</span>
                </div>
                <span className="text-3xl font-serif font-bold text-white">Cafe<span className="text-gold">Midnight</span></span>
              </div>
            </div>
            <p className="text-white/50 leading-relaxed mb-8">
              Experience the best open-air dining in Karachi. Premium food, peaceful vibes, and unforgettable midnight memories.
            </p>
            <div className="flex gap-4">
              {[
                { icon: <Facebook size={20} />, href: '#' },
                { icon: <Instagram size={20} />, href: '#' },
                { icon: <MessageCircle size={20} />, href: '#' },
                { icon: <MapPin size={20} />, href: '#' },
              ].map((social, i) => (
                <a key={i} href={social.href} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-gold hover:text-midnight transition-all">
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xl font-serif font-bold mb-6">Quick Links</h4>
            <ul className="space-y-4">
              {['Home', 'About', 'Menu', 'Reviews', 'Reservation', 'Contact'].map((link) => (
                <li key={link}>
                  <a href={`#${link.toLowerCase()}`} className="text-white/50 hover:text-gold flex items-center gap-2 group transition-all">
                    <ChevronRight size={14} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xl font-serif font-bold mb-6">Opening Hours</h4>
            <ul className="space-y-4 text-white/50">
              <li className="flex justify-between">
                <span>Mon - Thu:</span>
                <span className="text-white font-medium">5:00 PM - 12:00 AM</span>
              </li>
              <li className="flex justify-between">
                <span>Fri - Sat:</span>
                <span className="text-white font-medium">5:00 PM - 1:00 AM</span>
              </li>
              <li className="flex justify-between">
                <span>Sunday:</span>
                <span className="text-gold font-bold">5:00 PM - 12:00 AM</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xl font-serif font-bold mb-6">Newsletter</h4>
            <p className="text-white/50 text-sm mb-4">Subscribe to get latest updates and offers.</p>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="Email Address" 
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 flex-grow outline-none focus:border-gold"
              />
              <button className="bg-gold text-midnight p-2 rounded-xl">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-white/40 text-sm">
          <p>© {currentYear} Cafe Midnight. All rights reserved.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
