"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import type { Product } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { createProduct, updateProduct } from "@/lib/actions/product-actions";
import { Loader2, Sparkles } from "lucide-react";
import { useState } from "react";
import { categories } from "@/lib/data";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { generateProductImage } from "@/ai/flows/generate-product-image-flow";
import Image from "next/image";

const productSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Product name must be at least 3 characters." }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters." }),
  price: z.coerce
    .number()
    .positive({ message: "Price must be a positive number." }),
  stock: z.coerce
    .number()
    .int()
    .min(0, { message: "Stock must be a non-negative integer." }),
  category: z.string().min(1, { message: "Please select a category." }),
  imageUrl: z.string(),
});

interface ProductFormDialogProps {
  product?: Product;
  children: React.ReactNode;
  mode: "add" | "edit";
}

export function ProductFormDialog({
  product,
  children,
  mode,
}: ProductFormDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name ?? "",
      description: product?.description ?? "",
      price: product?.price ?? 0,
      stock: product?.stock ?? 0,
      category: product?.category ?? "",
      imageUrl: product?.imageUrl ?? "",
    },
  });

  const { isSubmitting } = form.formState;

  const handleGenerateImage = async () => {
    const name = form.getValues("name");
    const category = form.getValues("category");

    if (!name || !category) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description:
          "Please provide a product name and category to generate an image.",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const result = await generateProductImage({
        productName: name,
        productCategory: category,
      });
      if (result.imageUrl) {
        form.setValue("imageUrl", result.imageUrl, { shouldValidate: true });
        toast({
          title: "Image Generated!",
          description: "A new image has been generated and added to the form.",
        });
      } else {
        throw new Error("No image URL returned.");
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Image Generation Failed",
        description: "Could not generate an image. Please try again.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  async function onSubmit(values: z.infer<typeof productSchema>) {
    try {
      const imageUrl = values.imageUrl || "";

      if (mode === "edit" && product) {
        await updateProduct({ ...product, ...values, imageUrl });
        toast({
          title: "Product Updated",
          description: "The product details have been saved.",
        });
      } else {
        await createProduct({ ...values, imageUrl });
        toast({
          title: "Product Created",
          description: "The new product has been added.",
        });
      }
      setIsOpen(false);
      form.reset();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to ${mode === "edit" ? "update" : "create"} product.`,
      });
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "edit" ? "Edit Product" : "Add New Product"}
          </DialogTitle>
          <DialogDescription>
            {mode === "edit"
              ? "Make changes to your product here."
              : "Fill in the details for the new product."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="max-h-[60vh] overflow-y-auto pr-6 pl-1">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((c) => (
                            <SelectItem key={c.slug} value={c.name}>
                              {c.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="stock"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Stock</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image URL (or generate one)</FormLabel>
                      <div className="flex items-center gap-2">
                        <FormControl>
                          <Input
                            placeholder="https://... or generate one"
                            {...field}
                          />
                        </FormControl>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={handleGenerateImage}
                          disabled={isGenerating || isSubmitting}
                        >
                          {isGenerating ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Sparkles className="h-4 w-4" />
                          )}
                          <span className="sr-only">Generate Image</span>
                        </Button>
                      </div>
                      <FormMessage />
                      {field.value &&
                        (field.value.startsWith("data:image") ||
                          field.value.startsWith("http")) && (
                          <div className="mt-2 relative aspect-video w-full">
                            <Image
                              src={field.value}
                              alt="Image preview"
                              fill
                              className="rounded-md object-cover"
                            />
                          </div>
                        )}
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <DialogFooter className="pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting || isGenerating}>
                {(isSubmitting || isGenerating) && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
