import { motion } from 'motion/react';
import { Leaf, Clock, Users, Coffee } from 'lucide-react';

export default function Features() {
  const features = [
    {
      icon: <Users className="text-gold" />,
      title: 'Peaceful Ambiance',
      desc: 'Escape the city noise in our serene open-air environment perfect for family and friends.'
    },
    {
      icon: <Leaf className="text-gold" />,
      title: 'Fresh Food',
      desc: 'We use the finest local ingredients to prepare every dish fresh to your table.'
    },
    {
      icon: <Clock className="text-gold" />,
      title: 'Affordable Dining',
      desc: 'Premium restaurant experience at prices that wont break your budget.'
    },
    {
      icon: <Coffee className="text-gold" />,
      title: 'Perfect Hangout Spot',
      desc: 'Enjoy our signature chai and snacks until midnight in a vibes-only setting.'
    }
  ];

  return (
    <section className="section-padding bg-white/5 border-y border-white/10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-serif font-bold mb-4">Why Choose Cafe Midnight?</h2>
          <p className="text-white/60 max-w-2xl mx-auto">Discover what makes us the most loved cafe in FC Area Nazimabad.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className="glass p-8 rounded-2xl transition-all duration-300 group"
            >
              <div className="w-14 h-14 bg-midnight rounded-xl flex items-center justify-center mb-6 group-hover:bg-gold/20 transition-colors">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-white/60 text-sm leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
