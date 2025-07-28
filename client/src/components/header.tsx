import { Coffee, ShoppingCart } from "lucide-react";

interface HeaderProps {
  cartCount: number;
  onCartClick: () => void;
}

export default function Header({ cartCount, onCartClick }: HeaderProps) {
  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Coffee className="text-coffee-brown text-2xl mr-2" />
            <h1 className="text-2xl font-bold text-dark-coffee">Senada</h1>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            <a href="#menu" className="text-dark-coffee hover:text-coffee-brown transition-colors">
              Menu
            </a>
            <a href="#about" className="text-dark-coffee hover:text-coffee-brown transition-colors">
              About
            </a>
            <a href="#contact" className="text-dark-coffee hover:text-coffee-brown transition-colors">
              Contact
            </a>
          </nav>
          
          <button 
            onClick={onCartClick}
            className="relative bg-coffee-brown text-white px-4 py-2 rounded-lg hover:bg-chocolate-orange transition-colors"
          >
            <ShoppingCart className="inline mr-2 h-4 w-4" />
            Cart
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
