'use client';

import React, { useState } from 'react';
import { Box, InputBase, Container, useTheme, Paper } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';

export const SearchBar: React.FC = () => {
  const theme = useTheme();
  const { t } = useLanguage();
  const router = useRouter();
  const [searchValue, setSearchValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      // Navigate to skills page with search query
      router.push(`/skills?search=${encodeURIComponent(searchValue)}`);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 } }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6 }}
      >
        <Box
          component="form"
          onSubmit={handleSearch}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Paper
            elevation={isFocused ? 8 : 2}
            sx={{
              width: '100%',
              maxWidth: 700,
              display: 'flex',
              alignItems: 'center',
              px: { xs: 2, sm: 3 },
              py: { xs: 1.5, sm: 2 },
              borderRadius: 4,
              transition: 'all 0.3s ease',
              border: `2px solid ${
                isFocused
                  ? theme.palette.primary.main
                  : 'transparent'
              }`,
              background: theme.palette.mode === 'dark'
                ? 'linear-gradient(135deg, #2d2d2d 0%, #3a3a3a 100%)'
                : 'linear-gradient(135deg, #FFFFFF 0%, #FFFBF5 100%)',
              '&:hover': {
                boxShadow: theme.shadows[6],
              },
            }}
          >
            <SearchIcon
              sx={{
                color: isFocused
                  ? theme.palette.primary.main
                  : theme.palette.text.secondary,
                fontSize: { xs: 24, sm: 28 },
                mr: 2,
                transition: 'color 0.3s ease',
              }}
            />
            <InputBase
              placeholder={t('searchBar.placeholder')}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              sx={{
                flex: 1,
                fontSize: { xs: '1rem', sm: '1.125rem' },
                fontWeight: 500,
                color: theme.palette.text.primary,
                '& ::placeholder': {
                  color: theme.palette.text.secondary,
                  opacity: 0.7,
                },
              }}
            />
          </Paper>
        </Box>

        {/* Search hint text */}
        <Box
          sx={{
            mt: 2,
            textAlign: 'center',
            color: theme.palette.text.secondary,
            fontSize: { xs: '0.875rem', sm: '1rem' },
            opacity: 0.8,
          }}
        >
          {t('searchBar.hint')}
        </Box>
      </motion.div>
    </Container>
  );
};
