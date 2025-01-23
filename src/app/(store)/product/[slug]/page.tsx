import Image from "next/image";
import { api } from "@/data/api";
import { Product } from "@/data/types/products";
import { Metadata } from "next";
import { AddToCartButton } from "@/components/add-to-cart-button";

interface ProductProps {
  params: { slug: string };
}

async function getProduct(slug: string): Promise<Product> {
  try {
    const response = await api(`/products/${slug}`, {
      next: {
        revalidate: 60 * 60,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch product");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error;
  }
}

export async function generateMetadata({ params }: ProductProps): Promise<Metadata> {
  const { slug } = params;
  const product = await getProduct(slug);
  return {
    title: product.title,
  };
}

export async function generateStaticParams() {
  const response = await api("/products/featured");
  if (!response.ok) {
    console.error("Error fetching featured products");
    return [];
  }

  const products: Product[] = await response.json();
  return products.map((product) => ({ slug: product.slug }));
}

export default async function ProductPage({ params }: ProductProps) {
  const { slug } = params;
  const product = await getProduct(slug);

  return (
    <div className="relative grid max-h-[860px] grid-cols-3">
      <div className="col-span-2 overflow-hidden">
        <Image
          src={product.image}
          alt={product.title} // Texto alternativo dinâmico
          width={1000}
          height={1000}
          quality={100}
        />
      </div>
      <div className="flex flex-col justify-center px-12">
        <h1 className="text-3xl font-bold leading-tight">{product.title}</h1>
        <p className="mt-2 leading-relaxed text-zinc-400">{product.description}</p>
        <div className="mt-8 flex items-center gap-3">
          <span className="inline-block rounded-full bg-violet-500 px-5 py-2.5 text-semibold">
            {product.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
          </span>
          <span className="text-sm text-zinc-400">
            Em até 12 vezes sem juros de{" "}
            {(product.price / 12).toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
              minimumFractionDigits: 2,
            })}
          </span>
        </div>
        <div className="mt-8 space-y-4">
          <span className="block font-semibold">Tamanhos</span>
          <div className="flex gap-2">
            {["P", "M", "G", "GG"].map((size) => (
              <button
                key={size}
                type="button"
                className="flex h-9 w-14 items-center justify-center rounded-full border border-zinc-700 bg-zinc-800 text-sm font-semibold"
                aria-label={`Selecionar tamanho ${size}`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
        <AddToCartButton productId={product.id} />
      </div>
    </div>
  );
}
