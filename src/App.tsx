import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SashProvider } from "@/context/SashContext";
import GlitterCursor from "@/components/sash/GlitterCursor";
import SageWidget from "@/components/sash/SageWidget";
import ScrollToTop from "@/components/sash/ScrollToTop";
import Home from "./pages/Home";
import Aesthetics from "./pages/Aesthetics";
import AestheticDetail from "./pages/AestheticDetail";
import ForYou from "./pages/ForYou";
import ProductDetail from "./pages/ProductDetail";
import Wishlist from "./pages/Wishlist";
import Cart from "./pages/Cart";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import SharedDna from "./pages/SharedDna";
import Shop from "./pages/Shop";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <SashProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <GlitterCursor />
          <SageWidget />
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/aesthetics" element={<Aesthetics />} />
            <Route path="/aesthetics/:id" element={<AestheticDetail />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/for-you" element={<ForYou />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/about" element={<About />} />
            <Route path="/dna/:sessionId" element={<SharedDna />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </SashProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
