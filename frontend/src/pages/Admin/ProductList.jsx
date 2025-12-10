import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useCreateProductMutation,
  useUploadProductImageMutation,
} from "../../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";
import { toast } from "react-toastify";
import AdminMenu from "./AdminMenu";

const ProductList = () => {
  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [brand, setBrand] = useState("");
  const [stock, setStock] = useState(0);
  const [imageUrl, setImageUrl] = useState(null);
  const navigate = useNavigate();

  const [uploadProductImage] = useUploadProductImageMutation();
  const [createProduct] = useCreateProductMutation();
  const { data: categories } = useFetchCategoriesQuery();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const productData = new FormData();
      productData.append("image", image);
      productData.append("name", name);
      productData.append("description", description);
      productData.append("price", price);
      productData.append("category", category);
      productData.append("quantity", quantity);
      productData.append("brand", brand);
      productData.append("countInStock", stock);

      const res = await createProduct(productData).unwrap();

    toast.success(`${res.name} created successfully!`);
    navigate("/");
    } catch (error) {
       console.error("Product creation failed:", error);
    toast.error(error?.data?.message || "Product creation failed. Try again.");
    }
  };

  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append("image", e.target.files[0]);

    try {
      const res = await uploadProductImage(formData).unwrap();
      toast.success(res.message);
      setImage(res.image);
      setImageUrl(res.image);
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  return (
    <div className="container mx-auto max-w-7xl px-10 ">
  <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
    <AdminMenu />
    <div className="lg:col-span-3 bg-[#1A1B1E] p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-white ">Create Product</h2>

      {imageUrl && (
        <div className="mb-6 text-center">
          <img
            src={imageUrl}
            alt="product preview"
            className="w-auto h-[150px] mx-auto rounded-lg shadow-sm"
          />
        </div>
      )}

      <div className="mb-6">
        <label className="block bg-pink-500 text-white text-center font-medium py-3 rounded-lg cursor-pointer">
          {image ? "New Image" : "Upload Image"}
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={uploadFileHandler}
            className="hidden"
          />
        </label>
      </div>

      <form className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-400 mb-2"
            >
              Product Name
            </label>
            <input
              type="text"
              id="name"
              className="w-full p-4 bg-[#2A2B2F] border border-gray-700 rounded-lg text-white"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter product name"
            />
          </div>
          <div>
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-400 mb-2"
            >
              Price
            </label>
            <input
              type="number"
              id="price"
              className="w-full p-4 bg-[#2A2B2F] border border-gray-700 rounded-lg text-white"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Enter product price"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="quantity"
              className="block text-sm font-medium text-gray-400 mb-2"
            >
              Quantity
            </label>
            <input
              type="number"
              id="quantity"
              className="w-full p-4 bg-[#2A2B2F] border border-gray-700 rounded-lg text-white"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Enter quantity"
            />
          </div>
          <div>
            <label
              htmlFor="brand"
              className="block text-sm font-medium text-gray-400 mb-2"
            >
              Brand
            </label>
            <input
              type="text"
              id="brand"
              className="w-full p-4 bg-[#2A2B2F] border border-gray-700 rounded-lg text-white"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              placeholder="Enter brand"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-400 mb-2"
          >
            Description
          </label>
          <textarea
            id="description"
            className="w-full p-4 bg-[#2A2B2F] border border-gray-700 rounded-lg text-white"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="4"
            placeholder="Write product description"
          ></textarea>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="stock"
              className="block text-sm font-medium text-gray-400 mb-2"
            >
              Count In Stock
            </label>
            <input
              type="text"
              id="stock"
              className="w-full p-4 bg-[#2A2B2F] border border-gray-700 rounded-lg text-white"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              placeholder="Enter stock count"
            />
          </div>
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-400 mb-2"
            >
              Category
            </label>
            <select
              id="category"
              className="w-full p-4 bg-[#2A2B2F] border border-gray-700 rounded-lg text-white"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="" disabled>
                Choose Category
              </option>
              {categories?.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          className="block w-full py-4 bg-pink-500 text-white text-lg font-medium rounded-lg hover:bg-pink-600 transition"
        >
          Submit Product
        </button>
      </form>
    </div>
  </div>
</div>

  );
};

export default ProductList;
