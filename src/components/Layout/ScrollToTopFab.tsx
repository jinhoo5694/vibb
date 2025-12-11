'use client';

import React, { useState, useEffect } from 'react';
import { Fab, useTheme, Zoom } from '@mui/material';
import { KeyboardArrowUp as ArrowUpIcon } from '@mui/icons-material';
import { motion, useScroll } from 'framer-motion';

export const ScrollToTopFab: React.FC = () => {
  const theme = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  const { scrollY } = useScroll();

  useEffect(() => {
    const unsubscribe = scrollY.on('change', (latest) => {
      setIsVisible(latest > 300);
    });

    return () => unsubscribe();
  }, [scrollY]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <Zoom in={isVisible} timeout={300}>
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        style={{
          position: 'fixed',
          bottom: theme.spacing(4),
          right: theme.spacing(4),
          zIndex: theme.zIndex.fab || 1050,
        }}
      >
        <Fab
          color="primary"
          onClick={scrollToTop}
          aria-label="scroll to top"
          sx={{
            background: 'linear-gradient(135deg, #ff6b35 0%, #ffc857 100%)',
            boxShadow: theme.shadows[8],
            '&:hover': {
              background: 'linear-gradient(135deg, #FF85A6 0%, #FFC46D 100%)',
              boxShadow: theme.shadows[12],
            },
            transition: 'all 0.3s ease',
          }}
        >
          <ArrowUpIcon sx={{ fontSize: 28, color: 'white' }} />
        </Fab>
      </motion.div>
    </Zoom>
  );
};
