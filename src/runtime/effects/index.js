import { ascii } from "./ascii.js";
import { box } from "./box.js";
import { color } from "./color.js";
import { dotgrid } from "./dotgrid.js";
import { fisheye } from "./fisheye.js";
import { fontCycle } from "./fontCycle.js";
import { glow } from "./glow.js";
import { magnetic } from "./magnetic.js";
import { scale } from "./scale.js";
import { sound } from "./sound.js";
import { register } from "../registry.js";

export function registerBuiltins() {
  register("color", color);
  register("glow", glow);
  register("box", box);
  register("magnetic", magnetic);
  register("scale", scale);
  register("sound", sound);
  register("fontCycle", fontCycle);
  register("ascii", ascii);
  register("dotgrid", dotgrid);
  register("fisheye", fisheye);
}
