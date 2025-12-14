'use client';

import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Container,
  useTheme,
  useMediaQuery,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemButton,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Drawer,
  Collapse,
} from '@mui/material';
import {
  Brightness4,
  Brightness7,
  Menu as MenuIcon,
  Close as CloseIcon,
  Login as LoginIcon,
  Logout as LogoutIcon,
  Home as HomeIcon,
  Explore as ExploreIcon,
  Category as CategoryIcon,
  KeyboardArrowDown as ArrowDownIcon,
  KeyboardArrowUp as ArrowUpIcon,
  AutoAwesome as SkillsIcon,
  Info as InfoIcon,
  MenuBook as GuideIcon,
  GitHub as GitHubIcon,
  Google as GoogleIcon,
} from '@mui/icons-material';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useThemeContext } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';

import {
  Forum as ForumIcon,
} from '@mui/icons-material';

// Sub-menu items for each section
const skillsSubMenu = [
  { label: '스킬 탐색', labelEn: 'Explore', href: '/skills/explore', icon: <ExploreIcon fontSize="small" />, description: '모든 스킬 보기', descriptionEn: 'Browse all skills' },
  { label: '카테고리', labelEn: 'Categories', href: '/skills/categories', icon: <CategoryIcon fontSize="small" />, description: '카테고리별 탐색', descriptionEn: 'Browse by category' },
  { label: '스킬 소개', labelEn: 'About Skills', href: '/skills/hub', icon: <InfoIcon fontSize="small" />, description: '클로드 스킬이란?', descriptionEn: 'What are Claude Skills?' },
  { label: '가이드', labelEn: 'Guide', href: '/skills/guide', icon: <GuideIcon fontSize="small" />, description: '설치 및 사용법', descriptionEn: 'Installation & usage' },
];

const mcpSubMenu = [
  { label: 'MCP 소개', labelEn: 'About MCP', href: '/mcp/hub', icon: <InfoIcon fontSize="small" />, description: 'MCP란?', descriptionEn: 'What is MCP?' },
];

const promptSubMenu = [
  { label: '프롬프트 소개', labelEn: 'About Prompts', href: '/prompt/hub', icon: <InfoIcon fontSize="small" />, description: '프롬프트란?', descriptionEn: 'What are Prompts?' },
];

const aiToolsSubMenu = [
  { label: 'AI 코딩 툴 소개', labelEn: 'About AI Coding Tools', href: '/ai-tools/hub', icon: <InfoIcon fontSize="small" />, description: 'AI 코딩 툴이란?', descriptionEn: 'What are AI Coding Tools?' },
];

// Map of submenus by href
const subMenuMap: Record<string, typeof skillsSubMenu> = {
  '/skills': skillsSubMenu,
  '/mcp': mcpSubMenu,
  '/prompt': promptSubMenu,
  '/ai-tools': aiToolsSubMenu,
};

export const Header: React.FC = () => {
  const { mode, toggleTheme } = useThemeContext();
  const { language } = useLanguage();
  const { user, loading, signInWithGoogle, signInWithGithub, signOut } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const pathname = usePathname();

  // Check if a path is active
  const isActivePath = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [activeMenuHref, setActiveMenuHref] = useState<string | null>(null);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [mobileExpandedMenu, setMobileExpandedMenu] = useState<string | null>(null);

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNavMenuOpen = (event: React.MouseEvent<HTMLElement>, href: string) => {
    setMenuAnchor(event.currentTarget);
    setActiveMenuHref(href);
  };

  const handleNavMenuClose = () => {
    setMenuAnchor(null);
    setActiveMenuHref(null);
  };

  // For hover-based menu - use refs to track hover state
  const menuCloseTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const isHoveringMenuRef = React.useRef(false);
  const isHoveringDropdownRef = React.useRef(false);

  const closeMenuIfNotHovering = () => {
    menuCloseTimeoutRef.current = setTimeout(() => {
      if (!isHoveringMenuRef.current && !isHoveringDropdownRef.current) {
        setMenuAnchor(null);
        setActiveMenuHref(null);
      }
    }, 100);
  };

  const handleMenuMouseEnter = (event: React.MouseEvent<HTMLElement>, href: string) => {
    if (menuCloseTimeoutRef.current) {
      clearTimeout(menuCloseTimeoutRef.current);
      menuCloseTimeoutRef.current = null;
    }
    isHoveringMenuRef.current = true;
    setMenuAnchor(event.currentTarget);
    setActiveMenuHref(href);
  };

  const handleMenuMouseLeave = () => {
    isHoveringMenuRef.current = false;
    closeMenuIfNotHovering();
  };

  const handleDropdownMouseEnter = () => {
    if (menuCloseTimeoutRef.current) {
      clearTimeout(menuCloseTimeoutRef.current);
      menuCloseTimeoutRef.current = null;
    }
    isHoveringDropdownRef.current = true;
  };

  const handleDropdownMouseLeave = () => {
    isHoveringDropdownRef.current = false;
    closeMenuIfNotHovering();
  };

  const handleSignInWithGoogle = async () => {
    await signInWithGoogle();
    setMobileDrawerOpen(false);
  };

  const handleSignInWithGithub = async () => {
    await signInWithGithub();
    setMobileDrawerOpen(false);
  };

  const handleSignOut = async () => {
    await signOut();
    handleUserMenuClose();
    setMobileDrawerOpen(false);
  };

  const handleMobileNavClick = () => {
    setMobileDrawerOpen(false);
    setMobileExpandedMenu(null);
  };

  const navigationItems = [
    { label: '홈', labelEn: 'Home', href: '/', icon: <HomeIcon /> },
    { label: '커뮤니티', labelEn: 'Community', href: '/board', icon: <ForumIcon /> },
    { label: 'AI 코딩 툴', labelEn: 'AI Coding Tools', href: '/ai-tools', icon: <ExploreIcon />, hasSubmenu: true },
    { label: '프롬프트', labelEn: 'Prompt', href: '/prompt', icon: <ExploreIcon />, hasSubmenu: true },
    { label: 'MCP', labelEn: 'MCP', href: '/mcp', icon: <CategoryIcon />, hasSubmenu: true },
    { label: '스킬', labelEn: 'Skills', href: '/skills', icon: <SkillsIcon />, hasSubmenu: true },
    { label: '뉴스', labelEn: 'News', href: '/news', icon: <ExploreIcon /> },
  ];

  return (
    <>
      <AppBar
        position="sticky"
        color="default"
        elevation={0}
        sx={{
          backdropFilter: 'blur(10px)',
          backgroundColor: mode === 'dark'
            ? 'rgba(18, 18, 18, 0.7)'
            : 'rgba(255, 255, 255, 0.7)',
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            {/* Logo */}
            <Box
              component={Link}
              href="/"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                textDecoration: 'none',
                mr: { xs: 'auto', sm: 4 },
              }}
            >
              <Box
                component="img"
                src={mode === 'dark' ? '/logo-dark.svg' : '/logo-light.svg'}
                alt="VIB Builders"
                sx={{
                  height: { xs: 32, sm: 40 },
                  width: 'auto',
                }}
              />
              <Box
                component="img"
                src={mode === 'dark' ? '/textLogo-darkmode.svg' : '/textLogo.svg'}
                alt="VIB Builders"
                sx={{
                  height: { xs: 20, sm: 24 },
                  width: 'auto',
                }}
              />
            </Box>

            {/* Desktop Navigation */}
            {!isMobile && (
              <Box sx={{ display: 'flex', gap: 1, flexGrow: 1 }}>
                {navigationItems.map((item) => (
                  item.hasSubmenu ? (
                    // Items with dropdown (hover-based)
                    <Box
                      key={item.href}
                      onMouseEnter={(e) => handleMenuMouseEnter(e, item.href)}
                      onMouseLeave={handleMenuMouseLeave}
                    >
                      <Button
                        component={Link}
                        href={item.href}
                        color="inherit"
                        endIcon={activeMenuHref === item.href ? <ArrowUpIcon /> : <ArrowDownIcon />}
                        sx={{
                          fontWeight: isActivePath(item.href) ? 700 : 400,
                          borderBottom: isActivePath(item.href) ? `2px solid ${theme.palette.primary.main}` : 'none',
                          borderRadius: 0,
                          pb: 0.5,
                          '&:hover': {
                            bgcolor: 'transparent',
                          },
                        }}
                      >
                        {language === 'ko' ? item.label : item.labelEn}
                      </Button>
                    </Box>
                  ) : (
                    // Regular nav items
                    <Button
                      key={item.href}
                      component={Link}
                      href={item.href}
                      color="inherit"
                      sx={{
                        fontWeight: isActivePath(item.href) ? 700 : 400,
                        borderBottom: isActivePath(item.href) ? `2px solid ${theme.palette.primary.main}` : 'none',
                        borderRadius: 0,
                        pb: 0.5,
                      }}
                    >
                      {language === 'ko' ? item.label : item.labelEn}
                    </Button>
                  )
                ))}

                {/* Shared dropdown menu for all nav items with submenus */}
                <Menu
                  anchorEl={menuAnchor}
                  open={Boolean(menuAnchor) && Boolean(activeMenuHref)}
                  onClose={handleNavMenuClose}
                  disableAutoFocus
                  disableEnforceFocus
                  disableRestoreFocus
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                  }}
                  slotProps={{
                    paper: {
                      onMouseEnter: handleDropdownMouseEnter,
                      onMouseLeave: handleDropdownMouseLeave,
                      sx: {
                        mt: 0.5,
                        minWidth: 220,
                        borderRadius: 2,
                        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                        pointerEvents: 'auto',
                      },
                    },
                    root: {
                      sx: {
                        pointerEvents: 'none',
                      },
                    },
                  }}
                >
                  {activeMenuHref && subMenuMap[activeMenuHref]?.map((subItem) => (
                    <MenuItem
                      key={subItem.href}
                      component={Link}
                      href={subItem.href}
                      onClick={handleNavMenuClose}
                      sx={{
                        py: 1.5,
                        px: 2,
                        gap: 1.5,
                        bgcolor: pathname === subItem.href ? `${theme.palette.primary.main}10` : 'transparent',
                        '&:hover': {
                          bgcolor: `${theme.palette.primary.main}15`,
                        },
                      }}
                    >
                      <Box sx={{ color: theme.palette.primary.main }}>
                        {subItem.icon}
                      </Box>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {language === 'ko' ? subItem.label : subItem.labelEn}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {language === 'ko' ? subItem.description : subItem.descriptionEn}
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Menu>
              </Box>
            )}

            {/* Desktop: Auth and Theme Toggle */}
            {!isMobile && (
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                {/* Auth Section */}
                {typeof window === 'undefined' || loading ? (
                  <Box sx={{ width: 40, height: 40 }} />
                ) : user ? (
                  <>
                    <IconButton onClick={handleUserMenuOpen} sx={{ p: 0.5 }}>
                      <Avatar
                        src={user.user_metadata?.avatar_url}
                        alt={user.user_metadata?.full_name || user.email || 'User'}
                        sx={{ width: 32, height: 32 }}
                      >
                        {user.email?.charAt(0).toUpperCase()}
                      </Avatar>
                    </IconButton>
                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClose={handleUserMenuClose}
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                      }}
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                      }}
                    >
                      <Box sx={{ px: 2, py: 1.5, minWidth: 200 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          {user.user_metadata?.full_name || 'User'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                          {user.email}
                        </Typography>
                      </Box>
                      <Divider />
                      <MenuItem onClick={handleSignOut}>
                        <LogoutIcon sx={{ mr: 1, fontSize: 20 }} />
                        Sign Out
                      </MenuItem>
                    </Menu>
                  </>
                ) : (
                  <Box sx={{ display: 'flex', gap: 1, ml: 1 }}>
                    <Button
                      variant="outlined"
                      color="primary"
                      startIcon={<GoogleIcon />}
                      onClick={handleSignInWithGoogle}
                      size="small"
                    >
                      Google
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<GitHubIcon />}
                      onClick={handleSignInWithGithub}
                      size="small"
                      sx={{
                        borderColor: mode === 'dark' ? '#fff' : '#24292e',
                        color: mode === 'dark' ? '#fff' : '#24292e',
                        '&:hover': {
                          borderColor: mode === 'dark' ? '#fff' : '#24292e',
                          backgroundColor: mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(36,41,46,0.08)',
                        },
                      }}
                    >
                      GitHub
                    </Button>
                  </Box>
                )}

                <IconButton onClick={toggleTheme} color="inherit">
                  {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
                </IconButton>
              </Box>
            )}

            {/* Mobile: Hamburger button only */}
            {isMobile && (
              <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                <IconButton color="inherit" onClick={() => setMobileDrawerOpen(true)}>
                  <MenuIcon />
                </IconButton>
              </Box>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileDrawerOpen}
        onClose={() => {
          setMobileDrawerOpen(false);
          setMobileExpandedMenu(null);
        }}
        PaperProps={{
          sx: {
            width: '85%',
            maxWidth: 360,
          },
        }}
      >
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          {/* Drawer Header */}
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Menu
            </Typography>
            <IconButton onClick={() => {
              setMobileDrawerOpen(false);
              setMobileExpandedMenu(null);
            }}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Divider />

          {/* Navigation Links */}
          <List sx={{ flexGrow: 1 }}>
            {navigationItems.map((item) => {
              const isActive = isActivePath(item.href);
              const isExpanded = mobileExpandedMenu === item.href;
              const subMenu = subMenuMap[item.href];

              if (item.hasSubmenu && subMenu) {
                return (
                  <Box key={item.href}>
                    <ListItemButton
                      onClick={() => setMobileExpandedMenu(isExpanded ? null : item.href)}
                      sx={{
                        bgcolor: isActive ? `${theme.palette.primary.main}15` : 'transparent',
                        borderLeft: isActive ? `3px solid ${theme.palette.primary.main}` : '3px solid transparent',
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 40,
                          color: isActive ? theme.palette.primary.main : 'inherit',
                        }}
                      >
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={language === 'ko' ? item.label : item.labelEn}
                        primaryTypographyProps={{
                          fontWeight: isActive ? 600 : 400,
                          color: isActive ? theme.palette.primary.main : 'inherit',
                        }}
                      />
                      {isExpanded ? <ArrowUpIcon /> : <ArrowDownIcon />}
                    </ListItemButton>
                    <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                      <List component="div" disablePadding>
                        {subMenu.map((subItem) => (
                          <ListItemButton
                            key={subItem.href}
                            component={Link}
                            href={subItem.href}
                            onClick={handleMobileNavClick}
                            sx={{
                              pl: 4,
                              bgcolor: pathname === subItem.href ? `${theme.palette.primary.main}10` : 'transparent',
                            }}
                          >
                            <ListItemIcon sx={{ minWidth: 36, color: theme.palette.primary.main }}>
                              {subItem.icon}
                            </ListItemIcon>
                            <ListItemText
                              primary={language === 'ko' ? subItem.label : subItem.labelEn}
                              secondary={language === 'ko' ? subItem.description : subItem.descriptionEn}
                              primaryTypographyProps={{ fontSize: '0.9rem' }}
                              secondaryTypographyProps={{ fontSize: '0.75rem' }}
                            />
                          </ListItemButton>
                        ))}
                      </List>
                    </Collapse>
                  </Box>
                );
              }

              return (
                <ListItem key={item.href} disablePadding>
                  <ListItemButton
                    component={Link}
                    href={item.href}
                    onClick={handleMobileNavClick}
                    sx={{
                      bgcolor: isActive ? `${theme.palette.primary.main}15` : 'transparent',
                      borderLeft: isActive ? `3px solid ${theme.palette.primary.main}` : '3px solid transparent',
                      '&:hover': {
                        bgcolor: isActive ? `${theme.palette.primary.main}20` : 'action.hover',
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 40,
                        color: isActive ? theme.palette.primary.main : 'inherit',
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={language === 'ko' ? item.label : item.labelEn}
                      primaryTypographyProps={{
                        fontWeight: isActive ? 600 : 400,
                        color: isActive ? theme.palette.primary.main : 'inherit',
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>

          <Divider />

          {/* Settings Section */}
          <Box sx={{ p: 2 }}>
            {/* Theme Toggle */}
            <ListItemButton onClick={toggleTheme} sx={{ borderRadius: 1, mb: 1 }}>
              <ListItemIcon sx={{ minWidth: 40 }}>
                {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
              </ListItemIcon>
              <ListItemText primary={mode === 'dark' ? 'Light Mode' : 'Dark Mode'} />
            </ListItemButton>

            {/* Auth Button */}
            {typeof window !== 'undefined' && !loading && (
              user ? (
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2, px: 1 }}>
                    <Avatar
                      src={user.user_metadata?.avatar_url}
                      alt={user.user_metadata?.full_name || user.email || 'User'}
                      sx={{ width: 36, height: 36 }}
                    >
                      {user.email?.charAt(0).toUpperCase()}
                    </Avatar>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {user.user_metadata?.full_name || 'User'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {user.email}
                      </Typography>
                    </Box>
                  </Box>
                  <Button
                    fullWidth
                    variant="outlined"
                    color="error"
                    startIcon={<LogoutIcon />}
                    onClick={handleSignOut}
                  >
                    Sign Out
                  </Button>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    startIcon={<GoogleIcon />}
                    onClick={handleSignInWithGoogle}
                  >
                    Google로 로그인
                  </Button>
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<GitHubIcon />}
                    onClick={handleSignInWithGithub}
                    sx={{
                      backgroundColor: '#24292e',
                      color: '#fff',
                      '&:hover': {
                        backgroundColor: '#1a1e22',
                      },
                    }}
                  >
                    GitHub로 로그인
                  </Button>
                </Box>
              )
            )}
          </Box>
        </Box>
      </Drawer>
    </>
  );
};
