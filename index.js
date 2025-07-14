import Layout from '../components/Layout';
import ProductCard from '../components/ProductCard';
import Link from 'next/link';
import axios from 'axios';

// Datos de ejemplo para el banner y productos más vendidos
const bannerData = {
  title: 'La Mejor Selección de Productos Digitales',
  subtitle: 'Suscripciones, tarjetas de regalo y más, al instante.',
  imageUrl: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=2070&auto=format&fit=crop',
};

export default function HomePage({ featuredProducts, bestSellers }) {
  return (
    <Layout title="Inicio | DigitalStore">
      {/* Banner Principal */}
      <div className="relative bg-dark text-white rounded-lg overflow-hidden mb-12">
        <div className="absolute inset-0">
          <img src={bannerData.imageUrl} alt="Banner principal" className="w-full h-full object-cover opacity-30" />
        </div>
        <div className="relative container mx-auto px-6 py-24 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold">{bannerData.title}</h1>
          <p className="mt-4 text-lg md:text-xl text-gray-300">{bannerData.subtitle}</p>
          <Link href="/products" className="mt-8 inline-block bg-primary hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-lg transition-colors">
            Explorar Catálogo
          </Link>
        </div>
      </div>

      {/* Productos Destacados */}
      <section id="featured" className="mb-12">
        <h2 className="text-3xl font-bold text-center mb-8">Productos Destacados</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredProducts.length > 0 ? (
            featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500">No hay productos destacados en este momento.</p>
          )}
        </div>
      </section>

      {/* Más Vendidos */}
      <section>
        <h2 className="text-3xl font-bold text-center mb-8">Los Más Vendidos</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
           {bestSellers.length > 0 ? (
            bestSellers.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))
           ) : (
            <p className="col-span-full text-center text-gray-500">Aún no hay productos más vendidos.</p>
           )}
        </div>
      </section>
    </Layout>
  );
}

// --- Carga de Datos del Lado del Servidor (SSR) ---
export async function getServerSideProps() {
  const API_URL = process.env.API_URL || 'http://localhost:5000/api';
  try {
    // Peticiones en paralelo para mayor eficiencia
    const [featuredRes, productsRes] = await Promise.all([
      axios.get(`${API_URL}/products?isFeatured=true`),
      axios.get(`${API_URL}/products`) // Traemos todos para simular "más vendidos"
    ]);

    // Simulación de "más vendidos" tomando los dos primeros productos que no sean destacados
    const nonFeaturedProducts = productsRes.data.filter(p => !p.isFeatured);
    const bestSellers = nonFeaturedProducts.slice(0, 2);

    return {
      props: {
        featuredProducts: featuredRes.data,
        bestSellers: bestSellers,
      },
    };
  } catch (error) {
    console.error("Error fetching homepage data:", error.message);
    // Devolvemos arrays vacíos para que la página no se rompa si la API falla
    return {
      props: {
        featuredProducts: [],
        bestSellers: [],
      },
    };
  }
}
