import type { ImgHTMLAttributes } from 'react'
import { getImageUrl } from '@/libs/storage'

export type ImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> & {
  src: string | null | undefined
}

export function Image({
  alt = '',
  src,
  ...props
}: ImageProps) {
  const imageUrl = getImageUrl(src) ?? ''

  return <img {...props} alt={alt} src={imageUrl} />
}
