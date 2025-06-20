import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { useAuth } from "../context/AuthContext";
import { useGlobalParams } from "../context/GlobalParamsContext";

export const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [name, setName] = useState("");

  const navigate = useNavigate();
  const { login, register, isLoading, error } = useAuth();
  const { setParam } = useGlobalParams();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let success = false;

    if (isRegisterMode) {
      success = await register(email, password, name);
    } else {
      success = await login(email, password);
    }

    if (success) {
      // Configurar montadora baseado no email (mantendo a lógica existente)
      if (email.includes("sumare")) {
        setParam("montadora_id", 2);
      } else {
        setParam("montadora_id", 1);
      }
      navigate("/estoque");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Estoque Inteligente
          </h1>
          <p className="mt-2 text-gray-600">
            {isRegisterMode
              ? "Criar nova conta"
              : "Faça login para acessar o sistema"}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {isRegisterMode && (
            <div>
              <Input
                id="name"
                label="Nome"
                type="text"
                placeholder="Digite seu nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

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

          <div>
            <Input
              id="password"
              label="Senha"
              type="password"
              placeholder="Digite sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            fullWidth
            disabled={isLoading}
          >
            {isLoading
              ? isRegisterMode
                ? "Criando conta..."
                : "Verificando..."
              : isRegisterMode
              ? "Criar conta"
              : "Entrar"}
          </Button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsRegisterMode(!isRegisterMode)}
              className="text-sm text-blue-600 hover:text-blue-500"
            >
              {isRegisterMode
                ? "Já tem uma conta? Faça login"
                : "Não tem uma conta? Registre-se"}
            </button>
          </div>

          {!isRegisterMode && (
            <div className="text-center text-sm text-gray-500">
              <p>Para teste, você pode criar uma nova conta ou usar:</p>
              <p className="font-medium">admin@estoque.com / senha123</p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;
