import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Auth/Login";
import Registro from "./pages/Auth/Registro";
import Menu from "./pages/Cliente/Menu/Menu";
import CardapioGerente from "./pages/Gerente/CardapioGerente";
import CarrinhoDeCompras from "./pages/Cliente/Menu/CarrinhoDeCompras";
import Perfil from "./pages/Cliente/Menu/Perfil";
import Pedidos from "./pages/Funcionario/Pedidos";
import AuthProvider from "./contexts/AuthContext";
import { MenuProvider } from "./contexts/MenuItemContext";
import CardapioCozinha from "./pages/Funcionario/CardapioCozinha";
import RotaProtegida from "./components/RotaProtegida";
import NaoAutorizado from "./pages/Auth/NaoAutorizado";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <MenuProvider>
          <Routes>
            {/* Rotas públicas */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Registro />} />
            <Route path="/NaoAutorizado" element={<NaoAutorizado />} />

            {/* Rotas protegidas - Cliente */}
            <Route path="/menu" element={
              <RotaProtegida cargoPermitidos={['CUSTOMER']}>
                <Menu />
              </RotaProtegida>
            } />
            
            <Route path="/carrinhoDeCompras" element={
              <RotaProtegida cargoPermitidos={['CUSTOMER']}>
                <CarrinhoDeCompras />
              </RotaProtegida>
            } />
            
            <Route path="/perfil" element={
              <RotaProtegida cargoPermitidos={['CUSTOMER', 'KITCHEN', 'DELIVERY', 'ADMIN']}>
                <Perfil />
              </RotaProtegida>
            } />

            {/* Rotas protegidas - Funcionários */}
            <Route path="/CardapioCozinha" element={
              <RotaProtegida cargoPermitidos={['KITCHEN', 'ADMIN']}>
                <CardapioCozinha />
              </RotaProtegida>
            } />
            
            <Route path="/pedidos" element={
              <RotaProtegida cargoPermitidos={['DELIVERY', 'ADMIN']}>
                <Pedidos />
              </RotaProtegida>
            } />

            {/* Rotas protegidas - Gerente */}
            <Route path="/cardapioGerente" element={
              <RotaProtegida cargoPermitidos={['ADMIN']}>
                <CardapioGerente />
              </RotaProtegida>
            } />

            {/* Rota de fallback */}
            <Route path="*" element={<div>Página não encontrada</div>} />
          </Routes>
        </MenuProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;