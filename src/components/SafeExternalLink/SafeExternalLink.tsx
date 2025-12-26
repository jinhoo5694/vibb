'use client';

import React, { ReactNode, MouseEvent } from 'react';
import { Link, LinkProps } from '@mui/material';
import { useExternalLink } from '@/contexts/ExternalLinkContext';

interface SafeExternalLinkProps extends Omit<LinkProps, 'onClick'> {
  href: string;
  children: ReactNode;
  /** If true, skip the warning dialog (for trusted links) */
  skipWarning?: boolean;
}

/**
 * A link component that shows a warning dialog before navigating to external URLs.
 * Use this component for any user-generated or untrusted external links.
 */
export function SafeExternalLink({
  href,
  children,
  skipWarning = false,
  ...props
}: SafeExternalLinkProps) {
  const { openExternalLink } = useExternalLink();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    // Check if it's an external URL
    const isExternal = href.startsWith('http://') || href.startsWith('https://');

    if (isExternal && !skipWarning) {
      e.preventDefault();
      openExternalLink(href);
    }
    // For internal links or skipWarning, let the default behavior happen
  };

  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      {...props}
    >
      {children}
    </Link>
  );
}

export default SafeExternalLink;
