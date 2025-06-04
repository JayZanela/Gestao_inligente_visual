import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { menuConfig } from '../config/formFields';
import { Package, ShoppingCart, Calendar } from 'lucide-react';

const getIcon = (iconName: string) => {
  switch (iconName) {
    case 'package':
      return <Package size={24} />;
    case 'shopping-cart':
      return <ShoppingCart size={24} />;
    case 'calendar':
      return <Calendar size={24} />;
    default:
      return <Package size={24} />;
  }
};

export const Estoque: React.FC = () => {
  const navigate = useNavigate();
  const estoqueMenu = menuConfig.find(item => item.id === 'estoque');

  if (!estoqueMenu) {
    return <div>Configuração de menu não encontrada</div>;
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-6">Gerenciamento de Estoque</h1>
      <p className="text-gray-600 mb-8">{estoqueMenu.description}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {estoqueMenu.subPages?.map((subPage) => (
          <Card
            key={subPage.id}
            title={subPage.title}
            description={subPage.description}
            icon={getIcon(estoqueMenu.icon)}
            to={subPage.path}
            className="h-full"
          />
        ))}
      </div>
    </div>
  );
};

export default Estoque;
