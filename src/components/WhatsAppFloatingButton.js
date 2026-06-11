import React from 'react';
import styled, { keyframes } from 'styled-components';
import { FaWhatsapp } from 'react-icons/fa';
import { useLanguage } from '../contexts/LanguageContext';

const WhatsAppFloatingButton = () => {
  const { t } = useLanguage();

  const message = t(
    'whatsapp.message',
    'Hola SurCodes! Quiero empezar a crear mi pagina web'
  );

  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/5493564361590?text=${encodedMessage}`;

  return (
    <FloatingContainer
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contact on WhatsApp"
    >
      <PulseEffect />
      <IconWrapper>
        <FaWhatsapp />
      </IconWrapper>
      <TooltipText>{t('whatsapp.tooltip', '¿Hablamos?')}</TooltipText>
    </FloatingContainer>
  );
};

export default WhatsAppFloatingButton;

const pulse = keyframes`
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.7);
  }
  70% {
    transform: scale(1);
    box-shadow: 0 0 0 15px rgba(37, 211, 102, 0);
  }
  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(37, 211, 102, 0);
  }
`;

const slideIn = keyframes`
  from {
    transform: translateY(100px) scale(0.8);
    opacity: 0;
  }
  to {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
`;

const TooltipText = styled.span`
  visibility: hidden;
  width: 140px;
  background-color: #121f3d;
  color: #fff;
  text-align: center;
  border-radius: 8px;
  padding: 6px 10px;
  position: absolute;
  z-index: 1;
  right: 75px;
  top: 50%;
  transform: translateY(-50%);
  opacity: 0;
  transition: opacity 0.3s, visibility 0.3s;
  font-family: var(--text-font, 'Space Grotesk', sans-serif);
  font-size: 0.85rem;
  font-weight: 500;
  border: 1px solid rgba(13, 211, 250, 0.2);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);

  &::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 100%;
    margin-top: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: transparent transparent transparent #121f3d;
  }
`;

const FloatingContainer = styled.a`
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 60px;
  height: 60px;
  background-color: #25D366;
  color: white;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2.2rem;
  box-shadow: 0 4px 15px rgba(37, 211, 102, 0.4);
  z-index: 1900;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  animation: ${slideIn} 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) both;

  &:hover {
    background-color: #20ba5a;
    transform: scale(1.1);
    box-shadow: 0 8px 25px rgba(37, 211, 102, 0.6);
  }

  &:hover ${TooltipText} {
    visibility: visible;
    opacity: 1;
  }

  @media (max-width: 768px) {
    bottom: 20px;
    right: 20px;
    width: 50px;
    height: 50px;
    font-size: 1.8rem;
  }
`;

const PulseEffect = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: #25D366;
  z-index: -1;
  animation: ${pulse} 2s infinite;
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`;
