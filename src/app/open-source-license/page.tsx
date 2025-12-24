'use client';

import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { ScrollToTopFab } from '@/components/Layout/ScrollToTopFab';
import { InquiryFab } from '@/components/Layout/InquiryFab';
import {
  Box,
  Container,
  Typography,
  useTheme,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Link as MuiLink,
  Chip,
} from '@mui/material';
import { Code as CodeIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';

interface License {
  name: string;
  version: string;
  license: string;
  repository: string;
  description: string;
}

const productionDependencies: License[] = [
  {
    name: 'React',
    version: '19.2.0',
    license: 'MIT',
    repository: 'https://github.com/facebook/react',
    description: 'A JavaScript library for building user interfaces',
  },
  {
    name: 'React DOM',
    version: '19.2.0',
    license: 'MIT',
    repository: 'https://github.com/facebook/react',
    description: 'React package for working with the DOM',
  },
  {
    name: 'Next.js',
    version: '16.0.7',
    license: 'MIT',
    repository: 'https://github.com/vercel/next.js',
    description: 'The React Framework for Production',
  },
  {
    name: '@mui/material',
    version: '7.3.5',
    license: 'MIT',
    repository: 'https://github.com/mui/material-ui',
    description: 'React components that implement Material Design',
  },
  {
    name: '@mui/icons-material',
    version: '7.3.5',
    license: 'MIT',
    repository: 'https://github.com/mui/material-ui',
    description: 'Material Design icons for MUI',
  },
  {
    name: '@emotion/react',
    version: '11.14.0',
    license: 'MIT',
    repository: 'https://github.com/emotion-js/emotion',
    description: 'CSS-in-JS library for React',
  },
  {
    name: '@emotion/styled',
    version: '11.14.1',
    license: 'MIT',
    repository: 'https://github.com/emotion-js/emotion',
    description: 'Styled component library for Emotion',
  },
  {
    name: '@emotion/cache',
    version: '11.14.0',
    license: 'MIT',
    repository: 'https://github.com/emotion-js/emotion',
    description: 'Emotion cache for SSR',
  },
  {
    name: '@emotion/server',
    version: '11.11.0',
    license: 'MIT',
    repository: 'https://github.com/emotion-js/emotion',
    description: 'Server-side rendering utilities for Emotion',
  },
  {
    name: 'Framer Motion',
    version: '12.23.24',
    license: 'MIT',
    repository: 'https://github.com/framer/motion',
    description: 'Production-ready animation library for React',
  },
  {
    name: '@supabase/supabase-js',
    version: '2.81.1',
    license: 'MIT',
    repository: 'https://github.com/supabase/supabase-js',
    description: 'Supabase JavaScript client library',
  },
  {
    name: '@supabase/ssr',
    version: '0.7.0',
    license: 'MIT',
    repository: 'https://github.com/supabase/auth-helpers',
    description: 'Supabase Auth helpers for SSR frameworks',
  },
  {
    name: 'date-fns',
    version: '4.1.0',
    license: 'MIT',
    repository: 'https://github.com/date-fns/date-fns',
    description: 'Modern JavaScript date utility library',
  },
  {
    name: 'nanoid',
    version: '5.1.6',
    license: 'MIT',
    repository: 'https://github.com/ai/nanoid',
    description: 'Tiny, secure URL-friendly unique ID generator',
  },
  {
    name: 'react-syntax-highlighter',
    version: '16.1.0',
    license: 'MIT',
    repository: 'https://github.com/react-syntax-highlighter/react-syntax-highlighter',
    description: 'Syntax highlighting component for React',
  },
];

const devDependencies: License[] = [
  {
    name: 'TypeScript',
    version: '5.9.3',
    license: 'Apache-2.0',
    repository: 'https://github.com/microsoft/TypeScript',
    description: 'TypeScript is a superset of JavaScript that compiles to clean JavaScript output',
  },
  {
    name: 'Tailwind CSS',
    version: '4.x',
    license: 'MIT',
    repository: 'https://github.com/tailwindlabs/tailwindcss',
    description: 'A utility-first CSS framework',
  },
  {
    name: '@tailwindcss/postcss',
    version: '4.x',
    license: 'MIT',
    repository: 'https://github.com/tailwindlabs/tailwindcss',
    description: 'PostCSS plugin for Tailwind CSS',
  },
  {
    name: 'ESLint',
    version: '9.x',
    license: 'MIT',
    repository: 'https://github.com/eslint/eslint',
    description: 'A pluggable linting utility for JavaScript and JSX',
  },
  {
    name: 'eslint-config-next',
    version: '16.0.7',
    license: 'MIT',
    repository: 'https://github.com/vercel/next.js',
    description: 'ESLint configuration for Next.js',
  },
];

export default function OpenSourceLicensePage() {
  const theme = useTheme();

  const renderLicenseTable = (licenses: License[], title: string) => (
    <Box sx={{ mb: 6 }}>
      <Typography
        variant="h5"
        sx={{
          fontWeight: 700,
          mb: 3,
          color: 'text.primary',
        }}
      >
        {title}
      </Typography>
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          borderRadius: 2,
          border: `1px solid ${theme.palette.divider}`,
          bgcolor: theme.palette.mode === 'dark' ? '#1a1a2e' : '#ffffff',
        }}
      >
        <Table>
          <TableHead>
            <TableRow
              sx={{
                bgcolor: theme.palette.mode === 'dark' ? '#252540' : '#f8f9fa',
              }}
            >
              <TableCell sx={{ fontWeight: 700, width: '25%' }}>패키지명</TableCell>
              <TableCell sx={{ fontWeight: 700, width: '10%' }}>버전</TableCell>
              <TableCell sx={{ fontWeight: 700, width: '12%' }}>라이선스</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>설명</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {licenses.map((pkg, index) => (
              <TableRow
                key={pkg.name}
                sx={{
                  '&:nth-of-type(odd)': {
                    bgcolor: theme.palette.mode === 'dark' ? 'rgba(255, 107, 53, 0.02)' : 'rgba(255, 107, 53, 0.02)',
                  },
                  '&:hover': {
                    bgcolor: theme.palette.mode === 'dark' ? 'rgba(255, 107, 53, 0.05)' : 'rgba(255, 107, 53, 0.05)',
                  },
                }}
              >
                <TableCell>
                  <MuiLink
                    href={pkg.repository}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      color: '#ff6b35',
                      textDecoration: 'none',
                      fontWeight: 600,
                      '&:hover': {
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    {pkg.name}
                  </MuiLink>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                    {pkg.version}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={pkg.license}
                    size="small"
                    sx={{
                      bgcolor: pkg.license === 'MIT' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                      color: pkg.license === 'MIT' ? '#10b981' : '#3b82f6',
                      fontWeight: 600,
                      fontSize: '0.75rem',
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {pkg.description}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  return (
    <>
      <Header />

      {/* Hero Section */}
      <Box
        sx={{
          minHeight: '30vh',
          display: 'flex',
          alignItems: 'center',
          background:
            theme.palette.mode === 'dark'
              ? 'linear-gradient(135deg, #1a1a2e 0%, #1a1a1a 100%)'
              : 'linear-gradient(135deg, #fff5f5 0%, #fffbf5 100%)',
          borderBottom: `1px solid ${theme.palette.divider}`,
          py: { xs: 6, md: 8 },
        }}
      >
        <Container maxWidth="md">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Box sx={{ textAlign: 'center' }}>
              <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: '2rem', md: '3rem' },
                  fontWeight: 800,
                  mb: 2,
                  background: 'linear-gradient(135deg, #ff6b35 0%, #ffc857 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Open Source License
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: 'text.secondary',
                  maxWidth: 500,
                  mx: 'auto',
                }}
              >
                오픈소스 라이선스 고지
              </Typography>
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* Introduction */}
      <Box
        sx={{
          py: { xs: 6, md: 8 },
          background: theme.palette.mode === 'dark' ? '#0f0f0f' : '#ffffff',
        }}
      >
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Paper
              elevation={0}
              sx={{
                p: { xs: 4, md: 6 },
                borderRadius: 3,
                bgcolor: theme.palette.mode === 'dark' ? '#1a1a2e' : '#fffbf5',
                border: `1px solid ${theme.palette.divider}`,
                textAlign: 'center',
                mb: 6,
              }}
            >
              <CodeIcon
                sx={{
                  fontSize: 56,
                  color: '#ff6b35',
                  mb: 2,
                }}
              />
              <Typography
                variant="body1"
                sx={{
                  color: 'text.primary',
                  lineHeight: 1.8,
                  fontSize: { xs: '1rem', md: '1.125rem' },
                }}
              >
                ViBB는 다양한 오픈소스 소프트웨어를 활용하여 개발되었습니다.
                <br />
                아래는 본 서비스에서 사용된 오픈소스 라이브러리 및 해당 라이선스 정보입니다.
                <br />
                <Box component="span" sx={{ fontWeight: 700, color: '#ff6b35' }}>
                  모든 오픈소스 개발자분들께 감사드립니다.
                </Box>
              </Typography>
            </Paper>
          </motion.div>

          {/* Production Dependencies */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {renderLicenseTable(productionDependencies, '프로덕션 의존성 (Production Dependencies)')}
          </motion.div>

          {/* Dev Dependencies */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {renderLicenseTable(devDependencies, '개발 의존성 (Development Dependencies)')}
          </motion.div>
        </Container>
      </Box>

      {/* License Text Section */}
      <Box
        sx={{
          py: { xs: 6, md: 8 },
          background:
            theme.palette.mode === 'dark'
              ? 'linear-gradient(180deg, #1a1a1a 0%, #0f0f0f 100%)'
              : 'linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%)',
        }}
      >
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                mb: 4,
                color: 'text.primary',
              }}
            >
              주요 라이선스 전문
            </Typography>

            {/* MIT License */}
            <Paper
              elevation={0}
              sx={{
                p: 4,
                borderRadius: 3,
                bgcolor: theme.palette.mode === 'dark' ? '#1a1a2e' : '#ffffff',
                border: `1px solid ${theme.palette.divider}`,
                mb: 4,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Chip
                  label="MIT License"
                  sx={{
                    bgcolor: 'rgba(16, 185, 129, 0.1)',
                    color: '#10b981',
                    fontWeight: 700,
                  }}
                />
                <Typography variant="body2" color="text.secondary">
                  대부분의 패키지에서 사용
                </Typography>
              </Box>
              <Box
                component="pre"
                sx={{
                  p: 3,
                  borderRadius: 2,
                  bgcolor: theme.palette.mode === 'dark' ? '#0f0f0f' : '#f8f9fa',
                  border: `1px solid ${theme.palette.divider}`,
                  overflow: 'auto',
                  fontSize: '0.875rem',
                  lineHeight: 1.7,
                  fontFamily: 'monospace',
                  color: 'text.secondary',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                }}
              >
{`MIT License

Copyright (c) [year] [copyright holders]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`}
              </Box>
            </Paper>

            {/* Apache 2.0 License */}
            <Paper
              elevation={0}
              sx={{
                p: 4,
                borderRadius: 3,
                bgcolor: theme.palette.mode === 'dark' ? '#1a1a2e' : '#ffffff',
                border: `1px solid ${theme.palette.divider}`,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Chip
                  label="Apache License 2.0"
                  sx={{
                    bgcolor: 'rgba(59, 130, 246, 0.1)',
                    color: '#3b82f6',
                    fontWeight: 700,
                  }}
                />
                <Typography variant="body2" color="text.secondary">
                  TypeScript에서 사용
                </Typography>
              </Box>
              <Box
                component="pre"
                sx={{
                  p: 3,
                  borderRadius: 2,
                  bgcolor: theme.palette.mode === 'dark' ? '#0f0f0f' : '#f8f9fa',
                  border: `1px solid ${theme.palette.divider}`,
                  overflow: 'auto',
                  fontSize: '0.875rem',
                  lineHeight: 1.7,
                  fontFamily: 'monospace',
                  color: 'text.secondary',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                }}
              >
{`Apache License
Version 2.0, January 2004
http://www.apache.org/licenses/

TERMS AND CONDITIONS FOR USE, REPRODUCTION, AND DISTRIBUTION

1. Definitions.

"License" shall mean the terms and conditions for use, reproduction,
and distribution as defined by Sections 1 through 9 of this document.

"Licensor" shall mean the copyright owner or entity authorized by
the copyright owner that is granting the License.

"Legal Entity" shall mean the union of the acting entity and all
other entities that control, are controlled by, or are under common
control with that entity.

[...]

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.`}
              </Box>
              <Typography
                variant="body2"
                sx={{ mt: 2, color: 'text.secondary' }}
              >
                전체 라이선스 전문은{' '}
                <MuiLink
                  href="https://www.apache.org/licenses/LICENSE-2.0"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ color: '#ff6b35' }}
                >
                  Apache 공식 웹사이트
                </MuiLink>
                에서 확인하실 수 있습니다.
              </Typography>
            </Paper>
          </motion.div>
        </Container>
      </Box>

      {/* Notice Section */}
      <Box
        sx={{
          py: { xs: 6, md: 8 },
          background:
            theme.palette.mode === 'dark'
              ? 'linear-gradient(135deg, rgba(255, 107, 53, 0.1) 0%, rgba(255, 200, 87, 0.1) 100%)'
              : 'linear-gradient(135deg, rgba(255, 107, 53, 0.05) 0%, rgba(255, 200, 87, 0.05) 100%)',
          borderTop: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Container maxWidth="md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Paper
              elevation={0}
              sx={{
                p: 4,
                borderRadius: 3,
                bgcolor: theme.palette.mode === 'dark' ? '#1a1a2e' : '#ffffff',
                border: `1px solid ${theme.palette.divider}`,
                textAlign: 'center',
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  color: 'text.primary',
                  lineHeight: 1.8,
                }}
              >
                본 페이지에 기재된 라이선스 정보는{' '}
                <Box component="span" sx={{ fontWeight: 700, color: '#ff6b35' }}>
                  2025년 12월 기준
                </Box>
                으로 작성되었습니다.
                <br />
                각 패키지의 정확한 라이선스 정보는 해당 저장소에서 직접 확인해 주시기 바랍니다.
              </Typography>
            </Paper>
          </motion.div>
        </Container>
      </Box>

      <Footer />
      <InquiryFab />
      <ScrollToTopFab />
    </>
  );
}
