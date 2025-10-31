export function Button({ children, onClick, className = '', variant = 'default', ...props }) {
  const baseStyles = 'px-4 py-2 rounded-lg font-medium transition-smooth';

  const variants = {
    default: 'bg-gray-800 hover:bg-gray-700 text-white',
    primary: 'ember-bg text-black hover:opacity-90',
    outline: 'border-2 border-gray-700 hover:border-gray-600 text-white',
  };

  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
