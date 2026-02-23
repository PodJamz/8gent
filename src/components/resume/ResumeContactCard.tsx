'use client';

import { motion } from 'framer-motion';
import { Mail, Linkedin, Download, Calendar } from 'lucide-react';
import { Icons } from '@/components/icons';
import { DATA } from '@/data/resume';

interface ResumeContactCardProps {
  lang?: 'en' | 'pt';
}

export function ResumeContactCard({ lang = 'en' }: ResumeContactCardProps) {
  const handleDownloadPDF = () => {
    // Open print dialog for PDF generation
    window.print();
  };

  const handleEmailClick = () => {
    window.location.href = `mailto:${DATA.contact.email}?subject=Let's Connect&body=Hi James,`;
  };

  const contactActions = [
    {
      label: 'LinkedIn',
      icon: Icons.linkedin,
      href: DATA.contact.social.LinkedIn.url,
      color: 'hsl(210, 90%, 45%)',
      ariaLabel: lang === 'en' ? 'Connect on LinkedIn' : 'Conectar no LinkedIn',
    },
    {
      label: 'X',
      icon: Icons.x,
      href: DATA.contact.social.X.url,
      color: 'hsl(var(--theme-foreground))',
      ariaLabel: lang === 'en' ? 'Follow on X' : 'Seguir no X',
    },
    {
      label: lang === 'en' ? 'Email' : 'E-mail',
      icon: Mail,
      onClick: handleEmailClick,
      color: 'hsl(var(--theme-primary))',
      ariaLabel: lang === 'en' ? 'Send email' : 'Enviar e-mail',
    },
    {
      label: 'PDF',
      icon: Download,
      onClick: handleDownloadPDF,
      color: 'hsl(var(--theme-accent))',
      ariaLabel: lang === 'en' ? 'Download as PDF' : 'Baixar como PDF',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full"
    >
      {/* Contact Card Container */}
      <div
        className="rounded-2xl p-6 backdrop-blur-sm"
        style={{
          background: 'hsl(var(--theme-card) / 0.8)',
          border: '1px solid hsl(var(--theme-border) / 0.5)',
        }}
      >
        {/* Header */}
        <div className="flex items-center gap-4 mb-5">
          {/* Mini Avatar */}
          <div
            className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0"
            style={{
              boxShadow: '0 0 0 2px hsl(var(--theme-primary) / 0.3)',
            }}
          >
            <img
              src={DATA.avatarUrl}
              alt={DATA.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Name and Title */}
          <div className="flex-1 min-w-0">
            <h3
              className="font-semibold text-base truncate"
              style={{
                color: 'hsl(var(--theme-foreground))',
                fontFamily: 'var(--theme-font-heading, var(--theme-font, inherit))',
              }}
            >
              {DATA.name}
            </h3>
            <p
              className="text-sm truncate"
              style={{ color: 'hsl(var(--theme-muted-foreground))' }}
            >
              {lang === 'en' ? 'Product Builder' : 'Construtor de Produtos'}
            </p>
          </div>
        </div>

        {/* Action Buttons Grid */}
        <div className="grid grid-cols-4 gap-2">
          {contactActions.map((action, index) => {
            const IconComponent = action.icon;
            const isExternal = !!action.href;

            const buttonContent = (
              <motion.div
                key={action.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                className="flex flex-col items-center gap-1.5"
              >
                <motion.div
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-11 h-11 rounded-xl flex items-center justify-center transition-colors"
                  style={{
                    background: 'hsl(var(--theme-muted) / 0.5)',
                    border: '1px solid hsl(var(--theme-border) / 0.3)',
                  }}
                >
                  <IconComponent
                    className="w-5 h-5"
                    style={{ color: action.color }}
                  />
                </motion.div>
                <span
                  className="text-[10px] font-medium"
                  style={{ color: 'hsl(var(--theme-muted-foreground))' }}
                >
                  {action.label}
                </span>
              </motion.div>
            );

            if (isExternal) {
              return (
                <a
                  key={action.label}
                  href={action.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={action.ariaLabel}
                  className="cursor-pointer"
                >
                  {buttonContent}
                </a>
              );
            }

            return (
              <button
                key={action.label}
                onClick={action.onClick}
                aria-label={action.ariaLabel}
                className="cursor-pointer"
              >
                {buttonContent}
              </button>
            );
          })}
        </div>

        {/* Subtle CTA Text */}
        <p
          className="text-center text-xs mt-4 opacity-70"
          style={{ color: 'hsl(var(--theme-muted-foreground))' }}
        >
          {lang === 'en'
            ? "Let's build something great together"
            : 'Vamos construir algo incrível juntos'}
        </p>
      </div>
    </motion.div>
  );
}
