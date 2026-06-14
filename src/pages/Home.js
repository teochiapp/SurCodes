import React, { useRef, useEffect, useMemo } from 'react'
import styled from 'styled-components'
import { motion, MotionConfig } from 'framer-motion'
import { useScrollOptimization, useOptimizedInView } from '../hooks/useScrollOptimization'
import Hero from '../components/hero/hero'
import Services from '../components/services/services.backup'
import Portfolio from '../components/portfolio/portfolio'
import Team from '../components/team/Team'
import TeamMobile from '../components/team/TeamMobile';
import Blog from '../components/blog/blog'
import Contact from '../components/contact/contact'
import Skills from '../components/skills/skills'
import Footer from './Footer';

// Detectar navegador de Instagram / WebView limitado para simplificar animaciones
const detectLimitedWebView = () => {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent || '';
  return /Instagram|FBAN|FBAV|FB_IAB|wv/i.test(ua) ||
    (!/Safari/.test(ua) && /AppleWebKit/.test(ua) && /Mobile/.test(ua));
};

const Home = () => {
  useScrollOptimization();

  // Detectar WebView limitado (Instagram, etc.) una sola vez
  const isLimited = useMemo(() => detectLimitedWebView(), []);

  // Refs para detectar cuando cada componente está en viewport
  const servicesRef = useRef(null);
  const teamRef = useRef(null);
  const blogRef = useRef(null);
  const portfolioRef = useRef(null);
  const contactRef = useRef(null);
  const skillsRef = useRef(null);
  const footerRef = useRef(null);

  // Hooks de visibilidad — en WebViews limitados retornan true de inmediato
  const isServicesInView = useOptimizedInView(servicesRef);
  const isTeamInView = useOptimizedInView(teamRef);
  const isBlogInView = useOptimizedInView(blogRef);
  const isPortfolioInView = useOptimizedInView(portfolioRef);
  const isContactInView = useOptimizedInView(contactRef);
  const isSkillsInView = useOptimizedInView(skillsRef);
  const isFooterInView = useOptimizedInView(footerRef);

  // Scroll inicial a anchor
  useEffect(() => {
    if (window.location.hash) {
      setTimeout(() => {
        const id = window.location.hash.substring(1);
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 500);
    }
  }, []);

  // En WebViews limitados usamos transición CSS pura (más fluida y confiable)
  const sectionVariants = isLimited
    ? { initial: {}, animate: {} } // Sin animación framer-motion; CSS se encarga
    : {
        initial: { opacity: 0, y: 15 },
        animate: { opacity: 1, y: 0 },
      };

  const scaleVariants = isLimited
    ? { initial: {}, animate: {} }
    : {
        initial: { opacity: 0, scale: 0.98 },
        animate: { opacity: 1, scale: 1 },
      };

  return (
    <MotionConfig
      transition={{
        type: "tween",
        ease: "easeOut",
        duration: isLimited ? 0.25 : 0.35,
      }}
      reducedMotion="user"
    >
      <HomeContainer>
        <Hero />

        <motion.div
          ref={servicesRef}
          data-motion-section
          layout={false}
          {...sectionVariants}
          animate={isServicesInView ? sectionVariants.animate : sectionVariants.initial}
          className={isServicesInView ? 'animation-complete' : ''}
        >
          <Services />
        </motion.div>

        <motion.div
          ref={portfolioRef}
          data-motion-section
          layout={false}
          {...sectionVariants}
          animate={isPortfolioInView ? sectionVariants.animate : sectionVariants.initial}
          className={isPortfolioInView ? 'animation-complete' : ''}
        >
          <Portfolio />
        </motion.div>

        <motion.div
          ref={skillsRef}
          data-motion-section
          layout={false}
          {...sectionVariants}
          animate={isSkillsInView ? sectionVariants.animate : sectionVariants.initial}
          className={isSkillsInView ? 'animation-complete' : ''}
        >
          <Skills />
        </motion.div>

        <motion.div
          ref={teamRef}
          data-motion-section
          layout={false}
          {...scaleVariants}
          animate={isTeamInView ? scaleVariants.animate : scaleVariants.initial}
          className={isTeamInView ? 'animation-complete' : ''}
        >
          <div className="team-mobile">
            <TeamMobile />
          </div>
          <div className="team-desktop">
            <Team />
          </div>
        </motion.div>

        <motion.div
          ref={blogRef}
          data-motion-section
          layout={false}
          {...sectionVariants}
          animate={isBlogInView ? sectionVariants.animate : sectionVariants.initial}
          className={isBlogInView ? 'animation-complete' : ''}
        >
          <Blog />
        </motion.div>

        <motion.div
          ref={contactRef}
          data-motion-section
          layout={false}
          {...sectionVariants}
          animate={isContactInView ? sectionVariants.animate : sectionVariants.initial}
          className={isContactInView ? 'animation-complete' : ''}
        >
          <Contact />
        </motion.div>

        <motion.div
          ref={footerRef}
          data-motion-section
          layout={false}
          initial={isLimited ? {} : { opacity: 0 }}
          animate={isFooterInView ? { opacity: 1 } : (isLimited ? {} : { opacity: 0 })}
          className={isFooterInView ? 'animation-complete' : ''}
        >
          <Footer />
        </motion.div>
      </HomeContainer>
    </MotionConfig>
  );
};

export default Home

const HomeContainer = styled.main`
  min-height: 100vh;
  background-color: var(--background-color, #0A0A0A);
  color: var(--text-color, #E6E6E6);
  display: flex;
  flex-direction: column;
  width: 100%;

  .team-mobile {
    display: none;
    
    @media (max-width: 767px) {
      display: block;
    }
  }

  .team-desktop {
    display: block;
    
    @media (max-width: 767px) {
      display: none;
    }
  }
`;