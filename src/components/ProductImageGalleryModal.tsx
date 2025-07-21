import React from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";

interface ProductImageGalleryModalProps {
  images: string[];
  open: boolean;
  initialIndex?: number;
  onOpenChange: (open: boolean) => void;
}

export const ProductImageGalleryModal: React.FC<ProductImageGalleryModalProps> = ({
  images,
  open,
  initialIndex = 0,
  onOpenChange,
}) => {
  const [current, setCurrent] = React.useState(initialIndex);
  const carouselRef = React.useRef<any>(null);

  React.useEffect(() => {
    if (open && carouselRef.current && carouselRef.current.scrollTo) {
      carouselRef.current.scrollTo(initialIndex);
    }
    setCurrent(initialIndex);
  }, [open, initialIndex]);

  if (!images || images.length === 0) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl w-full p-0 bg-background">
        <div className="relative">
          <Carousel
            opts={{ loop: true, startIndex: current }}
            setApi={(api) => {
              carouselRef.current = api;
              api?.on("select", () => setCurrent(api.selectedScrollSnap()));
            }}
          >
            <CarouselContent>
              {images.map((img, idx) => (
                <CarouselItem key={img + idx}>
                  <AspectRatio ratio={1} className="bg-black flex items-center justify-center">
                    <img
                      src={img}
                      alt={`Product image ${idx + 1}`}
                      className="max-h-[70vh] w-auto mx-auto object-contain rounded shadow-lg"
                    />
                  </AspectRatio>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-between items-center px-4 py-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => carouselRef.current?.scrollPrev()}
                aria-label="Previous image"
              >
                &#8592;
              </Button>
              <span className="text-sm text-muted-foreground">
                {current + 1} / {images.length}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => carouselRef.current?.scrollNext()}
                aria-label="Next image"
              >
                &#8594;
              </Button>
            </div>
          </Carousel>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 