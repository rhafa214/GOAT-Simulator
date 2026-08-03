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

    // Determine the target action. If the requested animation doesn't exist, fallback to 'idle'
    let targetActionName = currentState;
    if (!actions[targetActionName]) {
      targetActionName = 'idle';
    }

    const currentAction = actions[targetActionName];
    const prevAction = prevStateRef.current ? actions[prevStateRef.current] : null;

    if (currentAction) {
      if (prevAction && prevAction !== currentAction) {
        currentAction.reset().fadeIn(0.5).play();
        prevAction.fadeOut(0.5);
      } else {
        currentAction.reset().play();
      }
      prevStateRef.current = targetActionName as AvatarAnimationState;
    }

    return () => {
      // Cleanup is handled by useAnimations, but we could stop actions here if needed
    };
  }, [actions, currentState]);

  return { actions, mixer };
}
