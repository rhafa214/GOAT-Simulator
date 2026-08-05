import React from 'react';
import { ClubAppearanceProvider, ClubAppearanceProviderProps } from './ClubAppearanceProvider';

/**
 * AvatarAppearance is the root component for the GOAT Identity System architecture.
 * It wraps its children (usually the avatar model) with the necessary context providers
 * that resolve kits and load materials dynamically based on the clubId and kit requirements.
 */
export const AvatarAppearance: React.FC<ClubAppearanceProviderProps> = ({ 
  clubId, 
  kitType, 
  season, 
  children 
}) => {
  return (
    <ClubAppearanceProvider clubId={clubId} kitType={kitType} season={season}>
      {children}
    </ClubAppearanceProvider>
  );
};
