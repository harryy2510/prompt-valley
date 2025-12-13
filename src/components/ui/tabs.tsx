import * as TabsPrimitive from '@radix-ui/react-tabs'
import type { ComponentProps } from 'react'
import { createContext, useContext } from 'react'

import { cn } from '@/libs/cn'

type TabsVariant = 'default' | 'filter' | 'underline'

const TabsVariantContext = createContext<TabsVariant>('default')

function Tabs({
  className,
  variant = 'default',
  ...props
}: ComponentProps<typeof TabsPrimitive.Root> & {
  variant?: TabsVariant
}) {
  return (
    <TabsVariantContext.Provider value={variant}>
      <TabsPrimitive.Root
        data-slot="tabs"
        data-variant={variant}
        className={cn('flex flex-col gap-2', className)}
        {...props}
      />
    </TabsVariantContext.Provider>
  )
}

function TabsList({
  className,
  ...props
}: ComponentProps<typeof TabsPrimitive.List>) {
  const variant = useContext(TabsVariantContext)

  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        'inline-flex w-fit items-center',
        // Default variant - contained pills
        variant === 'default' &&
          'h-9 rounded-lg bg-muted p-[3px] text-muted-foreground justify-center',
        // Filter variant - transparent with gaps
        variant === 'filter' && 'gap-1 bg-transparent',
        // Underline variant - with bottom border
        variant === 'underline' &&
          'gap-4 border-b border-border bg-transparent',
        className,
      )}
      {...props}
    />
  )
}

function TabsTrigger({
  className,
  ...props
}: ComponentProps<typeof TabsPrimitive.Trigger>) {
  const variant = useContext(TabsVariantContext)

  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        'cursor-pointer inline-flex items-center justify-center gap-1.5 text-sm font-medium whitespace-nowrap transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*="size-"])]:size-4',
        // Default variant
        variant === 'default' &&
          'h-[calc(100%-1px)] flex-1 rounded-md border border-transparent px-2 py-1 data-[state=active]:bg-background data-[state=active]:shadow-sm dark:data-[state=active]:bg-input/30 dark:data-[state=active]:border-input text-foreground dark:text-muted-foreground dark:data-[state=active]:text-foreground',
        // Filter variant - pill style tabs
        variant === 'filter' &&
          'h-8 rounded-md border border-border bg-background px-3 text-muted-foreground hover:bg-muted hover:text-foreground data-[state=active]:bg-foreground data-[state=active]:text-background data-[state=active]:border-foreground',
        // Underline variant
        variant === 'underline' &&
          'h-9 border-b-2 border-transparent px-1 pb-2 text-muted-foreground hover:text-foreground data-[state=active]:border-primary data-[state=active]:text-foreground',
        className,
      )}
      {...props}
    />
  )
}

function TabsContent({
  className,
  ...props
}: ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn('flex-1 outline-none', className)}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
export type { TabsVariant }
