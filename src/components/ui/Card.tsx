import React from 'react';
import { Link } from 'react-router-dom';

interface CardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  to?: string;
  onClick?: () => void;
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  title,
  description,
  icon,
  to,
  onClick,
  className = '',
}) => {
  const cardContent = (
    <div className={`bg-white rounded-lg shadow-md p-6 transition-all hover:shadow-lg ${className}`}>
      {icon && <div className="text-primary mb-4 text-2xl">{icon}</div>}
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
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
