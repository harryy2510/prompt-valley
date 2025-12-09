import { cn } from '@/libs/cn'
import { Image } from '@/components/common/image'
import { AspectRatio } from '@/components/ui/aspect-ratio'

export type ImageGridProps = {
  title?: string
  className?: string
  images?: string[] | null
  ratio?: number
}

export function ImageGrid({
  className,
  images,
  title = '',
  ratio = 4 / 3,
}: ImageGridProps) {
  return (
    <AspectRatio
      className={cn('transition-transform duration-300 group-hover:scale-105', {
        'grid grid-cols-3 grid-rows-2': (images?.length ?? 0) >= 3,
        'grid grid-cols-2': images?.length === 2,
        className,
      })}
      ratio={ratio}
    >
      {images?.length ? (
        images.slice(0, 3).map((src, index, array) => (
          <Image
            src={src}
            alt={title}
            className={cn(
              'size-full object-cover object-center',
              array.length === 3
                ? {
                    'col-span-2 row-span-2': index === 0,
                    'col-span-1 row-span-1': index !== 0,
                  }
                : array.length === 2
                  ? 'col-span-1'
                  : {},
            )}
          />
        ))
      ) : (
        <div className="size-full bg-linear-to-br from-secondary-200 to-secondary-400" />
      )}
    </AspectRatio>
  )
}
