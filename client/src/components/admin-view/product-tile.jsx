//product-tile.jsx
import React from "react";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Edit, Trash2, Package } from "lucide-react";

const AdminProductTile = ({
  setFormData,
  setOpenCreateProductDialog,
  setCurrentEditedId,
  product,
  handleDelete
}) => {
  return (
    <Card className="w-full min-w-[280px] overflow-hidden bg-white/80 backdrop-blur-sm border-green-100 hover:shadow-lg transition-all duration-300 hover:border-green-200 group">
      <div className="relative overflow-hidden">
        <img
          className="w-full h-48 sm:h-56 lg:h-64 object-cover transition-transform duration-300 group-hover:scale-105"
          src={product.image || "/api/placeholder/300/300"}
          alt={product.title}
          onError={(e) => {
            e.target.src = "/api/placeholder/300/300";
          }}
        />
        <div className="absolute top-3 left-3">
          <Badge 
            variant="secondary" 
            className="bg-green-100 text-green-800 border-green-200"
          >
            {product.category}
          </Badge>
        </div>
        {product.salePrice > 0 && (
          <div className="absolute top-3 right-3">
            <Badge 
              variant="destructive" 
              className="bg-red-100 text-red-800 border-red-200"
            >
              Sale
            </Badge>
          </div>
        )}
      </div>
      
      <CardContent className="p-4">
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-lg text-primary line-clamp-1">
              {product.title}
            </h3>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {product.description}
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {product.size || "N/A"}
              </span>
            </div>
            <div className="text-sm text-muted-foreground">
              Stock: {product.stock}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {product.salePrice > 0 ? (
                <>
                  <span className="text-lg font-bold text-primary">
                    ${product.salePrice}
                  </span>
                  <span className="text-sm text-muted-foreground line-through">
                    ${product.price}
                  </span>
                </>
              ) : (
                <span className="text-lg font-bold text-primary">
                  ${product.price}
                </span>
              )}
            </div>
            {/* Brand badge removed as per new requirements */}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 space-y-2">
        <div className="flex gap-2 w-full">
          <Button 
            variant="outline"
            size="sm"
            onClick={() => {
              setOpenCreateProductDialog(true);
              setCurrentEditedId(product?._id);
              setFormData(product);
            }}
            className="flex-1 border-green-300 text-green-700 hover:bg-green-50 hover:border-green-400"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button 
            variant="outline"
            size="sm"
            onClick={() => handleDelete(product?._id)}
            className="flex-1 border-red-300 text-red-700 hover:bg-red-50 hover:border-red-400"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default AdminProductTile;