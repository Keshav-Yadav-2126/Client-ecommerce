import React from "react";
import { filterOptions } from "../../config/index.js";
import { Label } from "../ui/label.jsx";
import { Checkbox } from "../ui/checkbox.jsx";
import { Separator } from "../ui/separator.jsx";
import { Filter } from "lucide-react";

const ProductFilter = ({ filters, handleFilter }) => {
  console.log("🔍 Filters in sidebar:", filters);

  const handleCheckedChange = (categoryKey, optionId, checked) => {
    handleFilter(categoryKey, optionId, checked);
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-yellow-200">
      <div className="p-6 border-b border-yellow-200">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-yellow-600" />
          <h2 className="text-xl font-bold text-gray-800">Filters</h2>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {Object.keys(filterOptions).map((keyItem, index) => (
          <div key={keyItem}>
            <div className="mb-4">
              <h3 className="text-base font-bold text-gray-800 mb-3 capitalize">
                {keyItem}
              </h3>
              <div className="grid gap-3">
                {filterOptions[keyItem].map((option) => (
                  <Label
                    key={option.id}
                    className="flex items-center gap-3 font-medium text-gray-700 cursor-pointer hover:text-yellow-700 transition-colors p-2 rounded-lg hover:bg-yellow-50"
                  >
                    <Checkbox
                      checked={filters[keyItem]?.includes(option.id) || false}
                      onCheckedChange={(checked) =>
                        handleCheckedChange(keyItem, option.id, checked)
                      }
                      className="border-yellow-300 data-[state=checked]:bg-yellow-500 data-[state=checked]:border-yellow-500"
                    />
                    <span className="text-sm">{option.label}</span>
                  </Label>
                ))}
              </div>
            </div>

            {index < Object.keys(filterOptions).length - 1 && (
              <Separator className="bg-yellow-200" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductFilter;
