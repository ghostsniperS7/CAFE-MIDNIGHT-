import { motion } from 'motion/react';
import { Calendar, User, ArrowRight } from 'lucide-react';

export default function BlogSection() {
  const posts = [
    {
      id: '1',
      title: 'Our New Rooftop Garden is Now Open!',
      excerpt: 'Experience the breeze of Karachi from our newly renovated rooftop dining area.',
      date: 'May 5, 2024',
      author: 'Cafe Midnight Team',
      image: 'https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: '2',
      title: 'The Secret Behind Our Signature Chai',
      excerpt: 'Discover the blend of spices that makes our Cafe Special Chai a local favorite.',
      date: 'April 28, 2024',
      author: 'Chef Ahmed',
      image: 'https://images.unsplash.com/photo-1544787210-22c3664ef214?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: '3',
      title: 'Midnight Snacks are now 24/7 (Almost!)',
      excerpt: "We've extended our hours until 1:00 AM on weekends for your late-night cravings.",
      date: 'April 20, 2024',
      author: 'Management',
      image: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    }
  ];

  return (
    <section id="blog" className="section-padding bg-midnight/30">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <span className="text-gold font-accent text-xl">Latest News</span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold mt-2">Cafe Midnight Blog</h2>
          </div>
          <button className="text-gold hover:underline flex items-center gap-2 font-medium">
            View All Posts <ArrowRight size={16} />
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group cursor-pointer"
            >
              <div className="relative h-64 rounded-3xl overflow-hidden mb-6">
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4 bg-midnight/80 backdrop-blur-md px-4 py-2 rounded-xl text-xs font-bold border border-white/10">
                  News & Updates
                </div>
              </div>

              <div className="flex items-center gap-4 text-white/40 text-xs mb-4">
                <div className="flex items-center gap-1">
                  <Calendar size={14} />
                  <span>{post.date}</span>
                </div>
                <div className="flex items-center gap-1">
                  <User size={14} />
                  <span>{post.author}</span>
                </div>
              </div>

              <h3 className="text-2xl font-serif font-bold mb-3 group-hover:text-gold transition-colors leading-tight">
                {post.title}
              </h3>
              <p className="text-white/60 mb-6 line-clamp-2">
                {post.excerpt}
              </p>
              
              <span className="text-gold font-bold flex items-center gap-2 group-hover:translate-x-2 transition-transform">
                Read More <ArrowRight size={16} />
              </span>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
