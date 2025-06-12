import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { authorizedUsers } from "../config/formFields";
import { useGlobalParams } from "../context/GlobalParamsContext";

export const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { params, setParam } = useGlobalParams();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Simula verificação com o "banco de dados"
    setTimeout(() => {
      if (authorizedUsers.includes(email)) {
        // Salva o usuário no localStorage para manter a sessão
        localStorage.setItem("user", email);
        if (email.includes("sumare")) {
          setParam("montadora_id", 2);
        } else {
          setParam("montadora_id", 1);
        }
        navigate("/estoque");
      } else {
        setError("E-mail não autorizado. Por favor, tente novamente.");
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Estoque Inteligente
          </h1>
          <p className="mt-2 text-gray-600">
            Faça login para acessar o sistema
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <Input
              id="email"
              label="E-mail"
              type="email"
              placeholder="Digite seu e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <Button type="submit" variant="primary" fullWidth disabled={loading}>
            {loading ? "Verificando..." : "Entrar"}
          </Button>

          <div className="text-center text-sm text-gray-500">
            <p>Use um dos e-mails autorizados para teste:</p>
            <p className="font-medium">
              admin@estoque.com, usuario@estoque.com, teste@estoque.com
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
