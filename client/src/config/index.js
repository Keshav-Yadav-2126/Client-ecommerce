// config/index.js - Updated for Pachory Organic Nutrition
import { 
  Pill, 
  Apple, 
  Dumbbell, 
  Leaf, 
  Droplets, 
  Droplet,
  Home,
  Search
} from "lucide-react";

export const addProductFormElements = [
  {
    label: "Title",
    name: "title",
    componentType: "input",
    type: "text",
    placeholder: "Enter product title",
  },
  {
    label: "Description",
    name: "description",
    componentType: "textarea",
    placeholder: "Enter product description",
  },
  {
    label: "Category",
    name: "category",
    componentType: "select",
    options: [
      { id: "ghee-oil", label: "Ghee & Oil" },
      { id: "dry-fruits", label: "Dry Fruits" },
      { id: "spices", label: "Spices" },
      { id: "sweets", label: "Sweets" },
      { id: "pulses-flour", label: "Pulses & Flour" },
      { id: "fruits-vegetables", label: "Fruit & Vegetables" },
    ],
  },
  {
    label: "Price",
    name: "price",
    componentType: "input",
    type: "number",
    placeholder: "Enter product price",
  },
  {
    label: "Sale Price",
    name: "salePrice",
    componentType: "input",
    type: "number",
    placeholder: "Enter sale price (optional)",
  },
  {
    label: "Total Stock",
    name: "stock",
    componentType: "input",
    type: "number",
    placeholder: "Enter total stock",
  },
  {
    label: "Size",
    name: "size",
    componentType: "input",
    type: "text",
    placeholder: "e.g., 500ml, 100g, 60 tablets",
  },
];

export const shoppingViewHeaderMenuItems = [
  {
    id: "home",
    label: "Home",
    path: "/shop/home",
    icon: "Home"
  },
  {
    id: "ghee-oil",
    label: "Ghee & Oil",
    path: "/shop/listing",
    icon: "Droplets"
  },
  {
    id: "dry-fruits",
    label: "Dry Fruits",
    path: "/shop/listing",
    icon: "Apple"
  },
  {
    id: "spices",
    label: "Spices",
    path: "/shop/listing",
    icon: "Leaf"
  },
  {
    id: "sweets",
    label: "Sweets",
    path: "/shop/listing",
    icon: "Pill"
  },
  {
    id: "pulses-flour",
    label: "Pulses & Flour",
    path: "/shop/listing",
    icon: "Dumbbell"
  },
  {
    id: "fruits-vegetables",
    label: "Fruit & Vegetables",
    path: "/shop/listing",
    icon: "Droplet"
  },
  {
    id: "search",
    label: "Search",
    path: "/shop/search",
    icon: "Search"
  },
];

export const filterOptions = {
  category: [
    { id: "ghee-oil", label: "Ghee & Oil", icon: "Droplets" },
    { id: "dry-fruits", label: "Dry Fruits", icon: "Apple" },
    { id: "spices", label: "Spices", icon: "Leaf" },
    { id: "sweets", label: "Sweets", icon: "Pill" },
    { id: "pulses-flour", label: "Pulses & Flour", icon: "Dumbbell" },
    { id: "fruits-vegetables", label: "Fruit & Vegetables", icon: "Droplet" },
  ],
};

export const categoryOptionsMap = {
  "ghee-oil": "Ghee & Oil",
  "dry-fruits": "Dry Fruits",
  "spices": "Spices",
  "sweets": "Sweets",
  "pulses-flour": "Pulses & Flour",
  "fruits-vegetables": "Fruit & Vegetables",
};

export const brandOptionsMap = {
  pachory: "Pachory",
  "nature's-way": "Nature's Way",
  "garden-of-life": "Garden of Life",
  himalaya: "Himalaya",
  "organic-india": "Organic India",
  "now-foods": "NOW Foods",
};

export const sortOptions = [
  { id: "price-lowtohigh", label: "Price: Low to High" },
  { id: "price-hightolow", label: "Price: High to Low" },
  { id: "title-atoz", label: "Title: A to Z" },
  { id: "title-ztoa", label: "Title: Z to A" },
];

export const addressFormControls = [
  {
    label: "Address",
    name: "address",
    componentType: "input",
    type: "text",
    placeholder: "Enter your address",
  },
  {
    label: "City",
    name: "city",
    componentType: "input",
    type: "text",
    placeholder: "Enter your city",
  },
  {
    label: "State",
    name: "state",
    componentType: "input",
    type: "text",
    placeholder: "Enter your state",
  },
  {
    label: "Pincode",
    name: "pincode",
    componentType: "input",
    type: "text",
    placeholder: "Enter your pincode",
  },
  {
    label: "Mobile No.",
    name: "mobileNo",
    componentType: "input",
    type: "text",
    placeholder: "Enter your mobile number",
  },
  {
    label: "Notes",
    name: "notes",
    componentType: "textarea",
    placeholder: "Enter any additional notes",
  },
];

// Size options for organic nutrition products
export const sizeOptions = [
  { id: "30ml", label: "30ml" },
  { id: "50ml", label: "50ml" },
  { id: "100ml", label: "100ml" },
  { id: "250ml", label: "250ml" },
  { id: "500ml", label: "500ml" },
  { id: "1000ml", label: "1000ml" },
  { id: "30g", label: "30g" },
  { id: "60g", label: "60g" },
  { id: "100g", label: "100g" },
  { id: "250g", label: "250g" },
  { id: "500g", label: "500g" },
  { id: "30-capsules", label: "30 capsules" },
  { id: "60-capsules", label: "60 capsules" },
  { id: "90-capsules", label: "90 capsules" },
  { id: "120-capsules", label: "120 capsules" },
  { id: "30-tablets", label: "30 tablets" },
  { id: "60-tablets", label: "60 tablets" },
  { id: "90-tablets", label: "90 tablets" },
];

// Common ingredients for organic nutrition products
export const commonIngredients = [
  "Organic Turmeric",
  "Organic Ginger",
  "Vitamin D3",
  "Vitamin B12",
  "Omega-3 Fatty Acids",
  "Probiotics",
  "Ashwagandha",
  "Spirulina",
  "Chlorella",
  "Whey Protein",
  "Plant Protein",
  "Collagen",
  "Magnesium",
  "Zinc",
  "Iron",
  "Calcium",
  "Organic Moringa",
  "Green Tea Extract",
  "Garcinia Cambogia",
  "Organic Coconut Oil",
];

// Common health benefits for organic products
export const commonBenefits = [
  "Boosts Immunity",
  "Supports Digestive Health",
  "Improves Energy Levels",
  "Promotes Heart Health",
  "Supports Brain Function",
  "Anti-inflammatory Properties",
  "Rich in Antioxidants",
  "Supports Weight Management",
  "Improves Sleep Quality",
  "Supports Joint Health",
  "Enhances Skin Health",
  "Supports Muscle Recovery",
  "Promotes Bone Health",
  "Reduces Stress",
  "Supports Liver Function",
  "Improves Mental Clarity",
  "Supports Cardiovascular Health",
  "Natural Detoxification",
  "Supports Hormonal Balance",
  "Improves Metabolism",
];