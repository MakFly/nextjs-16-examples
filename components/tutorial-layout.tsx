import { ReactNode } from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface TutorialLayoutProps {
  children: ReactNode;
  title: string;
  description: string;
  badge?: string;
  className?: string;
}

export function TutorialLayout({
  children,
  title,
  description,
  badge,
  className,
}: TutorialLayoutProps) {
  return (
    <div className={cn('min-h-screen', className)}>
      {/* Header */}
      <div className="border-b border-border bg-card/50">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="max-w-3xl stagger-animation">
            {badge && (
              <Badge variant="secondary" className="mb-4 text-xs tracking-wider uppercase">
                {badge}
              </Badge>
            )}
            <h1 className="mb-4">{title}</h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {description}
            </p>
            <div className="accent-bar mt-6" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 md:py-12">
        {children}
      </div>
    </div>
  );
}

interface TutorialSectionProps {
  children: ReactNode;
  title?: string;
  description?: string;
  className?: string;
}

export function TutorialSection({
  children,
  title,
  description,
  className,
}: TutorialSectionProps) {
  return (
    <section className={cn('mb-12', className)}>
      {(title || description) && (
        <div className="mb-6">
          {title && (
            <h2 className="text-2xl md:text-3xl mb-2">{title}</h2>
          )}
          {description && (
            <p className="text-muted-foreground">{description}</p>
          )}
        </div>
      )}
      {children}
    </section>
  );
}

interface FeatureGridProps {
  children: ReactNode;
  columns?: 2 | 3 | 4;
  className?: string;
}

export function FeatureGrid({
  children,
  columns = 3,
  className,
}: FeatureGridProps) {
  const gridCols = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-2 lg:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={cn('grid gap-4', gridCols[columns], className)}>
      {children}
    </div>
  );
}

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  className?: string;
}

export function FeatureCard({
  icon,
  title,
  description,
  className,
}: FeatureCardProps) {
  return (
    <div className={cn(
      'group p-6 bg-card border border-border rounded-lg',
      'transition-all duration-300 hover:border-foreground/20 hover:shadow-md',
      className
    )}>
      <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center mb-4 group-hover:bg-foreground group-hover:text-background transition-colors">
        {icon}
      </div>
      <h4 className="font-display text-lg mb-2">{title}</h4>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {description}
      </p>
    </div>
  );
}
