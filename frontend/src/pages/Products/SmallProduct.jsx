import { Link } from "react-router-dom";
import HeartIcon from "./HeartIcon";

const SmallProduct = ({ product }) => {
  return (
    <div className="border p-4 m-2 rounded shadow-lg w-[200px] relative">
      <HeartIcon product={product} />

      <Link to={`/product/${product._id}`}>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-32 object-cover"
        />
        <h4 className="mt-2 font-bold">{product.name}</h4>
      </Link>
    </div>
  );
};

export default SmallProduct
