import { useState, type ComponentProps } from 'react'

import { cn } from '@/libs/cn'
import { AspectRatio } from '@/components/ui/aspect-ratio'

type ImageGalleryImage = {
  src: string
  alt: string
}

type ImageGalleryProps = Omit<ComponentProps<'div'>, 'onChange'> & {
  images: ImageGalleryImage[]
  selectedIndex?: number
  onChange?: (index: number) => void
  aspectRatio?: number
  thumbnailAspectRatio?: number
  maxThumbnails?: number
}

function ImageGallery({
  images,
  selectedIndex: controlledIndex,
  onChange,
  aspectRatio = 4 / 3,
  thumbnailAspectRatio = 1,
  maxThumbnails = 5,
  className,
  ...props
}: ImageGalleryProps) {
  const [internalIndex, setInternalIndex] = useState(0)

  const isControlled = controlledIndex !== undefined
  const selectedIndex = isControlled ? controlledIndex : internalIndex

  const handleSelect = (index: number) => {
    if (!isControlled) {
      setInternalIndex(index)
    }
    onChange?.(index)
  }

  const selectedImage = images[selectedIndex]
  const visibleThumbnails = images.slice(0, maxThumbnails)

  if (images.length === 0) {
    return null
  }

  return (
    <div
      data-slot="image-gallery"
      className={cn('flex flex-col gap-3', className)}
      {...props}
    >
      {/* Main image */}
      <div className="overflow-hidden rounded-lg bg-muted">
        <AspectRatio ratio={aspectRatio}>
          {selectedImage && (
            <img
              src={selectedImage.src}
              alt={selectedImage.alt}
              className="size-full object-cover"
            />
          )}
        </AspectRatio>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2">
          {visibleThumbnails.map((image, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleSelect(index)}
              className={cn(
                'relative flex-1 overflow-hidden rounded-md transition-all',
                'ring-2 ring-offset-2 ring-offset-background',
                index === selectedIndex
                  ? 'ring-primary'
                  : 'ring-transparent hover:ring-muted-foreground/30',
              )}
              aria-label={`View image ${index + 1}`}
              aria-current={index === selectedIndex ? 'true' : undefined}
            >
              <AspectRatio ratio={thumbnailAspectRatio}>
                <img
                  src={image.src}
                  alt={image.alt}
                  className="size-full object-cover"
                />
              </AspectRatio>
            </button>
          ))}

          {/* More indicator */}
          {images.length > maxThumbnails && (
            <div className="flex flex-1 items-center justify-center rounded-md bg-muted text-caption text-muted-foreground">
              +{images.length - maxThumbnails}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// Lightbox variant for full-screen viewing
type ImageLightboxProps = ComponentProps<'div'> & {
  images: ImageGalleryImage[]
  selectedIndex: number
  onClose: () => void
  onChange?: (index: number) => void
}

function ImageLightbox({
  images,
  selectedIndex,
  onClose,
  onChange,
  className,
  ...props
}: ImageLightboxProps) {
  const handlePrevious = () => {
    const newIndex = selectedIndex === 0 ? images.length - 1 : selectedIndex - 1
    onChange?.(newIndex)
  }

  const handleNext = () => {
    const newIndex = selectedIndex === images.length - 1 ? 0 : selectedIndex + 1
    onChange?.(newIndex)
  }

  const selectedImage = images[selectedIndex]

  return (
    <div
      data-slot="image-lightbox"
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center bg-black/90',
        className,
      )}
      onClick={onClose}
      {...props}
    >
      {/* Close button */}
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 p-2 text-white/70 hover:text-white transition-colors"
        aria-label="Close lightbox"
      >
        <svg className="size-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>

      {/* Previous button */}
      {images.length > 1 && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            handlePrevious()
          }}
          className="absolute left-4 p-2 text-white/70 hover:text-white transition-colors"
          aria-label="Previous image"
        >
          <svg className="size-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
      )}

      {/* Image */}
      <div
        className="max-w-4xl max-h-[80vh] px-16"
        onClick={(e) => e.stopPropagation()}
      >
        {selectedImage && (
          <img
            src={selectedImage.src}
            alt={selectedImage.alt}
            className="max-w-full max-h-[80vh] object-contain"
          />
        )}
      </div>

      {/* Next button */}
      {images.length > 1 && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            handleNext()
          }}
          className="absolute right-4 p-2 text-white/70 hover:text-white transition-colors"
          aria-label="Next image"
        >
          <svg className="size-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      )}

      {/* Counter */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-sm">
          {selectedIndex + 1} / {images.length}
        </div>
      )}
    </div>
  )
}

export { ImageGallery, ImageLightbox }
export type { ImageGalleryImage }
