import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {AgentDispatch} from './scene';

const RemotionRoot: React.FC = () => (
  <Composition
    id="AgentDispatch"
    component={AgentDispatch}
    width={1920}
    height={1080}
    fps={30}
    durationInFrames={171}
  />
);

registerRoot(RemotionRoot);
