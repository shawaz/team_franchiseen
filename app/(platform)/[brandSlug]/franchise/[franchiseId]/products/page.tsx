import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import Table from "@/components/ui/table/Table";
import TableHead from "@/components/ui/table/TableHead";
import TableBody from "@/components/ui/table/TableBody";
import TableRow from "@/components/ui/table/TableRow";
import TableCell from "@/components/ui/table/TableCell";
import TableHeaderCell from "@/components/ui/table/TableHeaderCell";
import FranchiseHeader from "@/components/franchise/FranchiseHeader";

const mockProducts = [
  {
    id: "1",
    name: "White Adidas Top",
    image: "/products/product-1.jpg",
    status: "Active",
    inventory: 5,
    category: "Shoe",
    price: 49,
    color: "bg-yellow-100",
  },
  {
    id: "2",
    name: "Red Converse shoe",
    image: "/products/product-2.jpg",
    status: "Draft",
    inventory: 5,
    category: "Shoe",
    price: 139,
    color: "bg-lime-300",
  },
  {
    id: "3",
    name: "Unpaired maroon plimsoll",
    image: "/products/product-3.jpg",
    status: "Active",
    inventory: 5,
    category: "Shoe",
    price: 39,
    color: "bg-sky-300",
  },
  {
    id: "4",
    name: "Nike SuperRep Go",
    image: "/products/product-4.jpg",
    status: "Archived",
    inventory: 5,
    category: "Shoe",
    price: 69,
    color: "bg-yellow-300",
  },
  {
    id: "5",
    name: "Unpaired maroon plimsoll",
    image: "/products/product-5.jpg",
    status: "Active",
    inventory: 5,
    category: "Shoe",
    price: 49,
    color: "bg-pink-300",
  },
  {
    id: "6",
    name: "Nike Legend Essential 2",
    image: "/products/product-6.jpg",
    status: "Active",
    inventory: 5,
    category: "Shoe",
    price: 30,
    color: "bg-sky-200",
  },
];

const statusColors: Record<string, string> = {
  Active: "text-green-600 bg-green-100",
  Draft: "text-yellow-700 bg-yellow-100",
  Archived: "text-blue-700 bg-blue-100",
};

function FranchiseProducts() {
  return (
    <div>
      <FranchiseHeader />
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-4">
          <Button variant="outline" className="font-semibold">
            All
          </Button>
          <Button variant="ghost">Active</Button>
          <Button variant="ghost">Draft</Button>
          <Button variant="ghost">Archived</Button>
        </div>
        <input
          type="text"
          placeholder="Filter Products"
          className="border rounded-md px-3 py-2 w-64 focus:outline-none focus:ring"
        />
      </div>
      <div className="overflow-x-auto rounded-xl border bg-white dark:bg-stone-800">
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell>
                <input type="checkbox" />
              </TableHeaderCell>
              <TableHeaderCell>Products</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
              <TableHeaderCell>Inventory</TableHeaderCell>
              <TableHeaderCell>Category</TableHeaderCell>
              <TableHeaderCell>Price</TableHeaderCell>
              <TableHeaderCell className=""></TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mockProducts.map((product) => (
              <TableRow
                key={product.id}
                className="hover:bg-gray-50 dark:hover:bg-stone-700 transition"
              >
                <TableCell className="px-4 py-3">
                  <input type="checkbox" />
                </TableCell>
                <TableCell className="flex items-center gap-4 px-4 py-3">
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={56}
                    height={56}
                    className="object-contain rounded-md"
                  />
                  <span className="font-semibold text-black dark:text-white">
                    {product.name}
                  </span>
                </TableCell>
                <TableCell className="px-4 py-3">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusColors[product.status]}`}
                  >
                    {product.status}
                  </span>
                </TableCell>
                <TableCell className="px-4 py-3 font-medium">
                  {product.inventory}
                </TableCell>
                <TableCell className="px-4 py-3">{product.category}</TableCell>
                <TableCell className="px-4 py-3 font-semibold">
                  ${product.price.toFixed(2)}
                </TableCell>
                <TableCell className="px-4 py-3 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <span className="sr-only">Open menu</span>
                        <svg
                          width="20"
                          height="20"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle cx="12" cy="5" r="1.5" fill="currentColor" />
                          <circle cx="12" cy="12" r="1.5" fill="currentColor" />
                          <circle cx="12" cy="19" r="1.5" fill="currentColor" />
                        </svg>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>Archive</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default FranchiseProducts;
