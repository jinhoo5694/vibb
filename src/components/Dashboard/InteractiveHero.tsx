"use client";

import React, { useState, useEffect, useRef } from "react";
import { Box, Typography, Container, useTheme, useMediaQuery } from "@mui/material";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

export const InteractiveHero: React.FC = () => {
  const theme = useTheme();
  const { t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Track mouse movement only on desktop
  useEffect(() => {
    if (isMobile) return; // Skip on mobile for performance

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setMousePosition({ x, y });
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("mousemove", handleMouseMove);
      return () => container.removeEventListener("mousemove", handleMouseMove);
    }
  }, [isMobile]);

  return (
    <Box
      ref={containerRef}
      sx={{
        position: "relative",
        minHeight: { xs: "35vh", md: "42.5vh" },
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        background:
          theme.palette.mode === "dark"
            ? "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)"
            : "linear-gradient(135deg, #FFFBF5 0%, #FFF5F7 100%)",
      }}
    >
      {/* Animated gradient background - only on desktop */}
      {!isMobile && (
        <Box
          sx={{
            position: "absolute",
            width: "200%",
            height: "200%",
            background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, ${
              theme.palette.mode === "dark"
                ? "rgba(255, 133, 166, 0.15)"
                : "rgba(255, 107, 157, 0.1)"
            } 0%, transparent 50%)`,
            pointerEvents: "none",
            transition: "background 0.3s ease-out",
          }}
        />
      )}

      {/* Gradient Orbs - Simplified for mobile */}
      {!isMobile ? (
        <>
          <motion.div
            animate={{
              x: [0, 30, 0],
              y: [0, -30, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              position: "absolute",
              width: "500px",
              height: "500px",
              borderRadius: "50%",
              background: `radial-gradient(circle, ${
                theme.palette.mode === "dark"
                  ? "rgba(255, 196, 109, 0.1)"
                  : "rgba(255, 184, 77, 0.15)"
              } 0%, transparent 70%)`,
              top: "10%",
              right: "10%",
              filter: "blur(60px)",
              pointerEvents: "none",
            }}
          />

          <motion.div
            animate={{
              x: [0, -30, 0],
              y: [0, 30, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              position: "absolute",
              width: "400px",
              height: "400px",
              borderRadius: "50%",
              background: `radial-gradient(circle, ${
                theme.palette.mode === "dark"
                  ? "rgba(255, 133, 166, 0.15)"
                  : "rgba(255, 107, 157, 0.2)"
              } 0%, transparent 70%)`,
              bottom: "20%",
              left: "10%",
              filter: "blur(80px)",
              pointerEvents: "none",
            }}
          />
        </>
      ) : (
        // Static gradient orbs for mobile (no animation)
        <>
          <Box
            sx={{
              position: "absolute",
              width: "300px",
              height: "300px",
              borderRadius: "50%",
              background: `radial-gradient(circle, ${
                theme.palette.mode === "dark"
                  ? "rgba(255, 196, 109, 0.08)"
                  : "rgba(255, 184, 77, 0.12)"
              } 0%, transparent 70%)`,
              top: "10%",
              right: "5%",
              filter: "blur(40px)",
              pointerEvents: "none",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              width: "250px",
              height: "250px",
              borderRadius: "50%",
              background: `radial-gradient(circle, ${
                theme.palette.mode === "dark"
                  ? "rgba(255, 133, 166, 0.12)"
                  : "rgba(255, 107, 157, 0.15)"
              } 0%, transparent 70%)`,
              bottom: "15%",
              left: "5%",
              filter: "blur(50px)",
              pointerEvents: "none",
            }}
          />
        </>
      )}

        {/* Content */}
        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
          <Box
            sx={{
              textAlign: "center",
              px: { xs: 2, md: 4 },
            }}
          >
            {/* Main heading */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Typography
                  variant="h1"
                  sx={{
                    fontSize: {
                      xs: "3rem",
                      sm: "4.5rem",
                      md: "6rem",
                      lg: "7rem",
                    },
                    fontWeight: 800,
                    lineHeight: 1.1,
                    mb: 3,
                    background:
                      theme.palette.mode === "dark"
                        ? "linear-gradient(135deg, #fff 0%, #ffd6e3 100%)"
                        : "linear-gradient(135deg, #ff6b35 0%, #ffc857 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    textShadow:
                      theme.palette.mode === "dark"
                        ? "0 0 40px rgba(255, 107, 157, 0.3)"
                        : "none",
                  }}
                >
                  VIB Builders
                </Typography>
            </motion.div>

            {/* Subtitle */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Typography
                variant="h4"
                sx={{
                  fontSize: { xs: "1.25rem", sm: "1.75rem", md: "2.25rem" },
                  fontWeight: 500,
                  color: "text.secondary",
                  mb: 2,
                  maxWidth: "800px",
                  mx: "auto",
                }}
              >
                {t("home.subtitle")}
              </Typography>
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontSize: { xs: "1rem", sm: "1.125rem", md: "1.25rem" },
                  fontWeight: 400,
                  color: "text.secondary",
                  maxWidth: "700px",
                  mx: "auto",
                  opacity: 0.8,
                }}
              >
                {t("home.description")}
              </Typography>
            </motion.div>

            {/* Scroll indicator - Simplified with CSS animation */}
            {!isMobile && (
              <Box
                sx={{
                  position: "absolute",
                  bottom: "40px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  animation: "fadeIn 1s ease-in-out 1.5s forwards",
                  opacity: 0,
                  "@keyframes fadeIn": {
                    to: { opacity: 1 },
                  },
                  "@keyframes bounce": {
                    "0%, 100%": { transform: "translateY(0)" },
                    "50%": { transform: "translateY(10px)" },
                  },
                  "@keyframes scroll": {
                    "0%, 100%": { transform: "translateY(0)", opacity: 0.5 },
                    "50%": { transform: "translateY(15px)", opacity: 1 },
                  },
                }}
              >
                <Box
                  sx={{
                    width: "30px",
                    height: "50px",
                    border: `2px solid ${theme.palette.text.secondary}`,
                    borderRadius: "20px",
                    position: "relative",
                    opacity: 0.5,
                    animation: "bounce 1.5s ease-in-out infinite",
                  }}
                >
                  <Box
                    sx={{
                      position: "absolute",
                      top: "8px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: "4px",
                      height: "8px",
                      borderRadius: "2px",
                      backgroundColor: theme.palette.text.secondary,
                      animation: "scroll 1.5s ease-in-out infinite",
                    }}
                  />
                </Box>
              </Box>
            )}
          </Box>
        </Container>
      </Box>
  );
};
