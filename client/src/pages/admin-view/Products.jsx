import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import React, { useEffect, useState } from "react";
import ProductImageUpload from "@/components/admin-view/image-upload";
import useAdminStore from "@/store/admin/product-store";
import { toast } from "sonner";
import AdminProductTile from "@/components/admin-view/product-tile";
import { Badge } from "@/components/ui/badge";

const initialFormData = {
  image: null,
  title: "",
  description: "",
  category: "",
  price: "",
  salePrice: "",
  stock: "",
  size: "",
  ingredients: [],
  keyBenefits: [],
};

const AdminProducts = () => {
  const [openCreateProductDialog, setOpenCreateProductDialog] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const [currentIngredient, setCurrentIngredient] = useState("");
  const [currentBenefit, setCurrentBenefit] = useState("");

  const {
    addNewProduct,
    fetchAllProduct,
    editProduct,
    deleteProduct,
    productList,
  } = useAdminStore();

  const [currentEditedId, setCurrentEditedId] = useState(null);

  const addIngredient = () => {
    if (currentIngredient.trim()) {
      setFormData({
        ...formData,
        ingredients: [...formData.ingredients, currentIngredient.trim()]
      });
      setCurrentIngredient("");
    }
  };

  const removeIngredient = (index) => {
    setFormData({
      ...formData,
      ingredients: formData.ingredients.filter((_, i) => i !== index)
    });
  };

  const addBenefit = () => {
    if (currentBenefit.trim()) {
      setFormData({
        ...formData,
        keyBenefits: [...formData.keyBenefits, currentBenefit.trim()]
      });
      setCurrentBenefit("");
    }
  };

  const removeBenefit = (index) => {
    setFormData({
      ...formData,
      keyBenefits: formData.keyBenefits.filter((_, i) => i !== index)
    });
  };

  async function onSubmit(event) {
    event.preventDefault();
    let data;
    if (currentEditedId !== null) {
      data = await editProduct({ id: currentEditedId, formData });
    } else {
      data = await addNewProduct({ ...formData, image: uploadedImageUrl });
    }
    if (data?.success) {
      setOpenCreateProductDialog(false);
      setImageFile(null);
      setFormData(initialFormData);
      fetchAllProduct();
      setCurrentEditedId(null);
      toast(data.message, {
        duration: 2000,
        icon: "✔",
      });
    }
  }

  async function handleDelete(id) {
    await deleteProduct({id});
    fetchAllProduct();
  }

  function isFormValid() {
    return Object.keys(formData)
      .filter(key => key !== 'ingredients' && key !== 'keyBenefits')
      .map(key => formData[key] !== "")
      .every(item => item);
  }

  useEffect(() => {
    fetchAllProduct();
  }, [fetchAllProduct]);

  return (
    <div className="bg-gradient-to-br from-green-50 via-blue-50 to-yellow-50 min-h-screen">
      <div className="p-4 md:p-6 lg:p-8">
        {/* Header Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-green-100 p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-primary bg-gradient-to-r from-green-700 to-green-600 bg-clip-text text-transparent">
                Organic Products
              </h1>
              <p className="text-muted-foreground mt-1">Manage your organic nutrition products</p>
            </div>
            <Button 
              onClick={() => setOpenCreateProductDialog(true)}
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg"
            >
              Add New Product
            </Button>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {productList && productList.length > 0
            ? productList.map((productItem) => (
                <AdminProductTile
                  key={productItem._id}
                  setFormData={setFormData}
                  setOpenCreateProductDialog={setOpenCreateProductDialog}
                  setCurrentEditedId={setCurrentEditedId}
                  product={productItem}
                  handleDelete={handleDelete}
                />
              ))
            : (
                <div className="col-span-full text-center py-12">
                  <div className="text-muted-foreground">
                    <p className="text-lg mb-2">No products found</p>
                    <p className="text-sm">Start by adding your first organic product</p>
                  </div>
                </div>
              )}
        </div>

        {/* Product Form Sheet */}
        <Sheet
          open={openCreateProductDialog}
          onOpenChange={() => {
            setOpenCreateProductDialog(false);
            setCurrentEditedId(null);
            setFormData(initialFormData);
            setCurrentIngredient("");
            setCurrentBenefit("");
          }}
        >
          <SheetContent side="right" className="w-full sm:w-[540px] overflow-auto px-4">
            <SheetHeader className="border-b border-green-100 pb-4">
              <SheetTitle className="text-primary text-xl font-bold">
                {currentEditedId !== null ? "Edit Product" : "Add New Product"}
              </SheetTitle>
            </SheetHeader>
            
            <div className="py-6">
              <form onSubmit={onSubmit} className="space-y-6">
                {/* Image Upload */}
                <div>
                  <ProductImageUpload
                    file={imageFile}
                    setImageFile={setImageFile}
                    uploadedImageUrl={uploadedImageUrl}
                    setUploadedImageUrl={setUploadedImageUrl}
                    setImageLoadingState={setImageLoadingState}
                    imageLoadingState={imageLoadingState}
                    isEditMode={currentEditedId !== null}
                  />
                </div>

                {/* Basic Information */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title" className="text-sm font-medium text-foreground">Title</Label>
                    <Input
                      className="mt-2 bg-white/50 border-green-200 focus:border-green-400"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="description" className="text-sm font-medium text-foreground">Description</Label>
                    <Textarea
                      className="mt-2 bg-white/50 border-green-200 focus:border-green-400 min-h-[100px]"
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="category" className="text-sm font-medium text-foreground">Category</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) =>
                        setFormData({ ...formData, category: value })
                      }
                    >
                      <SelectTrigger className="mt-2 bg-white/50 border-green-200">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ghee oil">Ghee Oil</SelectItem>
                        <SelectItem value="dry fruits">Dry Fruits</SelectItem>
                        <SelectItem value="spices">Spices</SelectItem>
                        <SelectItem value="sweets">Sweets</SelectItem>
                        <SelectItem value="pulses and flour">Pulses and Flour</SelectItem>
                        <SelectItem value="fruit and vegetables">Fruit and Vegetables</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="price" className="text-sm font-medium text-foreground">Price (₹)</Label>
                      <Input
                        className="mt-2 bg-white/50 border-green-200 focus:border-green-400"
                        id="price"
                        name="price"
                        type="number"
                        value={formData.price}
                        onChange={(e) =>
                          setFormData({ ...formData, price: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="salePrice" className="text-sm font-medium text-foreground">Sale Price (₹)</Label>
                      <Input
                        className="mt-2 bg-white/50 border-green-200 focus:border-green-400"
                        id="salePrice"
                        name="salePrice"
                        type="number"
                        value={formData.salePrice}
                        onChange={(e) =>
                          setFormData({ ...formData, salePrice: e.target.value })
                        }
                      />
                    </div>

                    <div>
                      <Label htmlFor="stock" className="text-sm font-medium text-foreground">Stock</Label>
                      <Input
                        className="mt-2 bg-white/50 border-green-200 focus:border-green-400"
                        id="stock"
                        name="stock"
                        type="number"
                        value={formData.stock}
                        onChange={(e) =>
                          setFormData({ ...formData, stock: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="size" className="text-sm font-medium text-foreground">Size (ml/g/tablets)</Label>
                    <Input
                      className="mt-2 bg-white/50 border-green-200 focus:border-green-400"
                      id="size"
                      name="size"
                      value={formData.size}
                      onChange={(e) =>
                        setFormData({ ...formData, size: e.target.value })
                      }
                      placeholder="e.g., 500ml, 100g, 60 tablets"
                      required
                    />
                  </div>

                  {/* Ingredients Section */}
                  <div>
                    <Label className="text-sm font-medium text-foreground">Ingredients</Label>
                    <div className="flex gap-2 mt-2">
                      <Input
                        className="bg-white/50 border-green-200 focus:border-green-400"
                        value={currentIngredient}
                        onChange={(e) => setCurrentIngredient(e.target.value)}
                        placeholder="Add ingredient"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addIngredient())}
                      />
                      <Button 
                        type="button" 
                        onClick={addIngredient}
                        variant="outline"
                        className="border-green-300 text-green-700 hover:bg-green-50"
                      >
                        Add
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {formData.ingredients.map((ingredient, index) => (
                        <Badge 
                          key={index} 
                          variant="secondary"
                          className="bg-green-100 text-green-800 hover:bg-green-200"
                        >
                          {ingredient}
                          <button
                            type="button"
                            onClick={() => removeIngredient(index)}
                            className="ml-2 hover:text-red-600"
                          >
                            ×
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Benefits Section */}
                  <div>
                    <Label className="text-sm font-medium text-foreground">Key Benefits</Label>
                    <div className="flex gap-2 mt-2">
                      <Input
                        className="bg-white/50 border-green-200 focus:border-green-400"
                        value={currentBenefit}
                        onChange={(e) => setCurrentBenefit(e.target.value)}
                        placeholder="Add benefit"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addBenefit())}
                      />
                      <Button 
                        type="button" 
                        onClick={addBenefit}
                        variant="outline"
                        className="border-green-300 text-green-700 hover:bg-green-50"
                      >
                        Add
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {formData.keyBenefits.map((benefit, index) => (
                        <Badge 
                          key={index} 
                          variant="secondary"
                          className="bg-blue-100 text-blue-800 hover:bg-blue-200"
                        >
                          {benefit}
                          <button
                            type="button"
                            onClick={() => removeBenefit(index)}
                            className="ml-2 hover:text-red-600"
                          >
                            ×
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <Button 
                  disabled={!isFormValid()} 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg"
                >
                  {currentEditedId !== null ? "Update Product" : "Add Product"}
                </Button>
              </form>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default AdminProducts;