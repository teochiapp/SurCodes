import React from 'react';
import styled from 'styled-components';

const PersonSelector = ({ people, currentIndex, onSelect }) => {
  return (
    <SelectorContainer>
      <PeopleGrid>
        {people.map((person, index) => (
          <PersonItem
            key={index}
            $isActive={index === currentIndex}
            onClick={() => onSelect(index)}
          >
            <AvatarWrapper $isActive={index === currentIndex}>
              <PersonAvatar
                src={person.image}
                alt={person.name}
                style={person.avatarStyle || {}}
              />
              <PersonName>{person.surname}</PersonName>
            </AvatarWrapper>
          </PersonItem>
        ))}
      </PeopleGrid>
    </SelectorContainer>
  );
};

const SelectorContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  width: 100%;
  height: max-content;
  background: transparent;
`;

const PeopleGrid = styled.div`
    display: flex;
    flex-direction: column;
    gap: 2px;
    flex: 1;
    justify-content: center;
    padding: 10px 0;
    background: radial-gradient(black, transparent);
    border: 0.5px solid var(--primary-color);
    border-radius: 13px;
`;

const PersonItem = styled.div`
  display: flex;
  justify-content: center;
  padding: 5px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  &:hover {
    background: rgba(var(--primary-color-rgb), 0.05);
    transform: translateX(3px);
  }
`;

const AvatarWrapper = styled.div`
  position: relative;
  width: 90px;
  height: 120px;
  border-radius: 12px;
  overflow: hidden;
  flex-shrink: 0;
  box-shadow: ${props =>
    props.$isActive
      ? '0 0 0 2px var(--secondary-color), 0 4px 16px rgba(0,0,0,0.6)'
      : '0 2px 10px rgba(0,0,0,0.45)'};
  transition: box-shadow 0.3s ease;
`;

const PersonAvatar = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;
  display: block;
`;

const PersonName = styled.span`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 18px 6px 5px;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.82) 0%,
    rgba(0, 0, 0, 0.45) 60%,
    transparent 100%
  );
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  color: #fff;
  text-align: center;
  text-shadow:
    0 1px 4px rgba(0,0,0,0.9),
    0 0 8px rgba(0,0,0,0.6);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export default PersonSelector; 