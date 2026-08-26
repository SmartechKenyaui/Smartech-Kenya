import { listProducts }  from '@/lib/cloudinary';
import { ProductCard }    from './ProductCard';

export async function FeaturedProducts() {
  let products: any[] = [];

  try {
    products = await listProducts({ featured: true });
    // Limit to 8 client-side (listProducts may not support limit param)
    products = products.slice(0, 8);
  } catch (err) {
    console.error('FeaturedProducts fetch error:', err);
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400 text-sm">
        No featured products yet — check back soon.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {products.map((product: any) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
