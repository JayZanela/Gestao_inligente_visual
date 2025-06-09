import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Login from './pages/Login';
import Estoque from './pages/Estoque';
import Produtos from './pages/produtos/Produtos';
import Movimentos from './pages/movimentacao/Movimentacao';
import Enderecos from './pages/enderecos/Enderecos'
import ProdutoCadastroForm from './pages/produtos/ProdutoCadastroForm';

// Páginas em desenvolvimento (placeholders)


const Pedidos = () => (
  <div className="container mx-auto">
    <h1 className="text-2xl font-bold mb-6">Pedidos</h1>
    <div className="bg-white rounded-lg shadow-md p-6">
      <p className="text-gray-600">Funcionalidade em desenvolvimento!</p>
    </div>
  </div>
);

const Agendamentos = () => (
  <div className="container mx-auto">
    <h1 className="text-2xl font-bold mb-6">Agendamentos</h1>
    <div className="bg-white rounded-lg shadow-md p-6">
      <p className="text-gray-600">Funcionalidade em desenvolvimento.</p>
    </div>
  </div>
);

// Componente de proteção de rota
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = localStorage.getItem('user') !== null;
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      <Route path="/" element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="/estoque" replace />} />
        
        <Route path="estoque">
          <Route index element={<Estoque />} />
          <Route path="produtos" element={<Produtos />} />
          <Route path="produtos/cadastro" element={<ProdutoCadastroForm />} />
          <Route path="movimentacao" element={<Movimentos />} />
          <Route path="enderecos" element={<Enderecos />} />
        </Route>
        
        <Route path="pedidos">
          <Route index element={<Pedidos />} />
          <Route path="consulta" element={<Pedidos />} />
        </Route>
        
        <Route path="agendamentos">
          <Route index element={<Agendamentos />} />
          <Route path="consulta" element={<Agendamentos />} />
        </Route>
      </Route>
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
