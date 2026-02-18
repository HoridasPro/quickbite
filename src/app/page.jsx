import HeroSection from "@/components/HeroSection";
import FoodsPage from "./foods/page";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div>
      <HeroSection></HeroSection>
      <FoodsPage></FoodsPage>
      <Footer></Footer>
    </div>
  );
}
