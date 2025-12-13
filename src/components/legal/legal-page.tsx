import { MainLayout } from '@/components/layout'

// ============================================
// Types
// ============================================

type Section = {
  title: string
  content: string | string[]
  subsections?: {
    title: string
    content: string | string[]
  }[]
}

type LegalPageProps = {
  title: string
  effectiveDate: string
  intro: string
  sections: Section[]
}

// ============================================
// Legal Page Component
// ============================================

export function LegalPage({
  title,
  effectiveDate,
  intro,
  sections,
}: LegalPageProps) {
  return (
    <MainLayout>
      <div className="container mx-auto py-16">
        <div className="mx-auto max-w-2xl">
          {/* Title */}
          <h1 className="text-4xl font-bold">{title}</h1>

          {/* Effective Date */}
          <p className="mt-4 text-sm text-muted-foreground">
            Effective date: {effectiveDate}
          </p>
          <hr className="my-6 border-border" />

          {/* Intro */}
          <p className="text-sm leading-relaxed text-foreground">{intro}</p>
          <hr className="my-6 border-border" />

          {/* Sections */}
          <div className="space-y-8">
            {sections.map((section, index) => (
              <div key={index}>
                <h2 className="text-lg font-semibold">
                  {index + 1}. {section.title}
                </h2>
                <div className="mt-3 text-sm leading-relaxed text-foreground">
                  {Array.isArray(section.content) ? (
                    section.content.map((paragraph, pIndex) => (
                      <p key={pIndex} className={pIndex > 0 ? 'mt-2' : ''}>
                        {paragraph}
                      </p>
                    ))
                  ) : (
                    <p>{section.content}</p>
                  )}
                </div>

                {/* Subsections */}
                {section.subsections?.map((subsection, subIndex) => (
                  <div key={subIndex} className="mt-6">
                    <h3 className="text-base font-semibold">
                      {index + 1}.{subIndex + 1} {subsection.title}
                    </h3>
                    <div className="mt-2 text-sm leading-relaxed text-foreground">
                      {Array.isArray(subsection.content) ? (
                        subsection.content.map((paragraph, pIndex) => (
                          <p key={pIndex} className={pIndex > 0 ? 'mt-2' : ''}>
                            {paragraph}
                          </p>
                        ))
                      ) : (
                        <p>{subsection.content}</p>
                      )}
                    </div>
                  </div>
                ))}

                {index < sections.length - 1 && (
                  <hr className="mt-8 border-border" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
