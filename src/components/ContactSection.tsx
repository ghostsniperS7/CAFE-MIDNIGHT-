import { Phone, MapPin, Clock, ExternalLink } from 'lucide-react';
import { motion } from 'motion/react';

export default function ContactSection() {
  return (
    <section id="contact" className="section-padding bg-midnight border-t border-white/5">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
        <motion.div
           initial={{ opacity: 0, x: -50 }}
           whileInView={{ opacity: 1, x: 0 }}
           transition={{ duration: 0.8 }}
           viewport={{ once: true }}
        >
          <span className="text-gold font-accent text-xl mb-2 block">Reach Out</span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-8">Location & Contact</h2>
          
          <div className="space-y-10">
            <div className="flex gap-6">
              <div className="w-14 h-14 bg-gold/10 text-gold rounded-2xl flex items-center justify-center flex-shrink-0">
                <MapPin size={28} />
              </div>
              <div>
                <h4 className="text-xl font-bold mb-2">Our Address</h4>
                <p className="text-white/60 leading-relaxed">
                  Cafe Midnight, FC Area Nazimabad, Karachi, Pakistan.<br />
                  Located in Jama Ground Area.
                </p>
                <a href="https://maps.google.com" className="inline-flex items-center gap-2 text-gold mt-4 hover:underline">
                  Get Directions <ExternalLink size={14} />
                </a>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="w-14 h-14 bg-gold/10 text-gold rounded-2xl flex items-center justify-center flex-shrink-0">
                <Phone size={28} />
              </div>
              <div>
                <h4 className="text-xl font-bold mb-2">Phone Number</h4>
                <p className="text-white/60 mb-1">+92 364 3300003</p>
                <p className="text-white/40 text-sm">Available for takeaway and reservations</p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="w-14 h-14 bg-gold/10 text-gold rounded-2xl flex items-center justify-center flex-shrink-0">
                <Clock size={28} />
              </div>
              <div>
                <h4 className="text-xl font-bold mb-2">Opening Hours</h4>
                <p className="text-white/60">Monday - Sunday</p>
                <p className="text-gold font-bold">5:00 PM - 12:00 AM</p>
              </div>
            </div>
          </div>

          <div className="mt-12">
            <a href="tel:+923643300003" className="btn-primary inline-flex items-center gap-3">
              <Phone size={20} />
              Call Now to Order
            </a>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="h-[500px] rounded-[40px] overflow-hidden border border-white/10 glass"
        >
          {/* Using a placeholder iframe for Google Maps */}
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14473.084724991147!2d67.027003!3d24.9197!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3eb33f9011786197%3A0xe54bb374567e6c43!2sNazimabad%2C%20Karachi%2C%20Pakistan!5e0!3m2!1sen!2s!4v1715096500000!5m2!1sen!2s" 
            width="100%" 
            height="100%" 
            style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg)' }} 
            allowFullScreen={true} 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
          />
        </motion.div>
      </div>
    </section>
  );
}
