import { useState } from "react";
import { X, ShoppingBag, Briefcase, Download, ShoppingCart, Info } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { storeProducts, storeCategories, comingSoonMessage, StoreProduct } from "@/data/mobiStoreData";
import { useToast } from "@/hooks/use-toast";

interface MobiStoreDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MobiStoreDialog({ open, onOpenChange }: MobiStoreDialogProps) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [cartItems, setCartItems] = useState<string[]>([]);
  const { toast } = useToast();

  const handleAddToCart = (productId: string) => {
    if (!cartItems.includes(productId)) {
      setCartItems([...cartItems, productId]);
      toast({
        title: "Added to Cart",
        description: "Item has been added to your shopping cart",
      });
    }
  };

  const filteredProducts = selectedCategory === "all" 
    ? storeProducts 
    : storeProducts.filter(p => p.category === selectedCategory);

  const getCategoryIcon = (category: string) => {
    switch(category) {
      case "merchandise": return ShoppingBag;
      case "services": return Briefcase;
      case "digital": return Download;
      default: return ShoppingBag;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <DialogHeader className="p-4 sm:p-6 pb-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl sm:text-2xl font-bold">Mobi-Store</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <ScrollArea className="h-full max-h-[calc(90vh-8rem)]">
          <div className="p-4 sm:p-6 space-y-6">
            {/* Coming Soon Banner */}
            <Card className="border-primary/50 bg-primary/5">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div className="space-y-2">
                    <h3 className="font-semibold text-base sm:text-lg">{comingSoonMessage.title}</h3>
                    <p className="text-sm text-muted-foreground">{comingSoonMessage.description}</p>
                    <ul className="text-xs sm:text-sm text-muted-foreground space-y-1 mt-3">
                      {comingSoonMessage.benefits.map((benefit, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-primary">•</span>
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Cart Preview */}
            {cartItems.length > 0 && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ShoppingCart className="h-4 w-4" />
                      <span className="text-sm font-medium">{cartItems.length} item(s) in cart</span>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => setCartItems([])}>
                      Clear Cart
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Category Tabs */}
            <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
              <TabsList className="w-full grid grid-cols-4 h-auto">
                <TabsTrigger value="all" className="text-xs sm:text-sm py-2">
                  All
                </TabsTrigger>
                {storeCategories.map((cat) => {
                  const Icon = getCategoryIcon(cat.id);
                  return (
                    <TabsTrigger 
                      key={cat.id} 
                      value={cat.id}
                      className="text-xs sm:text-sm py-2 gap-1"
                    >
                      <Icon className="h-3 w-3" />
                      <span className="hidden sm:inline">{cat.name.split(' ')[0]}</span>
                      <span className="sm:hidden">{cat.name.split(' ')[0].slice(0, 4)}</span>
                    </TabsTrigger>
                  );
                })}
              </TabsList>

              <TabsContent value={selectedCategory} className="mt-4 space-y-4">
                {/* Products Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filteredProducts.map((product) => (
                    <ProductCard 
                      key={product.id} 
                      product={product}
                      isInCart={cartItems.includes(product.id)}
                      onAddToCart={handleAddToCart}
                    />
                  ))}
                </div>

                {filteredProducts.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No products found in this category
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

function ProductCard({ 
  product, 
  isInCart, 
  onAddToCart 
}: { 
  product: StoreProduct; 
  isInCart: boolean;
  onAddToCart: (id: string) => void;
}) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-0">
        <div className="aspect-video bg-muted relative">
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-full object-cover"
          />
          {product.featured && (
            <Badge className="absolute top-2 right-2 bg-primary">Featured</Badge>
          )}
        </div>
        
        <div className="p-4 space-y-3">
          <div>
            <h4 className="font-semibold text-sm sm:text-base line-clamp-1">{product.name}</h4>
            <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 mt-1">
              {product.description}
            </p>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-lg font-bold text-primary">
                {product.currency} {product.price.toLocaleString()}
              </p>
              {!product.inStock && (
                <Badge variant="destructive" className="text-xs">Out of Stock</Badge>
              )}
            </div>
            
            <Button 
              size="sm"
              disabled={!product.inStock || isInCart}
              onClick={() => onAddToCart(product.id)}
              className="text-xs"
            >
              {isInCart ? "In Cart" : "Add to Cart"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
