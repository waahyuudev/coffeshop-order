interface HeroProps {
  onOrderClick: () => void;
}

export default function Hero({ onOrderClick }: HeroProps) {
  return (
    <section className="bg-coffee-brown text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl md:text-6xl font-bold mb-6">Perfect Coffee, Every Time</h2>
        <p className="text-xl md:text-2xl mb-8 opacity-90">Handcrafted with love, delivered with care</p>
        <button 
          onClick={onOrderClick}
          className="bg-white text-coffee-brown px-8 py-3 rounded-lg font-semibold hover:bg-coffee-beige transition-colors"
        >
          Order Now
        </button>
      </div>
    </section>
  );
}
