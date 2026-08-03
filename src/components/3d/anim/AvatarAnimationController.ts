import { useEffect, useRef } from 'react';
import { useAnimations } from '@react-three/drei';
import * as THREE from 'three';

export type AvatarAnimationState = 
  | 'idle' 
  | 'confident' 
  | 'celebration' 
  | 'holdingShirt' 
  | 'holdingTrophy' 
  | 'wave';

export function useAvatarAnimation(
  animations: THREE.AnimationClip[], 
  ref: React.MutableRefObject<THREE.Group | null>,
  currentState: AvatarAnimationState
) {
  const { actions, mixer } = useAnimations(animations, ref);
  const prevStateRef = useRef<AvatarAnimationState | null>(null);

  useEffect(() => {
    if (!actions || Object.keys(actions).length === 0) return;

    let targetActionName = currentState;
    let bestMatchKey: string | undefined;

    // 1. Exact match
    if (actions[targetActionName]) {
      bestMatchKey = targetActionName;
    } else {
      // 2. Case-insensitive or Mixamo fallback
      const lowerTarget = targetActionName.toLowerCase();
      const availableKeys = Object.keys(actions);
      
      bestMatchKey = availableKeys.find(key => {
        const lowerKey = key.toLowerCase();
        if (lowerTarget === 'idle' && (lowerKey.includes('idle') || lowerKey.includes('mixamo.com'))) {
          return true;
        }
        return lowerKey.includes(lowerTarget);
      });

      // 3. Fallback to the first animation if requesting idle and there is at least one
      if (!bestMatchKey && lowerTarget === 'idle' && availableKeys.length > 0) {
        bestMatchKey = availableKeys[0];
      }
    }

    if (!bestMatchKey || !actions[bestMatchKey]) {
      return;
    }

    const currentAction = actions[bestMatchKey];
    const prevAction = prevStateRef.current && actions[prevStateRef.current] 
      ? actions[prevStateRef.current] 
      : null;

    if (currentAction) {
      if (prevAction && prevAction !== currentAction) {
        currentAction.reset().fadeIn(0.5).play();
        prevAction.fadeOut(0.5);
      } else {
        currentAction.reset().play();
      }
      prevStateRef.current = bestMatchKey as AvatarAnimationState;
    }

    return () => {
      // Cleanup is handled by useAnimations, but we could stop actions here if needed
    };
  }, [actions, currentState]);

  return { actions, mixer };
}
