import Link from "next/link";
import React from "react";
type PProduct = {
  addToCartHandler: (a: any) => Promise<void>;
  product: {
    name: string;
    slug: string;
    category: string;
    image: string;
    price: number;
    brand: string;
    rating: string;
    numReviews: number;
    countInStock: number;
    description: string;
  };
};
function ProductItem(props: PProduct) {
  const { product, addToCartHandler } = props;
  const { slug, image, name, brand, price } = product;
  return (
    <div className="card">
      <Link href={`/product/${slug}`}>
        <img src={image} alt={name} className="w-full rounded shadow" />
      </Link>
      <div className="flex flex-col items-center justify-center p-5">
        <Link href={`/product/${slug}`}>
          <h2 className="text-xl font-regular">{name}</h2>
        </Link>
        <p className="mb-2 text-gray-700">{brand}</p>
        <p className="text-gray-500 mb-2">-- {price}.000 VND --</p>
        <button
          className="primary-button"
          type="button"
          onClick={() => addToCartHandler(product)}
        >
          Add to cart
        </button>
      </div>
    </div>
  );
}

export default ProductItem;
