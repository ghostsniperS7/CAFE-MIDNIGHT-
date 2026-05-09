import { motion } from 'motion/react';
import { Star, Quote } from 'lucide-react';
import { REVIEWS } from '../constants';

export default function ReviewsSection() {
  return (
    <section id="reviews" className="section-padding bg-white/5 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gold/5 blur-[150px] rounded-full pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <span className="text-gold font-accent text-xl">Testimonials</span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold mt-2">What Our Customers Say</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {REVIEWS.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="glass p-8 rounded-3xl relative"
            >
              <Quote size={40} className="absolute top-6 right-8 text-white/5" />
              
              <div className="flex items-center gap-1 text-gold mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} fill={i < review.rating ? "currentColor" : "none"} strokeWidth={i < review.rating ? 0 : 2} />
                ))}
              </div>

              <p className="text-white/80 text-lg italic mb-8 leading-relaxed">
                "{review.comment}"
              </p>

              <div className="flex items-center justify-between border-t border-white/10 pt-6">
                <div>
                  <h4 className="font-bold text-lg">{review.userName}</h4>
                  <span className="text-white/40 text-sm">{review.date}</span>
                </div>
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center font-bold text-xl text-gold border border-gold/20">
                  {review.userName.charAt(0)}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
