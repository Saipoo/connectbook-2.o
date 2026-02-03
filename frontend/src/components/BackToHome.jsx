import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

/**
 * BackToHome - Reusable navigation component
 * Provides consistent "Back to Home" functionality across all pages
 * 
 * @param {string} className - Additional CSS classes (optional)
 * @param {string} variant - 'button' | 'icon' | 'text' (default: 'button')
 * @param {string} position - 'top-left' | 'top-right' | 'inline' (default: 'top-left')
 */
const BackToHome = ({ 
  className = '', 
  variant = 'button',
  position = 'top-left',
  showText = true 
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/');
  };

  // Position styles
  const positionClasses = {
    'top-left': 'fixed top-4 left-4 z-50',
    'top-right': 'fixed top-4 right-4 z-50',
    'inline': 'inline-flex'
  };

  // Variant styles
  const getVariantClasses = () => {
    switch (variant) {
      case 'icon':
        return 'p-2 bg-white hover:bg-gray-100 rounded-full shadow-lg transition-all duration-200 hover:scale-110';
      case 'text':
        return 'text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200';
      case 'button':
      default:
        return 'px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105';
    }
  };

  return (
    <button
      onClick={handleBack}
      className={`${positionClasses[position]} ${getVariantClasses()} flex items-center gap-2 ${className}`}
      aria-label="Back to Home"
    >
      {variant === 'icon' ? (
        <Home size={20} className="text-blue-600" />
      ) : (
        <>
          <ArrowLeft size={18} />
          {showText && <span>Back to Home</span>}
        </>
      )}
    </button>
  );
};

export default BackToHome;
