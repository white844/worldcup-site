import { C } from "../tokens";

export default function PulseDot({ size = 8 }) {
  return (
    <span style={{ display:"inline-block", width:size, height:size, borderRadius:"50%", background:C.live, flexShrink:0, position:"relative" }}>
      <span style={{ position:"absolute", inset:-3, borderRadius:"50%", background:C.liveGlow, animation:"wc26-pulse 1.8s ease-in-out infinite" }} />
    </span>
  );
}
