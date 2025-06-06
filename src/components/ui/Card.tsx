import React from 'react';
import { Link } from 'react-router-dom';

interface CardProps {
  title: string;
  description: React.ReactNode;
  icon?: React.ReactNode;
  to?: string;
  onClick?: () => void;
  className?: string;
  children?: React.ReactNode; // ✅ adicionado
}

export const Card: React.FC<CardProps> = ({
  title,
  description,
  icon,
  to,
  onClick,
  className = '',
  children, // ✅ adicionado
}) => {
  const cardContent = (
    <div className={`bg-white rounded-lg shadow-md p-2 transition-all hover:shadow-lg ${className}`}>
      {icon && <div className="text-primary mb-4 text-2xl">{icon}</div>}
      <h3 className="text-lg font-medium text-gray-900 mb-1">{title}</h3>
      <h2 className="text-gray-800 mb-2">{description}</h2>

      {children && <div className="mt-2">{children}</div>} {/* ✅ renderiza children */}
    </div>
  );

  if (to) {
    return <Link to={to} className="block">{cardContent}</Link>;
  }

  if (onClick) {
    return <button onClick={onClick} className="w-full text-left">{cardContent}</button>;
  }

  return cardContent;
};

export default Card;
