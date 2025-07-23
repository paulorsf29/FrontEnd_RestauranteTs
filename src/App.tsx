import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Auth/Login";
import Registro from "./pages/Auth/Registro";
import Menu from "./pages/Cliente/Menu/Menu";
import CardapioGerente from "./pages/Gerente/CardapioGerente";
import CarrinhoDeCompras from "./pages/Cliente/Menu/CarrinhoDeCompras";
import Perfil from "./pages/Cliente/Menu/Perfil";
import Cardapio from "./pages/Funcionario/Cardapio";
import Pedidos from "./pages/Funcionario/Pedidos";
import AuthProvider from "./contexts/AuthContext";
import { MenuProvider } from "./contexts/MenuItemContext";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <MenuProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Registro />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/carrinhoDeCompras" element={<CarrinhoDeCompras />} />
            <Route path="/perfil" element={<Perfil />} />
            <Route path="/cardapio" element={<Cardapio />} />
            <Route path="/pedidos" element={<Pedidos />} />
            <Route path="/cardapioGerente" element={<CardapioGerente />} />
          </Routes>
        </MenuProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;