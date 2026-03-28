'use client';

import React from 'react';
import {
  AnimatedNumber,
  Box,
  Button,
  DirectionProvider,
  Flex,
  Grid,
  useAnimatedNumber,
  useAnimatedNumberValue,
} from '@editora/ui-react/client';
import { ShowcaseCard, ShowcaseShell, eyebrowStyle, hintStyle, stageStyle } from '../showcase/shared';

export default function HooksPage() {
  const [hookEndValue, setHookEndValue] = React.useState(4200);

  const animatedCounter = useAnimatedNumber({
    initialValue: 1200,
    duration: 700,
    variant: 'digital',
    format: 'number',
  });

  const hookTween = useAnimatedNumberValue({
    end: hookEndValue,
    duration: 900,
  });

  return (
    <DirectionProvider dir="ltr">
      <ShowcaseShell
        currentHref="/hooks"
        eyebrow="Hooks"
        title="Animated number hooks"
        description="The client barrel exports two hooks alongside the component wrappers. This route isolates them so you can verify both APIs behave the way you expect."
      >
        <Grid
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 18,
            justifyItems: 'stretch',
            alignItems: 'start',
          }}
        >
          <ShowcaseCard
            eyebrow="Hook API"
            title="useAnimatedNumber"
            description="This hook exposes a host ref plus imperative controls for the animated number wrapper."
          >
            <Box style={stageStyle}>
              <Box style={eyebrowStyle}>Digital counter</Box>
              <AnimatedNumber ref={animatedCounter.ref} value={animatedCounter.value} variant="digital" animate />
              <Box style={hintStyle}>
                Current value: <strong>{Math.round(animatedCounter.value)}</strong>
              </Box>
              <Flex style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <Button recipe="outline" onClick={() => animatedCounter.decrement(75)}>
                  -75
                </Button>
                <Button onClick={() => animatedCounter.increment(125)}>+125</Button>
                <Button recipe="ghost" onClick={() => animatedCounter.reset()}>
                  Reset
                </Button>
              </Flex>
            </Box>
          </ShowcaseCard>

          <ShowcaseCard
            eyebrow="Hook API"
            title="useAnimatedNumberValue"
            description="This hook owns tween state directly and lets you start, reset, or stop the animation from React."
          >
            <Box style={stageStyle}>
              <Box style={eyebrowStyle}>Tweened value</Box>
              <AnimatedNumber
                value={hookTween.value}
                variant="inline"
                animate
                format="number"
                duration={900}
              />
              <Box style={hintStyle}>
                Target: <strong>{hookEndValue}</strong> / animating: <strong>{hookTween.isAnimating ? 'yes' : 'no'}</strong>
              </Box>
              <Flex style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <Button
                  recipe="outline"
                  onClick={() => {
                    const next = hookEndValue + 600;
                    setHookEndValue(next);
                    hookTween.start(next);
                  }}
                >
                  Increase target
                </Button>
                <Button
                  onClick={() => {
                    const next = Math.max(0, hookEndValue - 450);
                    setHookEndValue(next);
                    hookTween.start(next);
                  }}
                >
                  Decrease target
                </Button>
                <Button recipe="ghost" onClick={() => hookTween.stop()}>
                  Stop
                </Button>
              </Flex>
            </Box>
          </ShowcaseCard>
        </Grid>
      </ShowcaseShell>
    </DirectionProvider>
  );
}
