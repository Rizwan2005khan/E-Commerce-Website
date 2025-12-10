import AdminMenu from "./AdminMenu";
import { useNavigate, useParams } from "react-router-dom";
import {
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetProductByIdQuery,
  useUploadProductImageMutation,
} from "../../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";

const ProductUpdate = () => {
  const params = useParams();

  const { data: productData } = useGetProductByIdQuery(params._id);

  console.log(productData);

  const [image, setImage] = useState(productData?.image || "");
  const [name, setName] = useState(productData?.name || "");
  const [description, setDescription] = useState(
    productData?.description || ""
  );
  const [price, setPrice] = useState(productData?.price || "");
  const [category, setCategory] = useState(productData?.category || "");
  const [quantity, setQuantity] = useState(productData?.quantity || "");
  const [brand, setBrand] = useState(productData?.brand || "");
  const [stock, setStock] = useState(productData?.countInStock || 0);

  // hook
  const navigate = useNavigate();

  // Fetch categories using RTK Query
  const { data: categories = [] } = useFetchCategoriesQuery();

  const [uploadProductImage] = useUploadProductImageMutation();

  // Define the update product mutation
  const [updateProduct] = useUpdateProductMutation();

  // Define the delete product mutation
  const [deleteProduct] = useDeleteProductMutation();

  useEffect(() => {
    if (productData && productData._id) {
      setName(productData.name);
      setDescription(productData.description);
      setPrice(productData.price);
      setCategory(productData.category?._id);
      setQuantity(productData.quantity);
      setBrand(productData.brand);
      setImage(productData.image);
    }
  }, [productData]);

  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append("image", e.target.files[0]);
    try {
      const res = await uploadProductImage(formData).unwrap();
      toast.success("Item added successfully");
      setImage(res.image);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("quantity", quantity);
      formData.append("brand", brand);
      formData.append("countInStock", stock);

      // Call the mutation
      const response = await updateProduct({
        productId: params._id, // Provide the productId here
        formData,
      }).unwrap();

      // Handle success
      toast.success(`Product "${response.name}" updated successfully`);
      navigate("/admin/allproductslist");
    } catch (err) {
      // Handle error
      console.error("Update failed:", err);
      toast.error("Product update failed. Try again.");
    }
  };

  const handleDelete = async () => {
    try {
      let answer = window.confirm(
        "Are you sure you want to delete this product?"
      );
      if (!answer) return;

      const { data } = await deleteProduct(params._id);
      toast.success(`"${data.name}" is deleted`);
      navigate("/admin/allproductslist");
    } catch (err) {
      console.log(err);
      toast.error("Delete failed. Try again.");
    }
  };
  return (
    <>
      <div className="container mx-auto py-10 px-4">
        <div className="flex flex-col md:flex-row">
          <AdminMenu />
          <div className="flex-1 bg-gray-800 p-6 rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold text-center mb-6 text-white">
              Update / Delete Product
            </h1>
            {image && (
              <div className="mb-6 text-center">
                <img
                  src={image}
                  alt="product"
                  className="w-full max-h-64 object-contain rounded-lg"
                />
              </div>
            )}
            <div className="mb-6">
              <label className="block text-white font-medium mb-2">
                Upload Image
              </label>
              <input
                type="file"
                onChange={uploadFileHandler}
                className="block w-full p-2 border rounded-lg bg-gray-700 text-white focus:ring focus:ring-indigo-500"
              />
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white font-medium mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2 border rounded-lg bg-gray-700 text-white focus:ring focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-white font-medium mb-2">
                    Price
                  </label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full p-2 border rounded-lg bg-gray-700 text-white focus:ring focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-white font-medium mb-2">
                    Quantity
                  </label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full p-2 border rounded-lg bg-gray-700 text-white focus:ring focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-white font-medium mb-2">
                    Brand
                  </label>
                  <input
                    type="text"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full p-2 border rounded-lg bg-gray-700 text-white focus:ring focus:ring-indigo-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-white font-medium mb-2">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2 border rounded-lg bg-gray-700 text-white focus:ring focus:ring-indigo-500"
                ></textarea>
              </div>
              <div>
                <label className="block text-white font-medium mb-2">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-2 border rounded-lg bg-gray-700 text-white focus:ring focus:ring-indigo-500"
                >
                  <option value="">Select Category</option>
                  {categories?.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-between">
                <button
                  type="submit"
                  className="py-2 px-6 bg-green-600 text-white font-bold rounded-lg shadow-md hover:bg-green-700"
                >
                  Update
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="py-2 px-6 bg-red-600 text-white font-bold rounded-lg shadow-md hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductUpdate;
