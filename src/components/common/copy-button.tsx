import { useState, type ComponentProps } from 'react'
import { CopyIcon, CheckIcon } from 'lucide-react'

import { cn } from '@/libs/cn'
import { Button } from '@/components/ui/button'

type CopyButtonProps = Omit<ComponentProps<typeof Button>, 'variant' | 'size'> & {
  textToCopy: string
  onCopied?: () => void
  showLabel?: boolean
}

function CopyButton({
  textToCopy,
  onCopied,
  showLabel = true,
  className,
  ...props
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(textToCopy)
      setCopied(true)
      onCopied?.()
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <Button
      variant="overlay"
      size="xs"
      onClick={handleCopy}
      className={cn('gap-1', className)}
      {...props}
    >
      {copied ? (
        <>
          <CheckIcon className="size-3" />
          {showLabel && <span>Copied</span>}
        </>
      ) : (
        <>
          <CopyIcon className="size-3" />
          {showLabel && <span>Copy</span>}
        </>
      )}
    </Button>
  )
}

export { CopyButton }
