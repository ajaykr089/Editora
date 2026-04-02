import type { IconDefinition, IconNode } from "./types";

const LEGACY_ICON_VIEWBOX = "0 0 15 15";
const DEFAULT_ICON_VIEWBOX = "0 0 24 24";
const LEGACY_TO_DEFAULT_SCALE = 24 / 15;

function node(
  tag: IconNode["tag"],
  attrs?: IconNode["attrs"],
  children?: IconNode["children"],
): IconNode {
  return children ? { tag, attrs, children } : { tag, attrs };
}

function p(d: string, attrs?: IconNode["attrs"]): IconNode {
  return node("path", { d, ...attrs });
}

function fp(d: string, attrs?: IconNode["attrs"]): IconNode {
  return node("path", { d, fill: "currentColor", stroke: "none", ...attrs });
}

function l(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  attrs?: IconNode["attrs"],
): IconNode {
  return node("line", { x1, y1, x2, y2, ...attrs });
}

function c(
  cx: number,
  cy: number,
  r: number,
  attrs?: IconNode["attrs"],
): IconNode {
  return node("circle", { cx, cy, r, ...attrs });
}

function r(
  x: number,
  y: number,
  width: number,
  height: number,
  attrs?: IconNode["attrs"],
): IconNode {
  return node("rect", { x, y, width, height, ...attrs });
}

function polyline(points: string, attrs?: IconNode["attrs"]): IconNode {
  return node("polyline", { points, ...attrs });
}

function polygon(points: string, attrs?: IconNode["attrs"]): IconNode {
  return node("polygon", { points, ...attrs });
}

function scaleLegacyNodes(nodes: IconNode[], viewBox?: string): IconNode[] {
  if (viewBox && viewBox !== LEGACY_ICON_VIEWBOX) return nodes;

  return [
    node("g", { transform: `scale(${LEGACY_TO_DEFAULT_SCALE})` }, nodes),
  ];
}

function icon(
  name: string,
  outline: IconNode[],
  options?: {
    solid?: IconNode[];
    duotone?: IconNode[];
    viewBox?: string;
    aliases?: string[];
    rtlMirror?: boolean;
    tags?: string[];
    categories?: string[];
  },
): IconDefinition {
  const viewBox = options?.viewBox ?? DEFAULT_ICON_VIEWBOX;

  return {
    name,
    viewBox,
    aliases: options?.aliases,
    rtlMirror: options?.rtlMirror,
    tags: options?.tags,
    categories: options?.categories,
    variants: {
      outline: { nodes: scaleLegacyNodes(outline, options?.viewBox) },
      solid: options?.solid
        ? { nodes: scaleLegacyNodes(options.solid, options?.viewBox) }
        : undefined,
      duotone: options?.duotone
        ? { nodes: scaleLegacyNodes(options.duotone, options?.viewBox) }
        : undefined,
    },
  };
}

const commonTags = {
  navigation: ["navigation", "arrow"],
  actions: ["action", "command"],
  media: ["media"],
  status: ["status"],
  files: ["file"],
  users: ["user"],
};

export const iconDefinitions: IconDefinition[] = [
  icon("check", [p("M3.75 7.75 6.5 10.5 11.5 5.5")], {
    solid: [
      p(
        "M5.93 10.94a.75.75 0 0 1-1.06 0L2.85 8.9a.75.75 0 0 1 1.06-1.06l1.49 1.49 4.7-4.7a.75.75 0 0 1 1.06 1.06z",
        { fill: "currentColor", stroke: "none" },
      ),
    ],
    aliases: ["tick", "done"],
  }),
  icon("x", [l(4, 4, 11, 11), l(11, 4, 4, 11)], {
    solid: [
      p(
        "M4.53 3.47a.75.75 0 0 0-1.06 1.06L5.94 7 3.47 9.47a.75.75 0 1 0 1.06 1.06L7 8.06l2.47 2.47a.75.75 0 1 0 1.06-1.06L8.06 7l2.47-2.47a.75.75 0 1 0-1.06-1.06L7 5.94z",
        { fill: "currentColor", stroke: "none" },
      ),
    ],
    aliases: ["close", "cancel"],
  }),
  icon("plus", [l(7.5, 3, 7.5, 12), l(3, 7.5, 12, 7.5)], {
    aliases: ["add", "create"],
  }),
  icon("minus", [l(3, 7.5, 12, 7.5)], { aliases: ["remove", "subtract"] }),
  icon("dot", [c(7.5, 7.5, 1.4, { fill: "currentColor", stroke: "none" })]),
  icon("circle", [c(7.5, 7.5, 4.5)], {
    solid: [c(7.5, 7.5, 4.5, { fill: "currentColor", stroke: "none" })],
  }),
  icon("square", [r(3.5, 3.5, 8, 8, { rx: 1.2 })], {
    solid: [
      r(3.25, 3.25, 8.5, 8.5, {
        rx: 1.25,
        fill: "currentColor",
        stroke: "none",
      }),
    ],
  }),
  icon("diamond", [polygon("7.5,2.8 12.2,7.5 7.5,12.2 2.8,7.5")], {
    solid: [
      polygon("7.5,2.4 12.6,7.5 7.5,12.6 2.4,7.5", {
        fill: "currentColor",
        stroke: "none",
      }),
    ],
  }),

  icon("chevron-down", [polyline("4.25 6 7.5 9.25 10.75 6")], {
    aliases: ["down"],
    rtlMirror: false,
    tags: commonTags.navigation,
  }),
  icon("chevron-up", [polyline("4.25 9 7.5 5.75 10.75 9")], {
    aliases: ["up"],
    tags: commonTags.navigation,
  }),
  icon("chevron-left", [polyline("9 4.25 5.75 7.5 9 10.75")], {
    aliases: ["left"],
    rtlMirror: true,
    tags: commonTags.navigation,
  }),
  icon("chevron-right", [polyline("6 4.25 9.25 7.5 6 10.75")], {
    aliases: ["right"],
    rtlMirror: true,
    tags: commonTags.navigation,
  }),
  icon(
    "chevrons-down",
    [
      polyline("4.25 4.75 7.5 8 10.75 4.75"),
      polyline("4.25 8 7.5 11.25 10.75 8"),
    ],
    { tags: commonTags.navigation },
  ),
  icon(
    "chevrons-up",
    [
      polyline("4.25 10.25 7.5 7 10.75 10.25"),
      polyline("4.25 7 7.5 3.75 10.75 7"),
    ],
    { tags: commonTags.navigation },
  ),
  icon(
    "chevrons-left",
    [
      polyline("10.25 4.25 7 7.5 10.25 10.75"),
      polyline("7 4.25 3.75 7.5 7 10.75"),
    ],
    { rtlMirror: true, tags: commonTags.navigation },
  ),
  icon(
    "chevrons-right",
    [
      polyline("4.75 4.25 8 7.5 4.75 10.75"),
      polyline("8 4.25 11.25 7.5 8 10.75"),
    ],
    { rtlMirror: true, tags: commonTags.navigation },
  ),

  icon("caret-down", [
    polygon("4.5 6 10.5 6 7.5 10", { fill: "currentColor", stroke: "none" }),
  ]),
  icon("caret-up", [
    polygon("4.5 9 10.5 9 7.5 5", { fill: "currentColor", stroke: "none" }),
  ]),
  icon(
    "caret-left",
    [polygon("9 4.5 9 10.5 5 7.5", { fill: "currentColor", stroke: "none" })],
    { rtlMirror: true },
  ),
  icon(
    "caret-right",
    [polygon("6 4.5 6 10.5 10 7.5", { fill: "currentColor", stroke: "none" })],
    { rtlMirror: true },
  ),

  icon(
    "arrow-up",
    [l(7.5, 11.5, 7.5, 3.5), polyline("4.5 6.5 7.5 3.5 10.5 6.5")],
    { tags: commonTags.navigation },
  ),
  icon(
    "arrow-down",
    [l(7.5, 3.5, 7.5, 11.5), polyline("4.5 8.5 7.5 11.5 10.5 8.5")],
    { tags: commonTags.navigation },
  ),
  icon(
    "arrow-left",
    [l(11.5, 7.5, 3.5, 7.5), polyline("6.5 4.5 3.5 7.5 6.5 10.5")],
    { rtlMirror: true, tags: commonTags.navigation },
  ),
  icon(
    "arrow-right",
    [l(3.5, 7.5, 11.5, 7.5), polyline("8.5 4.5 11.5 7.5 8.5 10.5")],
    { rtlMirror: true, tags: commonTags.navigation },
  ),
  icon("arrow-up-right", [l(4, 11, 11, 4), polyline("7.5 4 11 4 11 7.5")], {
    tags: commonTags.navigation,
  }),
  icon("arrow-up-left", [l(11, 11, 4, 4), polyline("7.5 4 4 4 4 7.5")], {
    rtlMirror: true,
    tags: commonTags.navigation,
  }),
  icon("arrow-down-right", [l(4, 4, 11, 11), polyline("7.5 11 11 11 11 7.5")], {
    tags: commonTags.navigation,
  }),
  icon("arrow-down-left", [l(11, 4, 4, 11), polyline("7.5 11 4 11 4 7.5")], {
    rtlMirror: true,
    tags: commonTags.navigation,
  }),
  icon(
    "external-link",
    [
      r(3.25, 5.5, 6.25, 6.25, { rx: 1 }),
      l(7.25, 3.25, 11.75, 3.25),
      l(11.75, 3.25, 11.75, 7.75),
      l(11.75, 3.25, 7.75, 7.25),
    ],
    { aliases: ["open-in-new"] },
  ),

  icon("menu", [l(3, 4.5, 12, 4.5), l(3, 7.5, 12, 7.5), l(3, 10.5, 12, 10.5)], {
    aliases: ["hamburger", "menu-alt"],
  }),
  icon("more-horizontal", [c(4.25, 7.5, 1), c(7.5, 7.5, 1), c(10.75, 7.5, 1)], {
    aliases: ["ellipsis-horizontal", "menu-horizontal"],
  }),
  icon("more-vertical", [c(7.5, 4.25, 1), c(7.5, 7.5, 1), c(7.5, 10.75, 1)], {
    aliases: ["ellipsis-vertical", "menu-vertical"],
  }),

  icon("search", [c(6.5, 6.5, 3.75), l(9.5, 9.5, 12, 12)], {
    aliases: ["magnifier"],
  }),
  icon(
    "search-plus",
    [
      c(6.2, 6.2, 3.4),
      l(8.7, 8.7, 11.2, 11.2),
      l(11.35, 5.1, 11.35, 7.7),
      l(10.05, 6.4, 12.65, 6.4),
    ],
    {
      aliases: ["zoom-in"],
    },
  ),
  icon(
    "search-minus",
    [c(6.2, 6.2, 3.4), l(8.7, 8.7, 11.2, 11.2), l(10.05, 6.4, 12.65, 6.4)],
    {
      aliases: ["zoom-out"],
    },
  ),
  icon(
    "filter",
    [polygon("2.75,3.5 12.25,3.5 8.75,7.5 8.75,11.5 6.25,10.25 6.25,7.5")],
    {
      solid: [
        polygon("2.2,3 12.8,3 8.9,7.5 8.9,12 6.1,10.55 6.1,7.5", {
          fill: "currentColor",
          stroke: "none",
        }),
      ],
      aliases: ["filter-alt"],
    },
  ),
  icon(
    "sort",
    [
      l(5, 3.2, 5, 11.8),
      polyline("3.4 4.8 5 3.2 6.6 4.8"),
      l(10, 11.8, 10, 3.2),
      polyline("8.4 10.2 10 11.8 11.6 10.2"),
    ],
    {
      aliases: ["arrange"],
    },
  ),
  icon("sort-asc", [
    l(4.2, 3.3, 4.2, 11.7),
    polyline("2.8 4.7 4.2 3.3 5.6 4.7"),
    l(8, 4.2, 11.7, 4.2),
    l(8, 7, 10.7, 7),
    l(8, 9.8, 9.7, 9.8),
  ]),
  icon("sort-desc", [
    l(4.2, 11.7, 4.2, 3.3),
    polyline("2.8 10.3 4.2 11.7 5.6 10.3"),
    l(8, 4.2, 9.7, 4.2),
    l(8, 7, 10.7, 7),
    l(8, 9.8, 11.7, 9.8),
  ]),
  icon(
    "sliders",
    [
      l(3, 4, 12, 4),
      c(6, 4, 1.1, { fill: "currentColor", stroke: "none" }),
      l(3, 7.5, 12, 7.5),
      c(9.5, 7.5, 1.1, { fill: "currentColor", stroke: "none" }),
      l(3, 11, 12, 11),
      c(5, 11, 1.1, { fill: "currentColor", stroke: "none" }),
    ],
    {
      aliases: ["slider"],
    },
  ),
  icon(
    "settings",
    [
      c(7.5, 7.5, 2.1),
      l(7.5, 2.8, 7.5, 4.1),
      l(7.5, 10.9, 7.5, 12.2),
      l(2.8, 7.5, 4.1, 7.5),
      l(10.9, 7.5, 12.2, 7.5),
      l(4.15, 4.15, 5.05, 5.05),
      l(9.95, 9.95, 10.85, 10.85),
      l(10.85, 4.15, 9.95, 5.05),
      l(5.05, 9.95, 4.15, 10.85),
    ],
    {
      aliases: ["cog", "settings-2", "settings-3"],
    },
  ),

  icon(
    "home",
    [
      p("M2.75 6.75 7.5 3.25 12.25 6.75"),
      p("M4.25 6.5v5h6.5v-5"),
      r(6.4, 8.1, 2.2, 3.4, { rx: 0.55 }),
    ],
    {
      solid: [
        p(
          "M2.2 6.6 7.5 2.65 12.8 6.6v5.65a1 1 0 0 1-1 1h-2.1V9.4H5.3v3.85H3.2a1 1 0 0 1-1-1z",
          { fill: "currentColor", stroke: "none" },
        ),
      ],
      aliases: ["home-filled", "home-outline"],
      categories: ["navigation"],
    },
  ),
  icon(
    "dashboard",
    [
      r(2.75, 2.75, 4.2, 4.2, { rx: 0.8 }),
      r(8.05, 2.75, 4.2, 2.9, { rx: 0.8 }),
      r(8.05, 6.85, 4.2, 5.4, { rx: 0.8 }),
      r(2.75, 8.15, 4.2, 4.1, { rx: 0.8 }),
    ],
    {
      aliases: ["layout-dashboard", "dashboard-alt", "dashboard-analytics"],
      categories: ["navigation"],
    },
  ),
  icon(
    "app-grid",
    [
      r(3, 3, 2.4, 2.4, { rx: 0.4 }),
      r(6.3, 3, 2.4, 2.4, { rx: 0.4 }),
      r(9.6, 3, 2.4, 2.4, { rx: 0.4 }),
      r(3, 6.3, 2.4, 2.4, { rx: 0.4 }),
      r(6.3, 6.3, 2.4, 2.4, { rx: 0.4 }),
      r(9.6, 6.3, 2.4, 2.4, { rx: 0.4 }),
      r(3, 9.6, 2.4, 2.4, { rx: 0.4 }),
      r(6.3, 9.6, 2.4, 2.4, { rx: 0.4 }),
      r(9.6, 9.6, 2.4, 2.4, { rx: 0.4 }),
    ],
    {
      aliases: [
        "grid",
        "grid-2",
        "grid-3",
        "grid-4",
        "layout-grid",
        "grid-view",
      ],
      categories: ["navigation"],
    },
  ),
  icon(
    "layout",
    [
      r(2.75, 3, 9.5, 9, { rx: 1.1 }),
      l(6, 3.1, 6, 11.9),
      l(6.1, 7.3, 12.1, 7.3),
    ],
    {
      aliases: ["grid-layout"],
    },
  ),
  icon("layout-list", [
    r(2.75, 3, 9.5, 9, { rx: 1.1 }),
    l(5.2, 5.2, 10.8, 5.2),
    l(5.2, 7.5, 10.8, 7.5),
    l(5.2, 9.8, 10.8, 9.8),
  ]),
  icon("layout-sidebar", [
    r(2.75, 3, 9.5, 9, { rx: 1.1 }),
    l(5.35, 3.1, 5.35, 11.9),
  ]),
  icon("columns", [
    r(2.75, 3, 9.5, 9, { rx: 1.1 }),
    l(5.95, 3.1, 5.95, 11.9),
    l(9.05, 3.1, 9.05, 11.9),
  ]),
  icon("rows", [
    r(2.75, 3, 9.5, 9, { rx: 1.1 }),
    l(2.9, 6, 12.1, 6),
    l(2.9, 8.95, 12.1, 8.95),
  ]),
  icon("sidebar-left", [
    r(2.75, 3, 9.5, 9, { rx: 1.1 }),
    r(2.9, 3.1, 2.45, 8.8, { rx: 0.6 }),
  ]),
  icon("sidebar-right", [
    r(2.75, 3, 9.5, 9, { rx: 1.1 }),
    r(9.65, 3.1, 2.45, 8.8, { rx: 0.6 }),
  ]),
  icon("panel-left", [
    r(2.75, 3.2, 9.5, 8.6, { rx: 1.1 }),
    r(2.95, 3.4, 2.5, 8.2, { rx: 0.6 }),
  ]),
  icon("panel-right", [
    r(2.75, 3.2, 9.5, 8.6, { rx: 1.1 }),
    r(9.55, 3.4, 2.5, 8.2, { rx: 0.6 }),
  ]),
  icon("panel-top", [
    r(2.75, 3.2, 9.5, 8.6, { rx: 1.1 }),
    r(2.95, 3.4, 9.1, 2.45, { rx: 0.6 }),
  ]),
  icon("panel-bottom", [
    r(2.75, 3.2, 9.5, 8.6, { rx: 1.1 }),
    r(2.95, 9.15, 9.1, 2.45, { rx: 0.6 }),
  ]),
  icon("list-view", [
    c(3.6, 4.6, 0.6, { fill: "currentColor", stroke: "none" }),
    c(3.6, 7.5, 0.6, { fill: "currentColor", stroke: "none" }),
    c(3.6, 10.4, 0.6, { fill: "currentColor", stroke: "none" }),
    l(5.2, 4.6, 11.8, 4.6),
    l(5.2, 7.5, 11.8, 7.5),
    l(5.2, 10.4, 11.8, 10.4),
  ]),
  icon("table", [
    r(2.75, 3, 9.5, 9, { rx: 1 }),
    l(2.9, 6.1, 12.1, 6.1),
    l(2.9, 9.2, 12.1, 9.2),
    l(5.9, 3.1, 5.9, 11.9),
    l(9, 3.1, 9, 11.9),
  ]),
  icon("table-alt", [
    r(2.75, 3, 9.5, 9, { rx: 1 }),
    l(2.9, 5.9, 12.1, 5.9),
    l(2.9, 8.7, 12.1, 8.7),
    l(7.4, 3.1, 7.4, 11.9),
  ]),
  icon("columns-alt", [r(2.75, 3, 9.5, 9, { rx: 1 }), l(7.5, 3.1, 7.5, 11.9)]),
  icon("row", [r(2.75, 3, 9.5, 9, { rx: 1 }), l(2.9, 7.5, 12.1, 7.5)]),

  icon(
    "folder",
    [
      p(
        "M2.5 5.3a1.3 1.3 0 0 1 1.3-1.3h2.4l1.05 1.2h3.75a1.3 1.3 0 0 1 1.3 1.3v4.7a1.3 1.3 0 0 1-1.3 1.3H3.8a1.3 1.3 0 0 1-1.3-1.3z",
      ),
    ],
    {
      solid: [
        p(
          "M2 5.35A1.85 1.85 0 0 1 3.85 3.5h2.2l1.05 1.2h4.05A1.85 1.85 0 0 1 13 6.55v4.6A1.85 1.85 0 0 1 11.15 13H3.85A1.85 1.85 0 0 1 2 11.15z",
          { fill: "currentColor", stroke: "none" },
        ),
      ],
      categories: commonTags.files,
    },
  ),
  icon(
    "folder-open",
    [
      p(
        "M2.6 5.5a1.3 1.3 0 0 1 1.3-1.3h2.25l1.05 1.1h3.9a1.25 1.25 0 0 1 1.23 1.5l-.68 3.75a1.3 1.3 0 0 1-1.28 1.07H3.75a1.3 1.3 0 0 1-1.28-1.55z",
      ),
    ],
    { categories: commonTags.files },
  ),
  icon(
    "file",
    [
      p(
        "M4 2.75h4.5l2.5 2.5v6.95a1.3 1.3 0 0 1-1.3 1.3H4.3A1.3 1.3 0 0 1 3 12.2V4.05A1.3 1.3 0 0 1 4.3 2.75z",
      ),
      p("M8.5 2.9v2.35h2.35"),
    ],
    {
      aliases: [
        "file-text",
        "file-code",
        "file-image",
        "file-video",
        "file-audio",
        "file-pdf",
        "file-zip",
        "file-doc",
        "file-xls",
        "file-ppt",
      ],
      categories: commonTags.files,
    },
  ),
  icon("copy", [r(5, 5, 7, 7, { rx: 1 }), r(3, 3, 7, 7, { rx: 1 })], {
    aliases: ["duplicate"],
    categories: commonTags.files,
  }),
  icon(
    "clipboard",
    [r(3.5, 3.5, 8, 9, { rx: 1.2 }), r(5.3, 2.2, 4.4, 2.1, { rx: 0.8 })],
    { categories: commonTags.files },
  ),
  icon(
    "clipboard-check",
    [
      r(3.5, 3.5, 8, 9, { rx: 1.2 }),
      r(5.3, 2.2, 4.4, 2.1, { rx: 0.8 }),
      p("M5.6 8.2 6.7 9.3 9.2 6.8"),
    ],
    { categories: commonTags.files },
  ),
  icon(
    "paste",
    [
      r(4, 4.1, 7, 8.4, { rx: 1 }),
      r(5.2, 2.4, 4.6, 2.2, { rx: 0.8 }),
      l(9.7, 9.1, 11.8, 9.1),
      l(10.75, 8.1, 10.75, 10.1),
    ],
    { categories: commonTags.files },
  ),
  icon(
    "cut",
    [
      c(4.2, 10.2, 1.2),
      c(4.2, 4.2, 1.2),
      l(5.15, 5.05, 11.8, 11.8),
      l(5.15, 9.35, 11.8, 2.8),
    ],
    { categories: commonTags.files },
  ),
  icon(
    "save",
    [
      r(3, 2.8, 9, 9.7, { rx: 1 }),
      r(5.1, 2.8, 3.8, 3, { rx: 0.4 }),
      r(5, 8.5, 5, 2.8, { rx: 0.5 }),
    ],
    { aliases: ["save-alt"], categories: commonTags.files },
  ),
  icon(
    "trash",
    [
      p("M3.5 4h8"),
      p("M5.1 4V3h4.8v1"),
      p("M4.5 4l.5 7.25h5l.5-7.25"),
      l(6.3, 6, 6.3, 10),
      l(8.7, 6, 8.7, 10),
    ],
    {
      solid: [
        p(
          "M3.1 4.2h8.8l-.6 7.2a1.4 1.4 0 0 1-1.39 1.28H5.1A1.4 1.4 0 0 1 3.71 11.4zM5.3 2.8h4.4a.75.75 0 0 1 .75.75v.65H4.55v-.65a.75.75 0 0 1 .75-.75",
          { fill: "currentColor", stroke: "none" },
        ),
      ],
      aliases: ["delete", "trash-2", "delete-forever"],
    },
  ),
  icon(
    "edit",
    [
      r(2.8, 9.6, 5.1, 2.6, { rx: 0.8 }),
      p("M5.3 10.9 10.7 5.5l1.8 1.8-5.4 5.4-2.4.6z"),
    ],
    { aliases: ["pen"] },
  ),
  icon(
    "pencil",
    [p("M4 11.4 10.9 4.5l1.6 1.6-6.9 6.9-2.2.6z"), p("M9.9 3.5 11.5 5.1")],
    { aliases: ["edit-2"] },
  ),
  icon(
    "link",
    [
      p(
        "M5.5 8.9 4.3 10.1a2.25 2.25 0 1 1-3.2-3.2L2.3 5.7a2.25 2.25 0 0 1 3.2 0",
      ),
      p(
        "M9.5 6.1 10.7 4.9a2.25 2.25 0 0 1 3.2 3.2l-1.2 1.2a2.25 2.25 0 0 1-3.2 0",
      ),
      l(5.9, 9.1, 9.1, 5.9),
    ],
    { aliases: ["chain"] },
  ),
  icon(
    "unlink",
    [
      p("M5.4 9 4.2 10.2a2.25 2.25 0 1 1-3.18-3.18L2.2 5.8"),
      p("M9.6 6 10.8 4.8a2.25 2.25 0 1 1 3.18 3.18L12.8 9.2"),
      l(4.5, 4.5, 10.5, 10.5),
    ],
    { aliases: ["link-off"] },
  ),
  icon("share", [
    c(3.1, 7.5, 1),
    c(11.4, 4.2, 1),
    c(11.4, 10.8, 1),
    l(4, 7, 10.5, 4.7),
    l(4, 8, 10.5, 10.3),
  ]),
  icon("share-2", [
    c(3.4, 7.5, 0.9),
    c(11.2, 4.3, 0.9),
    c(11.2, 10.7, 0.9),
    polyline("4.2 7.05 10.2 4.8"),
    polyline("4.2 7.95 10.2 10.2"),
  ]),

  icon(
    "user",
    [c(7.5, 5.25, 2.25), p("M3.2 12c.8-1.95 2.4-3 4.3-3s3.5 1.05 4.3 3")],
    {
      aliases: ["profile", "account", "customer"],
      categories: commonTags.users,
    },
  ),
  icon(
    "users",
    [
      c(5.7, 5.3, 2),
      c(10, 6, 1.65),
      p("M2.6 11.8c.66-1.6 1.95-2.45 3.5-2.45 1.58 0 2.9.9 3.55 2.6"),
      p("M8.45 11.8c.43-1.07 1.24-1.73 2.25-1.73.95 0 1.75.58 2.2 1.55"),
    ],
    {
      aliases: ["users-group", "team"],
      categories: commonTags.users,
    },
  ),
  icon(
    "user-plus",
    [
      c(5.5, 5.3, 2),
      p("M2.6 11.8c.66-1.6 1.95-2.45 3.5-2.45 1.58 0 2.9.9 3.55 2.6"),
      l(10.5, 6.2, 10.5, 10.2),
      l(8.5, 8.2, 12.5, 8.2),
    ],
    {
      aliases: ["user-add"],
      categories: commonTags.users,
    },
  ),
  icon(
    "user-remove",
    [
      c(5.5, 5.3, 2),
      p("M2.6 11.8c.66-1.6 1.95-2.45 3.5-2.45 1.58 0 2.9.9 3.55 2.6"),
      l(8.6, 8.2, 12.4, 8.2),
    ],
    { categories: commonTags.users },
  ),
  icon(
    "user-check",
    [
      c(5.5, 5.3, 2),
      p("M2.6 11.8c.66-1.6 1.95-2.45 3.5-2.45 1.58 0 2.9.9 3.55 2.6"),
      p("M8.7 8.2 10.1 9.6 12.2 7.5"),
    ],
    { categories: commonTags.users },
  ),
  icon(
    "user-x",
    [
      c(5.5, 5.3, 2),
      p("M2.6 11.8c.66-1.6 1.95-2.45 3.5-2.45 1.58 0 2.9.9 3.55 2.6"),
      l(9, 7.1, 12.1, 10.2),
      l(12.1, 7.1, 9, 10.2),
    ],
    { categories: commonTags.users },
  ),

  icon(
    "bell",
    [
      p(
        "M7.5 2.8c-1.7 0-3.05 1.35-3.05 3.05v1.4c0 .68-.23 1.34-.65 1.88l-.8 1.04h8l-.8-1.04a3.05 3.05 0 0 1-.65-1.88v-1.4c0-1.7-1.35-3.05-3.05-3.05z",
      ),
      p("M6.1 11.2a1.4 1.4 0 0 0 2.8 0"),
    ],
    {
      solid: [
        p(
          "M7.5 2.5a3.4 3.4 0 0 0-3.4 3.4v1.35c0 .74-.25 1.46-.7 2.05l-.95 1.25h10.1l-.95-1.25c-.45-.59-.7-1.31-.7-2.05V5.9a3.4 3.4 0 0 0-3.4-3.4zm-1.55 9.3a1.55 1.55 0 0 0 3.1 0z",
          { fill: "currentColor", stroke: "none" },
        ),
      ],
      aliases: ["notification"],
    },
  ),
  icon(
    "bell-off",
    [
      p("M2.6 2.6 12.4 12.4"),
      p(
        "M4.45 4.45a3 3 0 0 1 5.1 2.15v1.5c0 .59.18 1.17.52 1.65l.68.95H4.2l.68-.95c.34-.48.52-1.06.52-1.65v-3.65",
      ),
      p("M6.2 11.2a1.35 1.35 0 0 0 2.6 0"),
    ],
    {
      aliases: ["notification-dot"],
    },
  ),
  icon(
    "mail",
    [r(2.5, 3.5, 10, 8, { rx: 1.1 }), polyline("3.2 4.5 7.5 8 11.8 4.5")],
    {
      aliases: ["mail-open", "mail-send", "message"],
    },
  ),
  icon("inbox", [
    r(2.7, 3.5, 9.6, 8.7, { rx: 1.2 }),
    p("M2.8 8h2.9l1.2 1.6h1.2L9.3 8h2.9"),
  ]),
  icon("archive", [
    r(2.7, 3.1, 9.6, 9.1, { rx: 1.1 }),
    l(2.8, 5.6, 12.2, 5.6),
    l(6.1, 8.2, 8.9, 8.2),
  ]),
  icon("phone", [
    p(
      "M4.25 2.8h1.6L6.55 5 5.3 6.25a8.4 8.4 0 0 0 3.45 3.45L10 8.45l2.2.7v1.6A1.25 1.25 0 0 1 10.95 12c-4.95 0-8.95-4-8.95-8.95A1.25 1.25 0 0 1 3.25 2.8",
    ),
  ]),
  icon(
    "map-pin",
    [
      p(
        "M7.5 12.3s3.8-3.38 3.8-5.85A3.8 3.8 0 0 0 3.7 6.45c0 2.47 3.8 5.85 3.8 5.85z",
      ),
      c(7.5, 6.45, 1.35),
    ],
    { aliases: ["pin", "location"] },
  ),
  icon("map", [
    polygon(
      "2.6,4.5 5.8,3.2 9.2,4.5 12.4,3.2 12.4,10.5 9.2,11.8 5.8,10.5 2.6,11.8",
    ),
    l(5.8, 3.2, 5.8, 10.5),
    l(9.2, 4.5, 9.2, 11.8),
  ]),
  icon("location-arrow", [
    polygon("3.2,3.2 12.1,7.4 8.2,8.3 7.3,12.2 3.2,3.2", {
      fill: "currentColor",
      stroke: "none",
    }),
  ]),
  icon(
    "compass",
    [
      c(7.5, 7.5, 4.8),
      polygon("6.1,6.1 10.4,4.6 8.9,8.9 4.6,10.4", { fill: "none" }),
      c(7.5, 7.5, 0.55, { fill: "currentColor", stroke: "none" }),
    ],
    {
      aliases: ["compass-alt"],
    },
  ),
  icon(
    "navigation",
    [polygon("7.5,2.8 11.8,12.2 7.5,10.3 3.2,12.2", { fill: "none" })],
    {
      aliases: ["gps", "nav", "navigation-icon"],
    },
  ),
  icon("route", [
    c(3.2, 4.1, 0.7, { fill: "currentColor", stroke: "none" }),
    c(11.8, 10.9, 0.7, { fill: "currentColor", stroke: "none" }),
    p("M3.9 4.1h3.3c2.2 0 2.4 2.6 4.6 2.6h.7"),
    p("M11.1 10.9H7.7c-2.2 0-2.4-2.6-4.6-2.6h-.7"),
  ]),
  icon("globe", [
    c(7.5, 7.5, 4.7),
    l(2.8, 7.5, 12.2, 7.5),
    p("M7.5 2.8c1.2 1.2 1.9 2.9 1.9 4.7s-.7 3.5-1.9 4.7"),
    p("M7.5 2.8c-1.2 1.2-1.9 2.9-1.9 4.7s.7 3.5 1.9 4.7"),
  ]),
  icon(
    "calendar",
    [
      r(2.7, 3.6, 9.6, 8.7, { rx: 1 }),
      l(5, 2.5, 5, 4.5),
      l(10, 2.5, 10, 4.5),
      l(2.7, 5.6, 12.3, 5.6),
      c(5.25, 8.3, 0.55, { fill: "currentColor", stroke: "none" }),
      c(7.5, 8.3, 0.55, { fill: "currentColor", stroke: "none" }),
      c(9.75, 8.3, 0.55, { fill: "currentColor", stroke: "none" }),
    ],
    {
      aliases: [
        "calendar-check",
        "calendar-plus",
        "calendar-minus",
        "calendar-event",
      ],
    },
  ),
  icon(
    "clock",
    [c(7.5, 7.5, 4.7), l(7.5, 7.5, 7.5, 5), l(7.5, 7.5, 9.2, 8.7)],
    {
      aliases: ["timer", "stopwatch", "watch"],
    },
  ),
  icon("alarm", [
    c(7.5, 8, 3.8),
    l(7.5, 8, 7.5, 6.2),
    l(7.5, 8, 9, 8.8),
    polyline("4.6 3.6 3.4 2.4 2.4 3.4"),
    polyline("10.4 3.6 11.6 2.4 12.6 3.4"),
  ]),
  icon("history", [
    c(7.7, 7.7, 4),
    l(7.7, 7.7, 7.7, 5.9),
    l(7.7, 7.7, 9.4, 8.8),
    polyline("2.9 7.7 2.9 4.9 5.7 4.9"),
  ]),
  icon("signal", [
    r(2.8, 9.8, 1.5, 2.2, { rx: 0.35, fill: "currentColor", stroke: "none" }),
    r(5.1, 8.1, 1.5, 3.9, { rx: 0.35, fill: "currentColor", stroke: "none" }),
    r(7.4, 6.4, 1.5, 5.6, { rx: 0.35, fill: "currentColor", stroke: "none" }),
    r(9.7, 4.7, 1.5, 7.3, { rx: 0.35, fill: "currentColor", stroke: "none" }),
  ]),
  icon(
    "battery",
    [
      r(2.8, 4.7, 8.8, 5.6, { rx: 1 }),
      r(11.8, 6.35, 0.95, 2.3, { rx: 0.35 }),
      r(3.4, 5.3, 4.2, 4.4, { rx: 0.4, fill: "currentColor", stroke: "none" }),
    ],
    {
      aliases: ["battery-half"],
    },
  ),
  icon("battery-full", [
    r(2.8, 4.7, 8.8, 5.6, { rx: 1 }),
    r(11.8, 6.35, 0.95, 2.3, { rx: 0.35 }),
    r(3.4, 5.3, 7.8, 4.4, { rx: 0.4, fill: "currentColor", stroke: "none" }),
  ]),
  icon("battery-low", [
    r(2.8, 4.7, 8.8, 5.6, { rx: 1 }),
    r(11.8, 6.35, 0.95, 2.3, { rx: 0.35 }),
    r(3.4, 5.3, 2, 4.4, { rx: 0.4, fill: "currentColor", stroke: "none" }),
  ]),
  icon("battery-charging", [
    r(2.8, 4.7, 8.8, 5.6, { rx: 1 }),
    r(11.8, 6.35, 0.95, 2.3, { rx: 0.35 }),
    polygon("7.2,5.3 5.6,7.6 7.1,7.6 6.4,9.7 8.8,6.8 7.4,6.8", {
      fill: "currentColor",
      stroke: "none",
    }),
  ]),
  icon("power", [l(7.5, 2.9, 7.5, 7.2), p("M4.55 4.25a4.2 4.2 0 1 0 5.9 0")]),
  icon("power-off", [
    l(7.5, 2.9, 7.5, 7.2),
    p("M4.55 4.25a4.2 4.2 0 1 0 5.9 0"),
    l(2.4, 2.4, 12.6, 12.6),
  ]),

  icon(
    "chart-bar",
    [
      l(3.25, 12, 11.75, 12),
      r(4, 8, 1.7, 4, { rx: 0.3 }),
      r(6.65, 6.5, 1.7, 5.5, { rx: 0.3 }),
      r(9.3, 5, 1.7, 7, { rx: 0.3 }),
    ],
    {
      aliases: ["chart", "analytics", "metrics"],
      categories: ["analytics"],
    },
  ),
  icon(
    "chart-line",
    [
      l(3, 12, 12, 12),
      polyline("3.5 9.5 5.8 7.6 7.3 8.6 10.8 5.4"),
      c(3.5, 9.5, 0.45, { fill: "currentColor", stroke: "none" }),
      c(5.8, 7.6, 0.45, { fill: "currentColor", stroke: "none" }),
      c(7.3, 8.6, 0.45, { fill: "currentColor", stroke: "none" }),
      c(10.8, 5.4, 0.45, { fill: "currentColor", stroke: "none" }),
    ],
    {
      aliases: ["graph"],
      categories: ["analytics"],
    },
  ),
  icon("chart-pie", [c(7.5, 7.5, 4.5), p("M7.5 3v4.5h4.5")], {
    solid: [
      p("M7.5 2.5a5 5 0 1 0 5 5h-5z", {
        fill: "currentColor",
        stroke: "none",
        tone: "secondary",
        opacity: 0.35,
      }),
      p("M8 2.5v4h4a5 5 0 0 0-4-4z", { fill: "currentColor", stroke: "none" }),
    ],
    duotone: [
      c(7.5, 7.5, 4.5, {
        fill: "currentColor",
        stroke: "none",
        tone: "secondary",
        opacity: 0.3,
      }),
      p("M7.5 3v4.5h4.5", { fill: "none" }),
    ],
    categories: ["analytics"],
  }),
  icon("activity", [polyline("2.8 8 5 8 6.2 5.2 8.1 10.8 9.6 7.4 12.2 7.4")]),
  icon(
    "trending-up",
    [
      polyline("3.5 9.5 6.2 6.8 8.2 8.8 11.5 5.5"),
      polyline("8.8 5.5 11.5 5.5 11.5 8.2"),
    ],
    { categories: ["analytics"] },
  ),
  icon(
    "trending-down",
    [
      polyline("3.5 5.5 6.2 8.2 8.2 6.2 11.5 9.5"),
      polyline("8.8 9.5 11.5 9.5 11.5 6.8"),
    ],
    { categories: ["analytics"] },
  ),

  icon(
    "star",
    [
      polygon(
        "7.5,2.55 8.95,5.5 12.2,5.97 9.85,8.26 10.4,11.45 7.5,9.93 4.6,11.45 5.15,8.26 2.8,5.97 6.05,5.5",
      ),
    ],
    {
      solid: [
        polygon(
          "7.5,2.2 9.1,5.45 12.7,5.98 10.1,8.52 10.72,12 7.5,10.3 4.28,12 4.9,8.52 2.3,5.98 5.9,5.45",
          { fill: "currentColor", stroke: "none" },
        ),
      ],
      aliases: ["favorite", "star-filled"],
    },
  ),
  icon(
    "heart",
    [
      p(
        "M7.5 11.9s-4.4-2.8-4.4-5.9A2.6 2.6 0 0 1 7.5 4.5 2.6 2.6 0 0 1 11.9 6c0 3.1-4.4 5.9-4.4 5.9z",
      ),
    ],
    {
      solid: [
        p(
          "M7.5 12.35s-4.9-3.1-4.9-6.45a3.1 3.1 0 0 1 5.3-2.2A3.1 3.1 0 0 1 12.4 5.9c0 3.35-4.9 6.45-4.9 6.45z",
          { fill: "currentColor", stroke: "none" },
        ),
      ],
      aliases: ["like", "heart-filled"],
    },
  ),
  icon(
    "bookmark",
    [
      p(
        "M4.2 2.8h6.6a.8.8 0 0 1 .8.8V12l-4.1-2.35L3.4 12V3.6a.8.8 0 0 1 .8-.8z",
      ),
    ],
    {
      solid: [
        p("M4 2.5h7a1 1 0 0 1 1 1v9.4l-4.5-2.55L3 12.9V3.5a1 1 0 0 1 1-1z", {
          fill: "currentColor",
          stroke: "none",
        }),
      ],
      aliases: ["bookmark-filled"],
    },
  ),
  icon("tag", [
    p(
      "M8.75 3h3.25v3.25l-5.35 5.35a1.1 1.1 0 0 1-1.56 0L3.4 9.9a1.1 1.1 0 0 1 0-1.56z",
    ),
    c(10.2, 4.8, 0.7, { fill: "currentColor", stroke: "none" }),
  ]),
  icon("flag", [p("M4 2.9v9.2"), p("M4.1 3.4h6.7l-1.3 2.2 1.3 2.2H4.1")], {
    solid: [
      p("M3.65 2.6h.7v10.9h-.7zM4.35 3h7.05l-1.35 2.25L11.4 7.5H4.35z", {
        fill: "currentColor",
        stroke: "none",
      }),
    ],
    aliases: ["flag-filled"],
  }),
  icon("tags", [
    p("M8.6 3h3.3v3.3L6.7 11.5a1 1 0 0 1-1.4 0L3.5 9.7a1 1 0 0 1 0-1.4z"),
    p("M5.8 5.8h3.3v3.3L3.9 14.3a1 1 0 0 1-1.4 0L.7 12.5a1 1 0 0 1 0-1.4z", {
      transform: "translate(2 0)",
    }),
  ]),

  icon(
    "lock",
    [
      r(3.5, 6.5, 8, 5.5, { rx: 1 }),
      p("M5.1 6.5V5.2a2.4 2.4 0 1 1 4.8 0v1.3"),
      c(7.5, 9.2, 0.8),
      l(7.5, 9.9, 7.5, 10.8),
    ],
    {
      solid: [
        p(
          "M4 6.3h7a1 1 0 0 1 1 1v4.2a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7.3a1 1 0 0 1 1-1zm1.45 0V5.2a2.05 2.05 0 1 1 4.1 0v1.1",
          { fill: "currentColor", stroke: "none" },
        ),
      ],
    },
  ),
  icon(
    "unlock",
    [
      r(3.5, 6.5, 8, 5.5, { rx: 1 }),
      p("M9.9 6.5V5.2a2.4 2.4 0 0 0-4.8 0"),
      c(7.5, 9.2, 0.8),
      l(7.5, 9.9, 7.5, 10.8),
    ],
    {
      aliases: ["lock-open"],
    },
  ),
  icon(
    "shield",
    [p("M7.5 2.6 11.5 4v3.9c0 2.5-1.45 3.95-4 4.95-2.55-1-4-2.45-4-4.95V4z")],
    {
      duotone: [
        p(
          "M7.5 2.6 11.5 4v3.9c0 2.5-1.45 3.95-4 4.95-2.55-1-4-2.45-4-4.95V4z",
          {
            fill: "currentColor",
            stroke: "none",
            tone: "secondary",
            opacity: 0.3,
          },
        ),
        p("M7.5 2.6 11.5 4v3.9c0 2.5-1.45 3.95-4 4.95-2.55-1-4-2.45-4-4.95V4z"),
      ],
      aliases: ["shield-check", "shield-alert"],
    },
  ),

  icon(
    "info",
    [
      c(7.5, 7.5, 4.75),
      l(7.5, 6.9, 7.5, 10),
      c(7.5, 4.9, 0.55, { fill: "currentColor", stroke: "none" }),
    ],
    {
      aliases: ["info-circle"],
      categories: commonTags.status,
    },
  ),
  icon(
    "alert-triangle",
    [
      polygon("7.5,2.6 12.7,11.8 2.3,11.8"),
      l(7.5, 6, 7.5, 8.7),
      c(7.5, 10.3, 0.55, { fill: "currentColor", stroke: "none" }),
    ],
    {
      aliases: ["warning", "alert"],
      categories: commonTags.status,
    },
  ),
  icon(
    "alert-circle",
    [
      c(7.5, 7.5, 4.75),
      l(7.5, 5.4, 7.5, 8.4),
      c(7.5, 10.2, 0.55, { fill: "currentColor", stroke: "none" }),
    ],
    { aliases: ["error"], categories: commonTags.status },
  ),
  icon(
    "help-circle",
    [
      c(7.5, 7.5, 4.75),
      p("M6.35 6.1a1.15 1.15 0 1 1 2.3.05c0 .95-1.15 1.05-1.15 2.05"),
      c(7.5, 10.45, 0.55, { fill: "currentColor", stroke: "none" }),
    ],
    {
      aliases: ["question", "help"],
      categories: commonTags.status,
    },
  ),
  icon("check-circle", [c(7.5, 7.5, 4.75), p("M5.4 7.55 6.9 9.05 9.85 6.1")], {
    categories: commonTags.status,
  }),
  icon(
    "x-circle",
    [c(7.5, 7.5, 4.75), l(5.6, 5.6, 9.4, 9.4), l(9.4, 5.6, 5.6, 9.4)],
    { categories: commonTags.status },
  ),

  icon("eye", [
    p(
      "M1.9 7.5c1.2-2.25 3.35-3.75 5.6-3.75s4.4 1.5 5.6 3.75c-1.2 2.25-3.35 3.75-5.6 3.75S3.1 9.75 1.9 7.5z",
    ),
    c(7.5, 7.5, 1.6),
  ]),
  icon("eye-off", [
    l(2.4, 2.4, 12.6, 12.6),
    p(
      "M3.2 4.85C2.5 5.54 1.9 6.43 1.55 7.5c1.2 2.25 3.35 3.75 5.95 3.75 1.02 0 1.98-.23 2.85-.65",
    ),
    p(
      "M6.1 3.95c.45-.13.91-.2 1.4-.2 2.25 0 4.4 1.5 5.6 3.75-.3.56-.66 1.08-1.06 1.54",
    ),
    p("M6.2 6.2a1.85 1.85 0 0 0 2.6 2.6"),
  ]),
  icon("camera", [
    r(2.6, 4.2, 9.8, 7.2, { rx: 1.2 }),
    r(5.2, 2.9, 2.5, 1.3, { rx: 0.5 }),
    c(7.5, 7.8, 2),
  ]),
  icon("camera-off", [
    r(2.6, 4.2, 9.8, 7.2, { rx: 1.2 }),
    r(5.2, 2.9, 2.5, 1.3, { rx: 0.5 }),
    l(2.4, 2.4, 12.6, 12.6),
  ]),
  icon("video", [
    r(2.6, 4.2, 7.1, 6.6, { rx: 1 }),
    polygon("10.2,6.2 12.6,5.1 12.6,9.9 10.2,8.8"),
  ]),
  icon("video-off", [
    r(2.6, 4.2, 7.1, 6.6, { rx: 1 }),
    polygon("10.2,6.2 12.6,5.1 12.6,9.9 10.2,8.8"),
    l(2.4, 2.4, 12.6, 12.6),
  ]),
  icon(
    "image",
    [
      r(2.6, 3, 9.8, 9.2, { rx: 1.1 }),
      c(5.1, 6.1, 0.75, { fill: "currentColor", stroke: "none" }),
      polyline("3.6 10.2 6.15 7.65 8.1 9.35 10.8 6.6 11.4 7.2"),
    ],
    {
      aliases: ["gallery", "picture"],
      categories: commonTags.media,
    },
  ),

  icon(
    "play",
    [
      polygon("5.4 4.6 11 7.5 5.4 10.4", {
        fill: "currentColor",
        stroke: "none",
      }),
    ],
    { categories: commonTags.media },
  ),
  icon("play-circle", [
    c(7.5, 7.5, 4.8),
    polygon("6.45 5.9 10 7.5 6.45 9.1", {
      fill: "currentColor",
      stroke: "none",
    }),
  ]),
  icon(
    "pause",
    [
      r(4.7, 4.2, 2.1, 6.6, { rx: 0.5, fill: "currentColor", stroke: "none" }),
      r(8.2, 4.2, 2.1, 6.6, { rx: 0.5, fill: "currentColor", stroke: "none" }),
    ],
    { categories: commonTags.media },
  ),
  icon("pause-circle", [
    c(7.5, 7.5, 4.8),
    r(5.7, 5.6, 1.3, 3.8, { rx: 0.4, fill: "currentColor", stroke: "none" }),
    r(8, 5.6, 1.3, 3.8, { rx: 0.4, fill: "currentColor", stroke: "none" }),
  ]),
  icon("stop-circle", [
    c(7.5, 7.5, 4.8),
    r(5.7, 5.7, 3.6, 3.6, { rx: 0.5, fill: "currentColor", stroke: "none" }),
  ]),
  icon("forward", [
    polygon("4.7,5.1 8,7.5 4.7,9.9", { fill: "currentColor", stroke: "none" }),
    polygon("8.1,5.1 11.4,7.5 8.1,9.9", {
      fill: "currentColor",
      stroke: "none",
    }),
  ]),
  icon("rewind", [
    polygon("10.3,5.1 7,7.5 10.3,9.9", {
      fill: "currentColor",
      stroke: "none",
    }),
    polygon("6.9,5.1 3.6,7.5 6.9,9.9", {
      fill: "currentColor",
      stroke: "none",
    }),
  ]),
  icon("skip-next", [
    polygon("4.7,5.1 8.1,7.5 4.7,9.9", {
      fill: "currentColor",
      stroke: "none",
    }),
    polygon("8.2,5.1 11.6,7.5 8.2,9.9", {
      fill: "currentColor",
      stroke: "none",
    }),
    l(11.9, 5.1, 11.9, 9.9),
  ]),
  icon("skip-previous", [
    polygon("10.3,5.1 6.9,7.5 10.3,9.9", {
      fill: "currentColor",
      stroke: "none",
    }),
    polygon("6.8,5.1 3.4,7.5 6.8,9.9", {
      fill: "currentColor",
      stroke: "none",
    }),
    l(3.1, 5.1, 3.1, 9.9),
  ]),
  icon(
    "volume",
    [polygon("3.1,6.2 5.1,6.2 7.3,4.4 7.3,10.6 5.1,8.8 3.1,8.8")],
    {
      aliases: ["speaker"],
    },
  ),
  icon("volume-up", [
    polygon("3.1,6.2 5.1,6.2 7.3,4.4 7.3,10.6 5.1,8.8 3.1,8.8"),
    p("M9 6a2 2 0 0 1 0 3"),
    p("M10.2 4.8a3.7 3.7 0 0 1 0 5.4"),
  ]),
  icon("volume-down", [
    polygon("3.1,6.2 5.1,6.2 7.3,4.4 7.3,10.6 5.1,8.8 3.1,8.8"),
    p("M9.1 6.4a1.4 1.4 0 0 1 0 2.2"),
  ]),
  icon("volume-mute", [
    polygon("3.1,6.2 5.1,6.2 7.3,4.4 7.3,10.6 5.1,8.8 3.1,8.8"),
    l(9.2, 6.1, 11.4, 8.3),
    l(11.4, 6.1, 9.2, 8.3),
  ]),
  icon(
    "mic",
    [
      p(
        "M7.5 2.8a1.7 1.7 0 0 0-1.7 1.7v2.9a1.7 1.7 0 1 0 3.4 0V4.5A1.7 1.7 0 0 0 7.5 2.8z",
      ),
      p("M4.4 7.4a3.1 3.1 0 1 0 6.2 0"),
      l(7.5, 10.5, 7.5, 12.1),
      l(5.5, 12.1, 9.5, 12.1),
    ],
    {
      aliases: ["microphone", "headset"],
      categories: commonTags.media,
    },
  ),
  icon(
    "mic-off",
    [
      l(2.4, 2.4, 12.6, 12.6),
      p("M5.8 8.05V4.95a1.7 1.7 0 0 1 2.75-1.3"),
      p("M9.2 9.2a1.7 1.7 0 0 1-2.75-1.3"),
      p("M4.35 7.45a3.15 3.15 0 0 0 5.62 1.95"),
      l(7.5, 10.55, 7.5, 12.15),
      l(5.5, 12.15, 9.5, 12.15),
    ],
    { categories: commonTags.media },
  ),

  icon(
    "download",
    [
      l(7.5, 3.2, 7.5, 9.3),
      polyline("4.9 6.9 7.5 9.5 10.1 6.9"),
      l(3.2, 11.7, 11.8, 11.7),
    ],
    { aliases: ["arrow-down-to-line"], tags: commonTags.actions },
  ),
  icon(
    "upload",
    [
      l(7.5, 11.8, 7.5, 5.7),
      polyline("4.9 8.1 7.5 5.5 10.1 8.1"),
      l(3.2, 3.3, 11.8, 3.3),
    ],
    { aliases: ["arrow-up-to-line"], tags: commonTags.actions },
  ),
  icon("cloud", [
    p(
      "M4.8 11.5h5.5a2.25 2.25 0 0 0 .2-4.5A3.15 3.15 0 0 0 4.5 7.6 2 2 0 0 0 4.8 11.5z",
    ),
  ]),
  icon("cloud-upload", [
    p(
      "M4.8 11.5h5.5a2.25 2.25 0 0 0 .2-4.5A3.15 3.15 0 0 0 4.5 7.6 2 2 0 0 0 4.8 11.5z",
    ),
    l(7.5, 10.1, 7.5, 6.7),
    polyline("6.2 8 7.5 6.7 8.8 8"),
  ]),
  icon("cloud-download", [
    p(
      "M4.8 11.5h5.5a2.25 2.25 0 0 0 .2-4.5A3.15 3.15 0 0 0 4.5 7.6 2 2 0 0 0 4.8 11.5z",
    ),
    l(7.5, 6.7, 7.5, 10.1),
    polyline("6.2 8.8 7.5 10.1 8.8 8.8"),
  ]),
  icon("cloud-sync", [
    p(
      "M4.8 11.5h5.5a2.25 2.25 0 0 0 .2-4.5A3.15 3.15 0 0 0 4.5 7.6 2 2 0 0 0 4.8 11.5z",
    ),
    p("M6 9a1.75 1.75 0 0 0 2.7 1.35"),
    polyline("8.9 10.35 8.8 9.15 7.65 9.2"),
    p("M9 8a1.75 1.75 0 0 0-2.7-1.35"),
    polyline("6.1 6.65 6.2 7.85 7.35 7.8"),
  ]),
  icon(
    "refresh-cw",
    [p("M11.5 5.5V3.3H9.3"), p("M11.3 3.7a4.6 4.6 0 1 0 1 5.8")],
    {
      aliases: ["reload", "refresh", "sync", "rotate", "rotate-right"],
      tags: commonTags.actions,
    },
  ),
  icon(
    "refresh-ccw",
    [p("M3.5 9.5v2.2h2.2"), p("M3.7 11.3a4.6 4.6 0 1 0-1-5.8")],
    {
      aliases: ["rotate-left"],
      tags: commonTags.actions,
    },
  ),

  icon(
    "terminal",
    [polyline("3.5 5.2 5.8 7.5 3.5 9.8"), l(6.9, 10.1, 11.5, 10.1)],
    {
      aliases: ["terminal-alt"],
    },
  ),
  icon(
    "code",
    [
      polyline("5.6 4.5 3 7.5 5.6 10.5"),
      polyline("9.4 4.5 12 7.5 9.4 10.5"),
      l(8.2, 3.7, 6.8, 11.3),
    ],
    {
      aliases: ["code-block", "api"],
    },
  ),
  icon(
    "sparkles",
    [
      p("M7.5 2.8 8.3 5l2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8z"),
      p(
        "M11 8.6 11.45 9.8l1.25.45-1.25.45-.45 1.25-.45-1.25-1.25-.45 1.25-.45z",
      ),
      p(
        "M3.5 8.8 3.92 9.92 5.05 10.35 3.92 10.77 3.5 11.9 3.08 10.77 1.95 10.35 3.08 9.92z",
      ),
    ],
    {
      aliases: ["magic"],
    },
  ),
  icon(
    "bolt",
    [
      polyline(
        "8.15 2.75 4.55 8.1 7.3 8.1 6.7 12.2 10.45 6.9 7.8 6.9 8.15 2.75",
      ),
    ],
    {
      solid: [
        polygon("8.15,2.6 4.35,8.35 7.05,8.35 6.55,12.4 10.65,6.65 7.95,6.65", {
          fill: "currentColor",
          stroke: "none",
        }),
      ],
      aliases: ["lightning"],
    },
  ),
  icon("sun", [
    c(7.5, 7.5, 2.2),
    l(7.5, 1.9, 7.5, 3.3),
    l(7.5, 11.7, 7.5, 13.1),
    l(1.9, 7.5, 3.3, 7.5),
    l(11.7, 7.5, 13.1, 7.5),
    l(3.5, 3.5, 4.5, 4.5),
    l(10.5, 10.5, 11.5, 11.5),
    l(10.5, 4.5, 11.5, 3.5),
    l(3.5, 11.5, 4.5, 10.5),
  ]),
  icon("moon", [p("M10.9 9.5A4.7 4.7 0 1 1 6 3.2a3.9 3.9 0 1 0 4.9 6.3z")]),
  icon("wifi", [
    p("M2.6 5.9a7 7 0 0 1 9.8 0"),
    p("M4.6 7.9a4.2 4.2 0 0 1 5.8 0"),
    p("M6.55 9.85a1.35 1.35 0 0 1 1.9 0"),
    c(7.5, 11.45, 0.55, { fill: "currentColor", stroke: "none" }),
  ]),
  icon("wifi-off", [
    p("M2.6 5.9a7 7 0 0 1 9.8 0"),
    p("M4.6 7.9a4.2 4.2 0 0 1 5.8 0"),
    c(7.5, 11.45, 0.55, { fill: "currentColor", stroke: "none" }),
    l(2.4, 2.4, 12.6, 12.6),
  ]),

  icon(
    "login",
    [
      r(2.9, 3.3, 5.6, 8.4, { rx: 1 }),
      l(7.6, 7.5, 12.1, 7.5),
      polyline("9.8 5.2 12.1 7.5 9.8 9.8"),
    ],
    {
      aliases: ["sign-in"],
    },
  ),
  icon(
    "logout",
    [
      r(6.5, 3.3, 5.6, 8.4, { rx: 1 }),
      l(7.4, 7.5, 2.9, 7.5),
      polyline("5.2 5.2 2.9 7.5 5.2 9.8"),
    ],
    {
      aliases: ["sign-out"],
    },
  ),
  icon(
    "key",
    [
      c(4.6, 7.5, 1.9),
      l(6.5, 7.5, 12.3, 7.5),
      l(10.5, 7.5, 10.5, 9.1),
      l(11.7, 7.5, 11.7, 8.5),
    ],
    {
      aliases: ["key-alt"],
    },
  ),
  icon("fingerprint", [
    p("M7.5 3.3a4.2 4.2 0 0 1 4.2 4.2v1.2"),
    p("M7.5 4.9a2.6 2.6 0 0 1 2.6 2.6v1.6"),
    p("M7.5 6.4a1.1 1.1 0 0 1 1.1 1.1v1.9"),
    p("M4.1 8.9V7.5a3.4 3.4 0 1 1 6.8 0v2.2a3.4 3.4 0 0 1-6.8 0V7.5"),
  ]),
  icon(
    "dislike",
    [
      r(2.7, 5.7, 2, 5.1, { rx: 0.45 }),
      p(
        "M4.7 10.2h5.7a1.15 1.15 0 0 0 1.1-.83l.65-2.1a1.1 1.1 0 0 0-1.05-1.43H9.9V3.6a1.1 1.1 0 0 0-2.08-.5L6.4 5.85H4.7",
      ),
    ],
    {
      aliases: ["thumbs-down"],
    },
  ),

  icon("file-plus", [
    p(
      "M3.8 2.9h4.3l2.3 2.3v6.9a1.2 1.2 0 0 1-1.2 1.2H3.8a1.2 1.2 0 0 1-1.2-1.2V4.1a1.2 1.2 0 0 1 1.2-1.2z",
    ),
    p("M8.1 2.9v2.3h2.3"),
    l(6.2, 8.5, 6.2, 10.8),
    l(5, 9.65, 7.4, 9.65),
  ]),
  icon("file-minus", [
    p(
      "M3.8 2.9h4.3l2.3 2.3v6.9a1.2 1.2 0 0 1-1.2 1.2H3.8a1.2 1.2 0 0 1-1.2-1.2V4.1a1.2 1.2 0 0 1 1.2-1.2z",
    ),
    p("M8.1 2.9v2.3h2.3"),
    l(5, 9.65, 7.4, 9.65),
  ]),
  icon("file-check", [
    p(
      "M3.8 2.9h4.3l2.3 2.3v6.9a1.2 1.2 0 0 1-1.2 1.2H3.8a1.2 1.2 0 0 1-1.2-1.2V4.1a1.2 1.2 0 0 1 1.2-1.2z",
    ),
    p("M8.1 2.9v2.3h2.3"),
    p("M5 9.6 5.9 10.5 7.3 9.1"),
  ]),
  icon("file-x", [
    p(
      "M3.8 2.9h4.3l2.3 2.3v6.9a1.2 1.2 0 0 1-1.2 1.2H3.8a1.2 1.2 0 0 1-1.2-1.2V4.1a1.2 1.2 0 0 1 1.2-1.2z",
    ),
    p("M8.1 2.9v2.3h2.3"),
    l(5.1, 9.1, 7.3, 11.2),
    l(7.3, 9.1, 5.1, 11.2),
  ]),
  icon(
    "stop",
    [
      r(3.2, 3.2, 8.6, 8.6, { rx: 1.1 }),
      r(5.4, 5.4, 4.2, 4.2, { rx: 0.65, fill: "currentColor", stroke: "none" }),
    ],
    {
      aliases: ["stop-square"],
    },
  ),

  icon("crop", [
    polyline("4.1 2.8 4.1 10.9 12.2 10.9"),
    polyline("10.9 12.2 10.9 4.1 2.8 4.1"),
    l(6.2, 2.8, 6.2, 4.1),
    l(8.8, 10.9, 8.8, 12.2),
  ]),
  icon("flip-horizontal", [
    l(7.5, 2.8, 7.5, 12.2),
    p("M3.1 4.2h2.8l1.2 1.2v4.2l-1.2 1.2H3.1z"),
    p("M12 4.2H9.2L8 5.4v4.2l1.2 1.2H12z"),
  ]),
  icon("flip-vertical", [
    l(2.8, 7.5, 12.2, 7.5),
    p("M4.2 3.1v2.8l1.2 1.2h4.2l1.2-1.2V3.1z"),
    p("M4.2 12v-2.8l1.2-1.2h4.2l1.2 1.2V12z"),
  ]),
  icon(
    "maximize",
    [
      r(3, 3, 9, 9, { rx: 1.1 }),
      polyline("5.4 7.1 5.4 5.4 7.1 5.4"),
      polyline("9.6 7.1 9.6 5.4 7.9 5.4"),
      polyline("5.4 7.9 5.4 9.6 7.1 9.6"),
      polyline("9.6 7.9 9.6 9.6 7.9 9.6"),
    ],
    {
      aliases: ["fullscreen", "expand"],
    },
  ),
  icon(
    "minimize",
    [
      r(3, 3, 9, 9, { rx: 1.1 }),
      polyline("6.8 6.2 5.4 6.2 5.4 4.8"),
      polyline("8.2 6.2 9.6 6.2 9.6 4.8"),
      polyline("6.8 8.8 5.4 8.8 5.4 10.2"),
      polyline("8.2 8.8 9.6 8.8 9.6 10.2"),
    ],
    {
      aliases: ["fullscreen-exit", "collapse"],
    },
  ),
  icon("check-square", [
    r(3.1, 3.1, 8.8, 8.8, { rx: 1.2 }),
    p("M5.1 7.7 6.8 9.4 9.9 6.3"),
  ]),

  icon("bug", [
    c(7.5, 7.8, 2.4),
    l(7.5, 3, 7.5, 5.2),
    l(5.1, 4.8, 3.4, 3.8),
    l(9.9, 4.8, 11.6, 3.8),
    l(4.8, 7.1, 2.9, 7.1),
    l(10.2, 7.1, 12.1, 7.1),
    l(5.1, 10.3, 3.4, 11.3),
    l(9.9, 10.3, 11.6, 11.3),
  ]),
  icon(
    "bracket",
    [
      polyline("6 3.1 4.2 3.1 4.2 11.9 6 11.9"),
      polyline("9 3.1 10.8 3.1 10.8 11.9 9 11.9"),
    ],
    {
      aliases: ["brackets"],
    },
  ),

  icon(
    "cpu",
    [
      r(4.6, 4.6, 5.8, 5.8, { rx: 0.85 }),
      r(6.2, 6.2, 2.6, 2.6, { rx: 0.5 }),
      l(5.4, 2.8, 5.4, 4.1),
      l(7.5, 2.8, 7.5, 4.1),
      l(9.6, 2.8, 9.6, 4.1),
      l(5.4, 10.9, 5.4, 12.2),
      l(7.5, 10.9, 7.5, 12.2),
      l(9.6, 10.9, 9.6, 12.2),
      l(2.8, 5.4, 4.1, 5.4),
      l(2.8, 7.5, 4.1, 7.5),
      l(2.8, 9.6, 4.1, 9.6),
      l(10.9, 5.4, 12.2, 5.4),
      l(10.9, 7.5, 12.2, 7.5),
      l(10.9, 9.6, 12.2, 9.6),
    ],
    {
      aliases: ["chip", "memory", "processor"],
    },
  ),
  icon("server", [
    r(2.8, 3.2, 9.4, 3.1, { rx: 0.8 }),
    r(2.8, 7.1, 9.4, 3.1, { rx: 0.8 }),
    c(4.3, 4.75, 0.45, { fill: "currentColor", stroke: "none" }),
    c(4.3, 8.65, 0.45, { fill: "currentColor", stroke: "none" }),
    l(6, 4.75, 11.1, 4.75),
    l(6, 8.65, 11.1, 8.65),
  ]),
  icon(
    "database",
    [
      p(
        "M3.1 4.6c0-1.3 1.95-2.3 4.4-2.3s4.4 1 4.4 2.3-1.95 2.3-4.4 2.3-4.4-1-4.4-2.3z",
      ),
      p("M3.1 4.6v2.8c0 1.3 1.95 2.3 4.4 2.3s4.4-1 4.4-2.3V4.6"),
      p("M3.1 7.4v2.8c0 1.3 1.95 2.3 4.4 2.3s4.4-1 4.4-2.3V7.4"),
    ],
    {
      aliases: ["storage"],
    },
  ),
  icon("database-add", [
    p(
      "M3.1 4.4c0-1.3 1.95-2.3 4.4-2.3s4.4 1 4.4 2.3-1.95 2.3-4.4 2.3-4.4-1-4.4-2.3z",
    ),
    p("M3.1 4.4v2.7c0 1.3 1.95 2.3 4.4 2.3 1.1 0 2.1-.2 2.9-.55"),
    l(10.5, 8.9, 10.5, 12.1),
    l(8.9, 10.5, 12.1, 10.5),
  ]),
  icon("database-remove", [
    p(
      "M3.1 4.4c0-1.3 1.95-2.3 4.4-2.3s4.4 1 4.4 2.3-1.95 2.3-4.4 2.3-4.4-1-4.4-2.3z",
    ),
    p("M3.1 4.4v2.7c0 1.3 1.95 2.3 4.4 2.3 1.1 0 2.1-.2 2.9-.55"),
    l(8.9, 10.5, 12.1, 10.5),
  ]),
  icon(
    "hard-drive",
    [
      r(2.6, 4.2, 9.8, 6.6, { rx: 1.1 }),
      c(9.4, 8.7, 0.5, { fill: "currentColor", stroke: "none" }),
      c(11, 8.7, 0.5, { fill: "currentColor", stroke: "none" }),
      l(4, 8.7, 7.5, 8.7),
    ],
    {
      aliases: ["hdd"],
    },
  ),
  icon("network", [
    c(7.5, 3.6, 1),
    c(3.6, 7.5, 1),
    c(11.4, 7.5, 1),
    c(7.5, 11.4, 1),
    l(7.5, 4.6, 3.6, 6.5),
    l(7.5, 4.6, 11.4, 6.5),
    l(3.6, 8.5, 7.5, 10.4),
    l(11.4, 8.5, 7.5, 10.4),
  ]),
  icon("chart-area", [
    l(2.9, 12.1, 12.1, 12.1),
    l(2.9, 12.1, 2.9, 3.4),
    p("M3.3 10.2 5.5 7.7 7.2 8.5 9.1 5.7 11.7 7.3"),
    p("M3.3 10.2V12h8.4v-4.7l-2.6-1.6-1.9 2.8-1.7-.8z", {
      fill: "currentColor",
      stroke: "none",
      tone: "secondary",
      opacity: 0.25,
    }),
  ]),

  icon(
    "wallet",
    [
      r(2.7, 4.5, 9.8, 6.2, { rx: 1.1 }),
      p("M2.7 6.2h8.5a1 1 0 0 1 1 1v2.6h-3.1a1.3 1.3 0 1 1 0-2.6h3.1"),
      c(9.3, 8.5, 0.35, { fill: "currentColor", stroke: "none" }),
    ],
    {
      aliases: [
        "money",
        "currency",
        "dollar",
        "euro",
        "rupee",
        "pound",
        "bitcoin",
      ],
    },
  ),
  icon(
    "credit-card",
    [
      r(2.5, 4, 10, 7, { rx: 1.1 }),
      l(2.7, 6.5, 12.3, 6.5),
      l(4.3, 9.1, 7.2, 9.1),
    ],
    {
      aliases: ["card"],
    },
  ),
  icon("invoice", [
    p("M4 2.8h7v9.6l-1.3-.8-1.2.8-1.2-.8-1.3.8-1.3-.8-1.2.8z"),
    l(5.5, 5.5, 9.4, 5.5),
    l(5.5, 7.4, 9.4, 7.4),
    l(5.5, 9.3, 8.1, 9.3),
  ]),
  icon(
    "receipt",
    [
      p("M4 2.8h7v9.6l-1.3-.8-1.2.8-1.2-.8-1.3.8-1.3-.8-1.2.8z"),
      l(5.5, 5.5, 9.4, 5.5),
      l(5.5, 7.4, 9.4, 7.4),
      l(5.5, 9.3, 7.1, 9.3),
    ],
    {
      aliases: ["bill"],
    },
  ),
  icon(
    "cart",
    [
      c(4.6, 11.1, 0.8),
      c(9.8, 11.1, 0.8),
      p("M2.5 3.6h1.4l1.2 5.8h5.9l1.1-4.2H4.8"),
      l(6.2, 9.4, 11.4, 9.4),
    ],
    {
      aliases: ["cart-add", "cart-remove", "shopping-basket", "shopping-bag"],
    },
  ),

  icon(
    "building",
    [
      r(3.1, 2.8, 8.8, 10.4, { rx: 0.85 }),
      r(5.1, 4.5, 1.1, 1.1, { rx: 0.2 }),
      r(7, 4.5, 1.1, 1.1, { rx: 0.2 }),
      r(8.9, 4.5, 1.1, 1.1, { rx: 0.2 }),
      r(5.1, 6.5, 1.1, 1.1, { rx: 0.2 }),
      r(7, 6.5, 1.1, 1.1, { rx: 0.2 }),
      r(8.9, 6.5, 1.1, 1.1, { rx: 0.2 }),
      r(6.9, 9.2, 1.3, 3.9, { rx: 0.3 }),
    ],
    {
      aliases: [
        "office",
        "home-office",
        "factory",
        "warehouse",
        "store",
        "shop",
      ],
    },
  ),
  icon(
    "car",
    [
      p("M3 8.8h9l-1-2.8a1.6 1.6 0 0 0-1.5-1.1H5.5A1.6 1.6 0 0 0 4 6z"),
      r(2.7, 8.8, 9.6, 2.2, { rx: 0.8 }),
      c(4.8, 11.2, 0.7, { fill: "currentColor", stroke: "none" }),
      c(10.2, 11.2, 0.7, { fill: "currentColor", stroke: "none" }),
    ],
    {
      aliases: [
        "bus",
        "train",
        "truck",
        "bike",
        "scooter",
        "taxi",
        "fuel",
        "parking",
        "traffic-light",
      ],
    },
  ),
  icon(
    "airplane",
    [
      polygon(
        "2.6,8.2 12.4,3.9 9.6,7.5 12.4,9.2 11.4,10.2 8.6,8.8 7,11.8 6,10.8 6.9,8.1 4,7.3",
        { fill: "none" },
      ),
    ],
    {
      aliases: ["ship", "airplan"],
    },
  ),

  icon("cloud-sun", [
    c(4.6, 5.5, 1.5),
    p("M4.6 2.8v1.1"),
    p("M2.7 5.5h1.1"),
    p("M6.5 5.5h1.1"),
    p("M3.3 4.2l.8.8"),
    p("M5.9 4.2l-.8.8"),
    p(
      "M5.4 11.3h4.6a1.95 1.95 0 0 0 .2-3.9 2.75 2.75 0 0 0-5.35.55 1.6 1.6 0 0 0 .5 3.35z",
    ),
  ]),
  icon("cloud-moon", [
    p("M5.2 3.7a2 2 0 1 0 2.2 2.8A2.6 2.6 0 0 1 5.2 3.7z"),
    p(
      "M5.3 11.3h4.7a2 2 0 0 0 .2-4 2.8 2.8 0 0 0-5.45.55 1.65 1.65 0 0 0 .55 3.45z",
    ),
  ]),
  icon("rain", [
    p(
      "M4.6 10.1h5.3a2 2 0 0 0 .2-4 2.8 2.8 0 0 0-5.45.55 1.65 1.65 0 0 0-.05 3.45z",
    ),
    l(5.6, 11, 5, 12.2),
    l(7.5, 11, 6.9, 12.2),
    l(9.4, 11, 8.8, 12.2),
  ]),
  icon("snow", [
    p(
      "M4.6 10.1h5.3a2 2 0 0 0 .2-4 2.8 2.8 0 0 0-5.45.55 1.65 1.65 0 0 0-.05 3.45z",
    ),
    l(7.5, 10.9, 7.5, 12.2),
    l(6.9, 11.2, 8.1, 11.9),
    l(8.1, 11.2, 6.9, 11.9),
  ]),
  icon("storm", [
    p(
      "M4.6 10.1h5.3a2 2 0 0 0 .2-4 2.8 2.8 0 0 0-5.45.55 1.65 1.65 0 0 0-.05 3.45z",
    ),
    polygon("7.8,10.6 6.4,12.2 7.7,12.2 7.1,13.8 9,11.8 7.8,11.8", {
      transform: "translate(0 -1.8)",
      fill: "currentColor",
      stroke: "none",
    }),
  ]),
  icon("umbrella", [
    p("M2.8 7.2a4.7 4.7 0 0 1 9.4 0H2.8z"),
    l(7.5, 7.2, 7.5, 11),
    p("M7.5 11a1.2 1.2 0 0 0 2.4 0"),
  ]),
  icon("fire", [
    p(
      "M7.5 12c2 0 3.6-1.5 3.6-3.6 0-1.9-1.1-3.2-2.4-4.5-.3.9-1.2 1.6-2.2 1.6 0-1.2-.5-2.1-1.3-2.9-1.5 1.2-2.6 2.9-2.6 5 0 2.4 1.8 4.4 4.9 4.4z",
    ),
  ]),
  icon(
    "leaf",
    [
      p(
        "M12 3.2C8 3.2 4 5.4 3.2 9.8 2.9 11.2 3.8 12 5.2 11.8 9.6 11 11.8 7 11.8 3c0 .1 0 .2.2.2z",
      ),
      p("M4.3 10.9c2.7-2.6 4.2-4.2 6.8-6.8"),
    ],
    {
      aliases: ["tree", "flower"],
    },
  ),
  icon(
    "gift",
    [
      r(2.7, 6.1, 9.6, 6.2, { rx: 1 }),
      l(7.5, 6.1, 7.5, 12.3),
      l(2.7, 8.4, 12.3, 8.4),
      p("M7.5 6.1H4.9a1.4 1.4 0 1 1 0-2.8c1.4 0 2.2 1 2.6 2.8z"),
      p("M7.5 6.1h2.6a1.4 1.4 0 1 0 0-2.8c-1.4 0-2.2 1-2.6 2.8z"),
    ],
    {
      aliases: ["gift-card"],
    },
  ),
  icon(
    "trophy",
    [
      p("M4.2 3.1h6.6v1.4a3.3 3.3 0 0 1-6.6 0z"),
      p("M4.2 4H2.9a1.3 1.3 0 0 0 1.3 1.9h.7"),
      p("M10.8 4h1.3a1.3 1.3 0 0 1-1.3 1.9h-.7"),
      p("M7.5 8.1v2.1"),
      r(5.7, 10.2, 3.6, 2.1, { rx: 0.5 }),
    ],
    {
      aliases: ["medal", "award"],
    },
  ),
  icon("crown", [
    polygon("2.8,10.7 3.7,4.5 6.2,7.1 7.5,3.9 8.8,7.1 11.3,4.5 12.2,10.7"),
    l(3.6, 12.1, 11.4, 12.1),
  ]),
  icon("rocket", [
    p(
      "M9.8 3.2c-2.4 0-4.4 1.9-5.2 4.8L3 9.6l2.4-.3 1.7 1.7-.3 2.4 1.6-1.6c2.9-.8 4.8-2.8 4.8-5.2V3.2z",
    ),
    c(9.1, 5.7, 0.75),
    p("M4.7 10.3 2.8 12.2"),
  ]),
  icon(
    "coffee",
    [
      p("M3.2 5.2h6.9v3a2.5 2.5 0 0 1-2.5 2.5H5.7a2.5 2.5 0 0 1-2.5-2.5z"),
      p("M10.1 6.3h1a1.4 1.4 0 0 1 0 2.8h-1"),
      l(2.8, 12.1, 10.8, 12.1),
    ],
    {
      aliases: ["tea", "pizza", "burger", "apple", "cake", "ice-cream"],
    },
  ),

  icon("phone-call", [
    p(
      "M4.25 2.8h1.6L6.55 5 5.3 6.25a8.4 8.4 0 0 0 3.45 3.45L10 8.45l2.2.7v1.6A1.25 1.25 0 0 1 10.95 12c-4.95 0-8.95-4-8.95-8.95A1.25 1.25 0 0 1 3.25 2.8",
    ),
    p("M9 3.7a3 3 0 0 1 2.3 2.3"),
    p("M8.6 5.4a1.4 1.4 0 0 1 1 1"),
  ]),
  icon("phone-missed", [
    p(
      "M4.25 2.8h1.6L6.55 5 5.3 6.25a8.4 8.4 0 0 0 3.45 3.45L10 8.45l2.2.7v1.6A1.25 1.25 0 0 1 10.95 12c-4.95 0-8.95-4-8.95-8.95A1.25 1.25 0 0 1 3.25 2.8",
    ),
    l(8.8, 3.2, 12.2, 6.6),
    l(12.2, 3.2, 8.8, 6.6),
  ]),
  icon("chat", [r(2.8, 3.2, 9.4, 6.9, { rx: 1.1 }), p("M6.2 10.1 5 12l.3-2")], {
    aliases: [
      "chat-bubble",
      "comment",
      "whatsapp",
      "telegram-cursor",
      "discord",
    ],
  }),
  icon(
    "comments",
    [
      r(2.6, 3, 7.7, 5.7, { rx: 0.9 }),
      p("M4.8 8.7 4 10.7l2-.9"),
      r(5.8, 6.3, 6.6, 4.7, { rx: 0.9 }),
    ],
    {
      aliases: ["forum", "slack"],
    },
  ),
  icon(
    "megaphone",
    [
      polygon("3.2,7.1 9.6,4.6 9.6,10.4 3.2,7.9", { fill: "none" }),
      l(9.6, 5.6, 11.5, 5.1),
      l(9.6, 9.4, 11.5, 9.9),
      r(3.2, 7.1, 1.8, 3.6, { rx: 0.45 }),
    ],
    {
      aliases: [
        "broadcast",
        "rss",
        "twitter",
        "facebook",
        "instagram",
        "linkedin",
        "youtube",
      ],
    },
  ),

  icon("printer", [
    r(3.1, 4, 8.8, 3.2, { rx: 0.7 }),
    r(4.2, 2.8, 6.6, 2.2, { rx: 0.5 }),
    r(4.2, 8.6, 6.6, 3.6, { rx: 0.5 }),
    c(10, 5.6, 0.45, { fill: "currentColor", stroke: "none" }),
    l(5.2, 10, 9, 10),
  ]),
  icon(
    "monitor",
    [
      r(2.8, 3.2, 9.4, 6.6, { rx: 1 }),
      l(6.1, 12.2, 8.9, 12.2),
      l(7.5, 9.8, 7.5, 12.2),
    ],
    {
      aliases: ["screen"],
    },
  ),
  icon(
    "laptop",
    [
      r(3.1, 3.3, 8.8, 5.9, { rx: 0.8 }),
      p("M2.5 10.2h10a1 1 0 0 1-1 1h-8a1 1 0 0 1-1-1"),
    ],
    {
      aliases: ["notebook"],
    },
  ),
  icon("tablet", [
    r(4.1, 2.7, 6.8, 9.8, { rx: 1.1 }),
    c(7.5, 10.7, 0.45, { fill: "currentColor", stroke: "none" }),
  ]),
  icon("smartphone", [
    r(4.5, 2.5, 6, 10.4, { rx: 1.1 }),
    c(7.5, 10.6, 0.45, { fill: "currentColor", stroke: "none" }),
  ]),

  icon(
    "qr-code",
    [
      r(2.8, 2.8, 3.3, 3.3),
      r(8.9, 2.8, 3.3, 3.3),
      r(2.8, 8.9, 3.3, 3.3),
      r(4, 4, 0.9, 0.9, { fill: "currentColor", stroke: "none" }),
      r(10.1, 4, 0.9, 0.9, { fill: "currentColor", stroke: "none" }),
      r(4, 10.1, 0.9, 0.9, { fill: "currentColor", stroke: "none" }),
      r(8.9, 8.9, 1.2, 1.2),
      r(10.7, 10.7, 1.5, 1.5),
    ],
    {
      aliases: ["scan-qr"],
    },
  ),
  icon(
    "barcode",
    [
      l(3.2, 3.5, 3.2, 11.5),
      l(4.4, 3.5, 4.4, 11.5),
      l(5.9, 3.5, 5.9, 11.5),
      l(7.4, 3.5, 7.4, 11.5),
      l(8.4, 3.5, 8.4, 11.5),
      l(9.9, 3.5, 9.9, 11.5),
      l(11.1, 3.5, 11.1, 11.5),
    ],
    {
      aliases: ["scan"],
    },
  ),

  icon(
    "ticket",
    [
      p(
        "M2.8 5.1a1.2 1.2 0 0 0 0 2.4v2.8h9.4V7.5a1.2 1.2 0 1 0 0-2.4V2.8H2.8z",
      ),
      l(7.5, 2.8, 7.5, 10.3),
    ],
    {
      aliases: ["pass", "badge"],
    },
  ),
  icon(
    "id-card",
    [
      r(2.8, 3.6, 9.4, 7.8, { rx: 1 }),
      c(5.2, 7.2, 1.1),
      p("M3.8 10c.3-.9 1.1-1.4 1.9-1.4.9 0 1.7.5 2 1.4"),
      l(8.1, 6.2, 10.8, 6.2),
      l(8.1, 8, 10.8, 8),
    ],
    {
      aliases: ["passport"],
    },
  ),
  icon(
    "briefcase",
    [
      r(2.8, 4.3, 9.4, 7.2, { rx: 1 }),
      r(5.7, 2.8, 3.6, 1.5, { rx: 0.5 }),
      l(2.8, 7.2, 12.2, 7.2),
      l(6.7, 7.2, 8.3, 7.2),
    ],
    {
      aliases: ["suitcase"],
    },
  ),
  icon(
    "book",
    [
      p(
        "M3.6 3.2h6.6a1.2 1.2 0 0 1 1.2 1.2v7.4H4.2A1.2 1.2 0 0 0 3 13V4.4a1.2 1.2 0 0 1 1.2-1.2z",
      ),
      l(4.2, 5.2, 9.7, 5.2),
      l(4.2, 7, 9.7, 7),
      l(4.2, 8.8, 8.6, 8.8),
    ],
    {
      aliases: ["book-open", "library"],
    },
  ),
  icon(
    "graduation",
    [
      polygon("2.8,6.2 7.5,3.8 12.2,6.2 7.5,8.6", { fill: "none" }),
      p("M4.4 7.1v2.1c0 1.1 1.4 2 3.1 2s3.1-.9 3.1-2V7.1"),
      l(10.7, 7.1, 10.7, 9.3),
    ],
    {
      aliases: ["school", "university"],
    },
  ),
  icon(
    "brain",
    [
      p(
        "M5.4 4a1.9 1.9 0 0 1 3.2-1.4A1.9 1.9 0 0 1 11 5v4.6a1.9 1.9 0 0 1-1.9 1.9 1.9 1.9 0 0 1-1.6-.9 1.9 1.9 0 0 1-3.5-1V5.9A1.9 1.9 0 0 1 5.4 4z",
      ),
    ],
    {
      aliases: ["lightbulb", "idea"],
    },
  ),
  icon(
    "target",
    [
      c(7.5, 7.5, 4.6),
      c(7.5, 7.5, 2.9),
      c(7.5, 7.5, 1.2),
      l(10.8, 4.2, 12.2, 2.8),
    ],
    {
      aliases: [
        "target-arrow",
        "focus",
        "selection",
        "selection-box",
        "selection-multiple",
        "focus-ring",
        "focus-mode",
      ],
    },
  ),
  icon(
    "layers",
    [
      polygon("7.5,2.9 12.1,5.4 7.5,7.9 2.9,5.4"),
      polygon("7.5,6.9 12.1,9.4 7.5,11.9 2.9,9.4"),
    ],
    {
      aliases: ["stack", "layer-group"],
    },
  ),
  icon(
    "box",
    [
      p("M7.5 2.9 12 5.2v5.6l-4.5 2.3-4.5-2.3V5.2z"),
      l(7.5, 7.4, 7.5, 13.1),
      l(3, 5.2, 7.5, 7.4),
      l(12, 5.2, 7.5, 7.4),
    ],
    {
      aliases: ["box-open", "package", "panel", "container"],
    },
  ),
  icon(
    "cube",
    [
      polygon("7.5,3 11.5,5.2 11.5,9.8 7.5,12 3.5,9.8 3.5,5.2"),
      l(7.5, 7.2, 7.5, 12),
      l(3.5, 5.2, 7.5, 7.2),
      l(11.5, 5.2, 7.5, 7.2),
    ],
    {
      aliases: ["cubes", "plugin", "extension", "component"],
    },
  ),

  icon(
    "toggle-left",
    [
      r(2.8, 5.2, 9.4, 4.6, { rx: 2.3 }),
      c(5.1, 7.5, 1.6, { fill: "currentColor", stroke: "none" }),
    ],
    {
      aliases: ["switch"],
    },
  ),
  icon("toggle-right", [
    r(2.8, 5.2, 9.4, 4.6, { rx: 2.3 }),
    c(9.9, 7.5, 1.6, { fill: "currentColor", stroke: "none" }),
  ]),
  icon(
    "drag",
    [
      c(5.2, 5.2, 0.55, { fill: "currentColor", stroke: "none" }),
      c(7.5, 5.2, 0.55, { fill: "currentColor", stroke: "none" }),
      c(9.8, 5.2, 0.55, { fill: "currentColor", stroke: "none" }),
      c(5.2, 7.5, 0.55, { fill: "currentColor", stroke: "none" }),
      c(7.5, 7.5, 0.55, { fill: "currentColor", stroke: "none" }),
      c(9.8, 7.5, 0.55, { fill: "currentColor", stroke: "none" }),
      c(5.2, 9.8, 0.55, { fill: "currentColor", stroke: "none" }),
      c(7.5, 9.8, 0.55, { fill: "currentColor", stroke: "none" }),
      c(9.8, 9.8, 0.55, { fill: "currentColor", stroke: "none" }),
      l(7.5, 2.8, 7.5, 4.1),
      l(7.5, 10.9, 7.5, 12.2),
      l(2.8, 7.5, 4.1, 7.5),
      l(10.9, 7.5, 12.2, 7.5),
    ],
    {
      aliases: [
        "move",
        "cursor-drag",
        "pointer-drag",
        "cursor-move",
        "pointer",
        "pointer-click",
        "cursor-click",
        "cursor-hover",
      ],
    },
  ),
  icon("resize", [
    polyline("5.4 3.8 11.2 3.8 11.2 9.6"),
    polyline("9.6 11.2 3.8 11.2 3.8 5.4"),
    l(11.2, 3.8, 8.5, 6.5),
    l(3.8, 11.2, 6.5, 8.5),
  ]),

  icon(
    "align-left",
    [
      l(3.2, 4.2, 11.8, 4.2),
      l(3.2, 6.4, 9.6, 6.4),
      l(3.2, 8.6, 11.1, 8.6),
      l(3.2, 10.8, 8.5, 10.8),
    ],
    {
      aliases: ["text-align-left", "text-direction-ltr"],
    },
  ),
  icon(
    "align-center",
    [
      l(3.2, 4.2, 11.8, 4.2),
      l(4.3, 6.4, 10.7, 6.4),
      l(3.6, 8.6, 11.4, 8.6),
      l(4.8, 10.8, 10.2, 10.8),
    ],
    {
      aliases: ["text-align-center", "text-align-justify"],
    },
  ),
  icon(
    "align-right",
    [
      l(3.2, 4.2, 11.8, 4.2),
      l(5.4, 6.4, 11.8, 6.4),
      l(3.9, 8.6, 11.8, 8.6),
      l(6.5, 10.8, 11.8, 10.8),
    ],
    {
      aliases: ["text-align-right", "text-direction-rtl"],
    },
  ),
  icon(
    "align-top",
    [
      l(3.2, 3.4, 11.8, 3.4),
      r(4, 5.2, 2.2, 6.8, { rx: 0.45 }),
      r(8.8, 5.2, 2.2, 4.5, { rx: 0.45 }),
    ],
    {
      aliases: ["text-vertical"],
    },
  ),
  icon(
    "align-middle",
    [
      l(3.2, 7.5, 11.8, 7.5),
      r(4, 4.5, 2.2, 6, { rx: 0.45 }),
      r(8.8, 5.6, 2.2, 3.8, { rx: 0.45 }),
    ],
    {
      aliases: ["align-center-vertical"],
    },
  ),
  icon("align-bottom", [
    l(3.2, 11.6, 11.8, 11.6),
    r(4, 4.8, 2.2, 6.8, { rx: 0.45 }),
    r(8.8, 7.1, 2.2, 4.5, { rx: 0.45 }),
  ]),

  icon(
    "bold",
    [p("M4.2 3.4h3.6a2 2 0 0 1 0 4H4.2z"), p("M4.2 7.4h4a2 2 0 0 1 0 4h-4z")],
    {
      aliases: ["heading", "font", "typography"],
    },
  ),
  icon(
    "italic",
    [l(6.2, 3.4, 10.2, 3.4), l(4.8, 11.4, 8.8, 11.4), l(9.2, 3.4, 5.8, 11.4)],
    {
      aliases: ["heading-1", "font-size", "typography-alt"],
    },
  ),
  icon(
    "underline",
    [
      l(4.6, 3.4, 4.6, 7.7),
      l(10.4, 3.4, 10.4, 7.7),
      p("M4.6 7.7a2.9 2.9 0 0 0 5.8 0"),
      l(3.6, 11.6, 11.4, 11.6),
    ],
    {
      aliases: [
        "heading-2",
        "text-wrap",
        "line-height",
        "letter-spacing",
        "paragraph-spacing",
      ],
    },
  ),
  icon(
    "strikethrough",
    [
      l(3.6, 7.5, 11.4, 7.5),
      p("M4.6 5.4a2 2 0 0 1 2-2h1.8a2 2 0 0 1 2 2"),
      p("M10.4 9.6a2 2 0 0 1-2 2H6.6a2 2 0 0 1-2-2"),
    ],
    {
      aliases: ["heading-3", "text-truncate", "text-rotate"],
    },
  ),
  icon(
    "list-ordered",
    [
      l(6.2, 4.3, 11.8, 4.3),
      l(6.2, 7.5, 11.8, 7.5),
      l(6.2, 10.7, 11.8, 10.7),
      p("M2.8 4h1V6"),
      p("M2.8 7.2h1"),
      p("M2.8 8.3h1a.5.5 0 0 1 .5.5v.4a.5.5 0 0 1-.5.5h-1"),
    ],
    {
      aliases: ["checklist", "indent", "outdent"],
    },
  ),
  icon(
    "list-unordered",
    [
      c(3.4, 4.3, 0.5, { fill: "currentColor", stroke: "none" }),
      c(3.4, 7.5, 0.5, { fill: "currentColor", stroke: "none" }),
      c(3.4, 10.7, 0.5, { fill: "currentColor", stroke: "none" }),
      l(6.2, 4.3, 11.8, 4.3),
      l(6.2, 7.5, 11.8, 7.5),
      l(6.2, 10.7, 11.8, 10.7),
    ],
    {
      aliases: ["paragraph", "quote"],
    },
  ),
  icon(
    "keyboard",
    [
      r(2.8, 4.1, 9.4, 6.8, { rx: 0.9 }),
      l(4, 6, 10.9, 6),
      l(4, 7.8, 10.9, 7.8),
      l(4.8, 9.6, 10.2, 9.6),
    ],
    {
      aliases: ["mouse", "gamepad", "controller", "plug", "usb", "bluetooth"],
    },
  ),
  icon(
    "branch",
    [
      c(4.4, 3.8, 1),
      c(10.6, 4.6, 1),
      c(10.6, 10.9, 1),
      l(5.4, 3.8, 8.6, 3.8),
      p("M8.6 3.8a2 2 0 0 1 2 2v4.1"),
    ],
    {
      aliases: [
        "merge",
        "split",
        "commit",
        "pull-request",
        "git",
        "github",
        "gitlab",
        "bitbucket",
        "docker",
        "kubernetes",
        "cloudflare",
        "aws",
        "azure",
        "google-cloud",
      ],
    },
  ),
  icon(
    "accessibility",
    [
      c(7.5, 4, 1),
      l(7.5, 5.2, 7.5, 9.8),
      l(4.8, 6.7, 10.2, 6.7),
      l(5.1, 12, 7.5, 9.8),
      l(9.9, 12, 7.5, 9.8),
    ],
    {
      aliases: ["accessibility-alt"],
    },
  ),
  icon("contrast", [c(7.5, 7.5, 4.7), p("M7.5 2.8a4.7 4.7 0 0 1 0 9.4z")], {
    aliases: [
      "contrast-high",
      "contrast-low",
      "theme",
      "theme-dark",
      "theme-light",
    ],
  }),
  icon(
    "palette",
    [
      c(7.5, 7.5, 4.7),
      c(5.2, 6.1, 0.65, { fill: "currentColor", stroke: "none" }),
      c(7.4, 5.1, 0.65, { fill: "currentColor", stroke: "none" }),
      c(9.6, 6.1, 0.65, { fill: "currentColor", stroke: "none" }),
      p(
        "M10.4 9.9c.6 0 1.1.5 1.1 1.1A1.9 1.9 0 0 1 9.6 13c-2.9 0-6.8-1.9-6.8-5.5A4.7 4.7 0 0 1 7.5 2.8",
      ),
    ],
    {
      aliases: ["palette-alt", "adobe", "figma", "sketch"],
    },
  ),
  icon(
    "border",
    [
      r(3.1, 3.1, 8.8, 8.8, { rx: 1 }),
      l(3.1, 3.1, 11.9, 3.1),
      l(3.1, 11.9, 11.9, 11.9),
      l(3.1, 3.1, 3.1, 11.9),
      l(11.9, 3.1, 11.9, 11.9),
    ],
    {
      aliases: [
        "border-all",
        "border-top",
        "border-bottom",
        "border-left",
        "border-right",
        "border-none",
        "border-radius",
        "border-radius-top",
        "border-radius-bottom",
      ],
    },
  ),
  icon(
    "shadow",
    [
      r(3.2, 3.2, 7.2, 7.2, { rx: 0.8 }),
      p("M4.8 11.9h6.8a2.2 2.2 0 0 0-2.2-2.2H2.6a2.2 2.2 0 0 0 2.2 2.2z"),
    ],
    {
      aliases: [
        "shadow-sm",
        "shadow-md",
        "shadow-lg",
        "elevation-1",
        "elevation-2",
        "elevation-3",
        "elevation-4",
        "opacity",
        "transparency",
        "blur",
        "backdrop-blur",
        "backdrop-opacity",
        "glass",
        "glass-effect",
      ],
    },
  ),
  icon(
    "spinner",
    [p("M7.5 2.8a4.7 4.7 0 1 0 4.7 4.7"), l(7.5, 2.8, 7.5, 4.4)],
    {
      aliases: [
        "loading",
        "loading-dots",
        "loading-bars",
        "loading-ring",
        "skeleton",
        "skeleton-text",
        "skeleton-avatar",
        "progress",
        "progress-bar",
        "progress-circle",
        "progress-step",
        "stepper",
        "stepper-horizontal",
        "stepper-vertical",
        "wizard",
        "wizard-step",
        "tab",
        "tab-active",
        "tab-inactive",
        "tab-add",
        "accordion",
        "accordion-open",
        "accordion-close",
        "collapse-horizontal",
        "collapse-vertical",
      ],
    },
  ),
  icon(
    "tooltip",
    [
      r(2.8, 3.2, 9.4, 6.4, { rx: 1 }),
      p("M6.4 9.6 5.4 11.8l2-.9"),
      l(7.5, 5.2, 7.5, 6.6),
      c(7.5, 8, 0.5, { fill: "currentColor", stroke: "none" }),
    ],
    {
      aliases: [
        "tooltip-top",
        "tooltip-bottom",
        "tooltip-left",
        "tooltip-right",
        "popover",
        "modal",
        "modal-open",
        "modal-close",
        "drawer",
        "drawer-left",
        "drawer-right",
        "toast",
        "snackbar",
        "banner",
        "alert-banner",
        "chip-filled",
        "chip-outline",
        "badge-dot",
        "badge-number",
        "avatar",
        "avatar-group",
        "avatar-add",
        "breadcrumb",
        "breadcrumb-separator",
        "pagination",
        "pagination-first",
        "pagination-last",
        "pagination-next",
        "pagination-prev",
      ],
    },
  ),

  // Promoted semantic terms as dedicated icons.
  icon(
    "dropdown",
    [
      r(3, 3.3, 9, 8.4, { rx: 1.1 }),
      l(5.1, 5.8, 9.9, 5.8),
      polyline("5.35 7.95 7.5 9.9 9.65 7.95"),
    ],
    {
      aliases: [
        "dropdown-open",
        "dropdown-close",
        "combobox",
        "autocomplete",
        "autocomplete-multiple",
      ],
    },
  ),
  icon(
    "select",
    [r(3, 3.3, 9, 8.4, { rx: 1.1 }), polyline("4.95 7.95 6.8 9.8 10.05 6.55")],
    {
      aliases: ["select-multiple", "multiselect"],
    },
  ),
  icon(
    "radio",
    [
      c(7.5, 7.5, 4.35),
      c(7.5, 7.5, 1.45, { fill: "currentColor", stroke: "none" }),
    ],
    {
      aliases: ["radio-checked"],
    },
  ),
  icon(
    "checkbox",
    [
      r(3.15, 3.15, 8.7, 8.7, { rx: 1.35 }),
      polyline("5 7.6 6.75 9.35 10.05 6.05"),
    ],
    {
      aliases: ["checkbox-checked", "checkbox-indeterminate"],
    },
  ),
  icon(
    "switch-on",
    [
      r(2.8, 5.2, 9.4, 4.6, { rx: 2.3 }),
      c(9.9, 7.5, 1.5, { fill: "currentColor", stroke: "none" }),
    ],
    {
      aliases: ["toggle-on"],
    },
  ),
  icon(
    "switch-off",
    [
      r(2.8, 5.2, 9.4, 4.6, { rx: 2.3 }),
      c(5.1, 7.5, 1.5, { fill: "currentColor", stroke: "none" }),
    ],
    {
      aliases: ["toggle-off"],
    },
  ),
  icon("input", [r(2.8, 4.6, 9.4, 5.8, { rx: 1 }), l(4.5, 7.5, 10.5, 7.5)], {
    aliases: [
      "input-text",
      "input-number",
      "input-password",
      "input-search",
      "input-error",
      "input-success",
      "input-warning",
      "font-color",
    ],
  }),
  icon(
    "form",
    [
      r(3, 2.8, 9, 9.6, { rx: 1 }),
      l(5, 5.1, 10, 5.1),
      l(5, 7.4, 10, 7.4),
      l(5, 9.7, 8.3, 9.7),
    ],
    {
      aliases: ["form-group", "form-section"],
    },
  ),
  icon("validation", [c(7.5, 7.5, 4.6), p("M5.2 7.6 6.9 9.3 9.9 6.3")], {
    aliases: ["validation-success", "validation-error", "validation-warning"],
  }),
  icon(
    "error-state",
    [c(7.5, 7.5, 4.6), l(5.7, 5.7, 9.3, 9.3), l(9.3, 5.7, 5.7, 9.3)],
    {
      aliases: ["state-error"],
    },
  ),
  icon(
    "empty-state",
    [r(3.1, 3.1, 8.8, 8.8, { rx: 1 }), l(5.2, 7.5, 9.8, 7.5)],
    {
      aliases: ["state-empty"],
    },
  ),
  icon("success-state", [c(7.5, 7.5, 4.6), p("M5.2 7.6 6.9 9.3 9.9 6.3")], {
    aliases: ["state-success"],
  }),
  icon(
    "hover-state",
    [
      r(3.1, 3.1, 8.8, 8.8, { rx: 1 }),
      c(7.5, 7.5, 1.2, { fill: "currentColor", stroke: "none" }),
    ],
    {
      aliases: [
        "active-state",
        "disabled-state",
        "state-default",
        "state-hover",
        "state-active",
        "state-focus",
        "state-disabled",
      ],
    },
  ),
  icon("divider", [l(2.9, 7.5, 12.1, 7.5)], {
    aliases: ["divider-horizontal", "divider-vertical", "spacer"],
  }),
  icon(
    "responsive",
    [
      r(2.9, 3.6, 7.2, 5.2, { rx: 0.8 }),
      r(10.5, 4.5, 2.6, 6.2, { rx: 0.7 }),
      l(4.9, 11.2, 8.1, 11.2),
    ],
    {
      aliases: [
        "responsive-mobile",
        "responsive-tablet",
        "responsive-desktop",
        "breakpoint",
        "breakpoint-sm",
        "breakpoint-md",
        "breakpoint-lg",
        "container-fluid",
        "viewport",
        "viewport-fit",
        "safe-area",
      ],
    },
  ),
  icon(
    "aspect-ratio",
    [r(2.8, 3.4, 9.4, 8.2, { rx: 1 }), l(4.2, 10.2, 10.8, 4.6)],
    {
      aliases: ["ratio-16-9", "ratio-4-3"],
    },
  ),
  icon(
    "expand-horizontal",
    [
      l(3.3, 7.5, 11.7, 7.5),
      polyline("5 5.8 3.3 7.5 5 9.2"),
      polyline("10 5.8 11.7 7.5 10 9.2"),
    ],
    {
      aliases: ["expand-vertical"],
    },
  ),
  icon(
    "layout-stack",
    [
      r(3.2, 3.1, 8.6, 3, { rx: 0.7 }),
      r(3.2, 7.1, 8.6, 3, { rx: 0.7 }),
      r(3.2, 11.1, 8.6, 1.8, { rx: 0.7 }),
    ],
    {
      aliases: [
        "layout-inline",
        "layout-centered",
        "layout-split",
        "layout-overlay",
        "layout-floating",
        "masonry",
        "flex-layout",
        "auto-layout",
      ],
    },
  ),
  icon(
    "layer-lock",
    [
      polygon("7.5,2.8 11.4,4.9 11.4,9.3 7.5,11.4 3.6,9.3 3.6,4.9"),
      r(6.4, 7.2, 2.2, 2.3, { rx: 0.4 }),
      p("M6.9 7.2V6.6a1.1 1.1 0 1 1 2.2 0v.6"),
    ],
    {
      aliases: ["layer-unlock", "layer-front", "layer-back", "z-index"],
    },
  ),
  icon(
    "frame",
    [
      l(2.8, 5.6, 2.8, 2.8),
      l(2.8, 2.8, 5.6, 2.8),
      l(9.4, 2.8, 12.2, 2.8),
      l(12.2, 2.8, 12.2, 5.6),
      l(12.2, 9.4, 12.2, 12.2),
      l(12.2, 12.2, 9.4, 12.2),
      l(5.6, 12.2, 2.8, 12.2),
      l(2.8, 12.2, 2.8, 9.4),
    ],
    {
      aliases: [
        "frame-alt",
        "artboard",
        "wireframe",
        "mockup",
        "prototype",
        "prototype-link",
        "ui-kit",
      ],
    },
  ),
  icon(
    "interaction",
    [c(7.5, 7.5, 4.6), p("M7.5 4.6v2.9l2 1.2"), l(10.9, 3.9, 12.1, 2.7)],
    {
      aliases: [
        "interaction-click",
        "interaction-hover",
        "microinteraction",
        "motion",
        "gesture",
        "gesture-swipe",
        "gesture-tap",
        "gesture-pinch",
        "gesture-zoom",
        "hand",
        "hand-pointer",
        "hand-grab",
        "hand-release",
      ],
    },
  ),
  icon("animation", [c(7.5, 7.5, 4.6), polyline("7.5 4.6 10.4 7.5 7.5 10.4")], {
    aliases: [
      "animation-fade",
      "animation-slide",
      "animation-scale",
      "animation-rotate",
      "transition",
      "transition-fast",
      "transition-slow",
      "easing",
      "easing-in",
      "easing-out",
      "easing-in-out",
    ],
  }),
  icon(
    "scroll",
    [
      r(5.7, 2.8, 3.6, 9.9, { rx: 1.6 }),
      l(7.5, 4.2, 7.5, 10.8),
      polyline("6.6 5.1 7.5 4.2 8.4 5.1"),
      polyline("6.6 9.9 7.5 10.8 8.4 9.9"),
    ],
    {
      aliases: [
        "scroll-horizontal",
        "scroll-vertical",
        "infinite-scroll",
        "virtual-scroll",
        "sticky",
        "sticky-top",
        "sticky-bottom",
      ],
    },
  ),
  icon(
    "anchor",
    [l(7.5, 3, 7.5, 11.8), c(7.5, 3, 1), p("M3.6 8.2h7.8a2.4 2.4 0 0 1-4.8 0")],
    {
      aliases: ["anchor-link", "anchor-broken", "hotspot"],
    },
  ),
  icon(
    "design-token",
    [
      r(3.1, 3.1, 8.8, 8.8, { rx: 1 }),
      c(5.5, 5.5, 0.7, { fill: "currentColor", stroke: "none" }),
      c(7.5, 7.5, 0.7, { fill: "currentColor", stroke: "none" }),
      c(9.5, 9.5, 0.7, { fill: "currentColor", stroke: "none" }),
    ],
    {
      aliases: [
        "color-token",
        "spacing-token",
        "font-token",
        "icon-token",
        "variable",
        "variable-alt",
        "component-instance",
        "component-master",
        "variant",
        "variant-alt",
      ],
    },
  ),
  icon(
    "alignment",
    [
      l(3, 4.2, 12, 4.2),
      l(4.2, 6.4, 10.8, 6.4),
      l(3.6, 8.6, 11.4, 8.6),
      l(5.1, 10.8, 9.9, 10.8),
    ],
    {
      aliases: [
        "alignment-horizontal",
        "alignment-vertical",
        "distribute-horizontal",
        "distribute-vertical",
        "auto-spacing",
        "wrap",
        "unwrap",
        "overflow",
        "overflow-hidden",
        "overflow-scroll",
        "clipping-mask",
        "mask",
        "mask-inverse",
        "gradient",
        "gradient-linear",
        "gradient-radial",
        "gradient-conic",
        "fill",
        "stroke",
        "stroke-width",
        "stroke-dash",
        "icon-outline",
        "icon-filled",
        "icon-duotone",
        "icon-rounded",
        "icon-sharp",
        "icon-thin",
        "icon-bold",
        "pixel-grid",
        "vector",
        "vector-pen",
        "bezier",
        "path",
        "path-merge",
        "path-subtract",
        "path-intersect",
        "path-exclude",
        "corner",
        "corner-round",
        "corner-cut",
        "corner-smooth",
        "ruler",
        "ruler-horizontal",
        "ruler-vertical",
        "guide",
        "guide-horizontal",
        "guide-vertical",
        "snapping",
        "snapping-grid",
        "snapping-object",
        "docking",
        "docking-left",
        "docking-right",
        "docking-top",
        "docking-bottom",
      ],
    },
  ),
  icon(
    "preview",
    [
      r(2.8, 3.4, 9.4, 8.2, { rx: 1 }),
      c(7.5, 7.5, 1.7),
      c(7.5, 7.5, 0.7, { fill: "currentColor", stroke: "none" }),
    ],
    {
      aliases: [
        "preview-device",
        "preview-mobile",
        "preview-tablet",
        "preview-desktop",
        "preview-live",
      ],
    },
  ),
  icon(
    "inspect",
    [
      r(2.8, 3.4, 7.8, 7.8, { rx: 1 }),
      c(9.5, 9.5, 2),
      l(10.9, 10.9, 12.3, 12.3),
    ],
    {
      aliases: [
        "inspect-element",
        "inspect-code",
        "accessibility-contrast",
        "accessibility-font",
        "accessibility-zoom",
        "accessibility-audio",
        "accessibility-visual",
        "keyboard-navigation",
        "tab-order",
        "aria",
        "aria-label",
        "aria-hidden",
        "focus-trap",
        "screen-reader",
        "screen-reader-only",
        "audit",
        "audit-ui",
        "audit-performance",
        "lighthouse",
        "debug",
        "debug-grid",
        "debug-layout",
        "debug-spacing",
        "performance",
        "performance-ui",
        "performance-render",
        "memory-usage",
        "fps",
        "benchmark",
        "optimization",
        "optimization-auto",
        "optimization-manual-admin",
      ],
    },
  ),
  // Icon Sets: Objects, Abstract, Logos, Alignment, Borders/Corners, Arrows, Design, Typography.
  icon(
    "object-sphere",
    [
      c(7.5, 7.5, 4.7),
      l(2.8, 7.5, 12.2, 7.5),
      p("M7.5 2.8c1.2 1.25 1.9 2.95 1.9 4.7s-.7 3.45-1.9 4.7"),
      p("M7.5 2.8C6.3 4.05 5.6 5.75 5.6 7.5s.7 3.45 1.9 4.7"),
    ],
    {
      categories: ["objects"],
    },
  ),
  icon(
    "object-cylinder",
    [
      p(
        "M3.8 4.6c0-1.25 1.65-2.2 3.7-2.2s3.7.95 3.7 2.2-1.65 2.2-3.7 2.2-3.7-.95-3.7-2.2z",
      ),
      l(3.8, 4.6, 3.8, 10.3),
      l(11.2, 4.6, 11.2, 10.3),
      p("M3.8 10.3c0 1.25 1.65 2.2 3.7 2.2s3.7-.95 3.7-2.2"),
    ],
    {
      categories: ["objects"],
    },
  ),
  icon(
    "object-cone",
    [
      p("M7.5 2.8 3.9 10.2"),
      p("M7.5 2.8 11.1 10.2"),
      p("M3.8 10.2c0-1.1 1.65-2 3.7-2s3.7.9 3.7 2-1.65 2-3.7 2-3.7-.9-3.7-2z"),
    ],
    {
      categories: ["objects"],
    },
  ),
  icon(
    "object-pyramid",
    [
      polygon("7.5,2.9 11.9,10.8 3.1,10.8"),
      l(7.5, 2.9, 7.5, 10.8),
      l(3.1, 10.8, 11.9, 10.8),
    ],
    {
      categories: ["objects"],
    },
  ),
  icon(
    "object-prism",
    [
      polygon("4.3,3.2 9.3,3.2 11.7,6.4 6.7,6.4"),
      polygon("4.3,3.2 4.3,9.8 9.3,9.8 9.3,3.2"),
      polygon("9.3,3.2 11.7,6.4 11.7,12.2 9.3,9.8"),
    ],
    {
      categories: ["objects"],
    },
  ),
  icon(
    "object-cube-wire",
    [
      polygon("4,4.1 8.1,4.1 8.1,8.2 4,8.2"),
      polygon("6.9,2.8 11,2.8 11,6.9 6.9,6.9"),
      l(8.1, 4.1, 11, 2.8),
      l(8.1, 8.2, 11, 6.9),
      l(4, 4.1, 6.9, 2.8),
      l(4, 8.2, 6.9, 6.9),
    ],
    {
      categories: ["objects"],
    },
  ),
  icon("object-ring", [c(7.5, 7.5, 4.7), c(7.5, 7.5, 2.2)], {
    categories: ["objects"],
  }),
  icon(
    "object-orbital",
    [
      c(7.5, 7.5, 0.8, { fill: "currentColor", stroke: "none" }),
      p(
        "M2.8 7.5c1.5-2.7 3.2-4.1 4.7-4.1s3.2 1.4 4.7 4.1c-1.5 2.7-3.2 4.1-4.7 4.1S4.3 10.2 2.8 7.5z",
      ),
      p(
        "M7.5 2.8c2.7 1.5 4.1 3.2 4.1 4.7s-1.4 3.2-4.1 4.7c-2.7-1.5-4.1-3.2-4.1-4.7s1.4-3.2 4.1-4.7",
      ),
    ],
    {
      categories: ["objects"],
    },
  ),

  icon(
    "abstract-waves",
    [
      p("M2.8 5.2c1.1-1 2.1-1 3.2 0s2.1 1 3.2 0 2.1-1 3.2 0"),
      p("M2.8 7.5c1.1-1 2.1-1 3.2 0s2.1 1 3.2 0 2.1-1 3.2 0"),
      p("M2.8 9.8c1.1-1 2.1-1 3.2 0s2.1 1 3.2 0 2.1-1 3.2 0"),
    ],
    {
      categories: ["abstract"],
    },
  ),
  icon(
    "abstract-spiral",
    [
      p(
        "M7.5 2.9a4.6 4.6 0 1 0 4.6 4.6c0-1.8-1.4-3.2-3.2-3.2s-3.2 1.4-3.2 3.2 1.2 2.9 2.9 2.9",
      ),
    ],
    {
      categories: ["abstract"],
    },
  ),
  icon(
    "abstract-blob",
    [
      p(
        "M3.4 7.6c0-2.3 1.6-4.3 4-4.3 2.7 0 4.2 1.9 4.2 4 0 2.4-1.7 4.4-4.1 4.4-2.5 0-4.1-1.7-4.1-4.1z",
      ),
    ],
    {
      categories: ["abstract"],
    },
  ),
  icon(
    "abstract-orbit",
    [
      c(7.5, 7.5, 0.65, { fill: "currentColor", stroke: "none" }),
      p(
        "M2.8 7.5c1.3-2.5 2.9-3.8 4.7-3.8s3.4 1.3 4.7 3.8c-1.3 2.5-2.9 3.8-4.7 3.8S4.1 10 2.8 7.5z",
      ),
      p(
        "M7.5 2.8c2.5 1.3 3.8 2.9 3.8 4.7s-1.3 3.4-3.8 4.7c-2.5-1.3-3.8-2.9-3.8-4.7s1.3-3.4 3.8-4.7",
      ),
    ],
    {
      categories: ["abstract"],
    },
  ),
  icon(
    "abstract-mesh",
    [
      c(4.1, 4.1, 0.55, { fill: "currentColor", stroke: "none" }),
      c(10.9, 4.1, 0.55, { fill: "currentColor", stroke: "none" }),
      c(7.5, 7.5, 0.55, { fill: "currentColor", stroke: "none" }),
      c(4.1, 10.9, 0.55, { fill: "currentColor", stroke: "none" }),
      c(10.9, 10.9, 0.55, { fill: "currentColor", stroke: "none" }),
      l(4.1, 4.1, 7.5, 7.5),
      l(10.9, 4.1, 7.5, 7.5),
      l(4.1, 10.9, 7.5, 7.5),
      l(10.9, 10.9, 7.5, 7.5),
      l(4.1, 4.1, 10.9, 4.1),
      l(4.1, 10.9, 10.9, 10.9),
    ],
    {
      categories: ["abstract"],
    },
  ),
  icon(
    "abstract-fractal",
    [
      l(7.5, 12.2, 7.5, 8.6),
      l(7.5, 8.6, 5.1, 6.2),
      l(7.5, 8.6, 9.9, 6.2),
      l(5.1, 6.2, 3.6, 4.7),
      l(5.1, 6.2, 6.6, 4.7),
      l(9.9, 6.2, 8.4, 4.7),
      l(9.9, 6.2, 11.4, 4.7),
    ],
    {
      categories: ["abstract"],
    },
  ),

  // Developer Tools
  icon(
    "logo-github",
    [fp("M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12")],
    {
      viewBox: "0 0 24 24",
      categories: ["logos"],
    },
  ),
  icon(
    "logo-gitlab",
    [fp("m23.6004 9.5927-.0337-.0862L20.3.9814a.851.851 0 0 0-.3362-.405.8748.8748 0 0 0-.9997.0539.8748.8748 0 0 0-.29.4399l-2.2055 6.748H7.5375l-2.2057-6.748a.8573.8573 0 0 0-.29-.4412.8748.8748 0 0 0-.9997-.0537.8585.8585 0 0 0-.3362.4049L.4332 9.5015l-.0325.0862a6.0657 6.0657 0 0 0 2.0119 7.0105l.0113.0087.03.0213 4.976 3.7264 2.462 1.8633 1.4995 1.1321a1.0085 1.0085 0 0 0 1.2197 0l1.4995-1.1321 2.4619-1.8633 5.006-3.7489.0125-.01a6.0682 6.0682 0 0 0 2.0094-7.003z")],
    {
      viewBox: "0 0 24 24",
      categories: ["logos"],
    },
  ),
  icon(
    "logo-bitbucket",
    [fp("M.778 1.213a.768.768 0 00-.768.892l3.263 19.81c.084.5.515.868 1.022.873H19.95a.772.772 0 00.77-.646l3.27-20.03a.768.768 0 00-.768-.891zM14.52 15.53H9.522L8.17 8.466h7.561z")],
    {
      viewBox: "0 0 24 24",
      categories: ["logos"],
    },
  ),
  icon(
    "logo-figma",
    [fp("M15.852 8.981h-4.588V0h4.588c2.476 0 4.49 2.014 4.49 4.49s-2.014 4.491-4.49 4.491zM12.735 7.51h3.117c1.665 0 3.019-1.355 3.019-3.019s-1.355-3.019-3.019-3.019h-3.117V7.51zm0 1.471H8.148c-2.476 0-4.49-2.014-4.49-4.49S5.672 0 8.148 0h4.588v8.981zm-4.587-7.51c-1.665 0-3.019 1.355-3.019 3.019s1.354 3.02 3.019 3.02h3.117V1.471H8.148zm4.587 15.019H8.148c-2.476 0-4.49-2.014-4.49-4.49s2.014-4.49 4.49-4.49h4.588v8.98zM8.148 8.981c-1.665 0-3.019 1.355-3.019 3.019s1.355 3.019 3.019 3.019h3.117V8.981H8.148zM8.172 24c-2.489 0-4.515-2.014-4.515-4.49s2.014-4.49 4.49-4.49h4.588v4.441c0 2.503-2.047 4.539-4.563 4.539zm-.024-7.51a3.023 3.023 0 0 0-3.019 3.019c0 1.665 1.365 3.019 3.044 3.019 1.705 0 3.093-1.376 3.093-3.068v-2.97H8.148zm7.704 0h-.098c-2.476 0-4.49-2.014-4.49-4.49s2.014-4.49 4.49-4.49h.098c2.476 0 4.49 2.014 4.49 4.49s-2.014 4.49-4.49 4.49zm-.097-7.509c-1.665 0-3.019 1.355-3.019 3.019s1.355 3.019 3.019 3.019h.098c1.665 0 3.019-1.355 3.019-3.019s-1.355-3.019-3.019-3.019h-.098z")],
    {
      viewBox: "0 0 24 24",
      categories: ["logos"],
    },
  ),
  icon(
    "logo-slack",
    [fp("M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z")],
    {
      viewBox: "0 0 24 24",
      categories: ["logos"],
    },
  ),
  icon(
    "logo-discord",
    [fp("M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z")],
    {
      viewBox: "0 0 24 24",
      categories: ["logos"],
    },
  ),
  icon(
    "logo-linkedin",
    [fp("M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z")],
    {
      viewBox: "0 0 24 24",
      categories: ["logos"],
    },
  ),
  icon(
    "logo-youtube",
    [fp("M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z")],
    {
      viewBox: "0 0 24 24",
      categories: ["logos"],
    },
  ),

  // Social Media Icons
  icon(
    "logo-instagram",
    [fp("M7.0301.084c-1.2768.0602-2.1487.264-2.911.5634-.7888.3075-1.4575.72-2.1228 1.3877-.6652.6677-1.075 1.3368-1.3802 2.127-.2954.7638-.4956 1.6365-.552 2.914-.0564 1.2775-.0689 1.6882-.0626 4.947.0062 3.2586.0206 3.6671.0825 4.9473.061 1.2765.264 2.1482.5635 2.9107.308.7889.72 1.4573 1.388 2.1228.6679.6655 1.3365 1.0743 2.1285 1.38.7632.295 1.6361.4961 2.9134.552 1.2773.056 1.6884.069 4.9462.0627 3.2578-.0062 3.668-.0207 4.9478-.0814 1.28-.0607 2.147-.2652 2.9098-.5633.7889-.3086 1.4578-.72 2.1228-1.3881.665-.6682 1.0745-1.3378 1.3795-2.1284.2957-.7632.4966-1.636.552-2.9124.056-1.2809.0692-1.6898.063-4.948-.0063-3.2583-.021-3.6668-.0817-4.9465-.0607-1.2797-.264-2.1487-.5633-2.9117-.3084-.7889-.72-1.4568-1.3876-2.1228C21.2982 1.33 20.628.9208 19.8378.6165 19.074.321 18.2017.1197 16.9244.0645 15.6471.0093 15.236-.005 11.977.0014 8.718.0076 8.31.0215 7.0301.0839m.1402 21.6932c-1.17-.0509-1.8053-.2453-2.2287-.408-.5606-.216-.96-.4771-1.3819-.895-.422-.4178-.6811-.8186-.9-1.378-.1644-.4234-.3624-1.058-.4171-2.228-.0595-1.2645-.072-1.6442-.079-4.848-.007-3.2037.0053-3.583.0607-4.848.05-1.169.2456-1.805.408-2.2282.216-.5613.4762-.96.895-1.3816.4188-.4217.8184-.6814 1.3783-.9003.423-.1651 1.0575-.3614 2.227-.4171 1.2655-.06 1.6447-.072 4.848-.079 3.2033-.007 3.5835.005 4.8495.0608 1.169.0508 1.8053.2445 2.228.408.5608.216.96.4754 1.3816.895.4217.4194.6816.8176.9005 1.3787.1653.4217.3617 1.056.4169 2.2263.0602 1.2655.0739 1.645.0796 4.848.0058 3.203-.0055 3.5834-.061 4.848-.051 1.17-.245 1.8055-.408 2.2294-.216.5604-.4763.96-.8954 1.3814-.419.4215-.8181.6811-1.3783.9-.4224.1649-1.0577.3617-2.2262.4174-1.2656.0595-1.6448.072-4.8493.079-3.2045.007-3.5825-.006-4.848-.0608M16.953 5.5864A1.44 1.44 0 1 0 18.39 4.144a1.44 1.44 0 0 0-1.437 1.4424M5.8385 12.012c.0067 3.4032 2.7706 6.1557 6.173 6.1493 3.4026-.0065 6.157-2.7701 6.1506-6.1733-.0065-3.4032-2.771-6.1565-6.174-6.1498-3.403.0067-6.156 2.771-6.1496 6.1738M8 12.0077a4 4 0 1 1 4.008 3.9921A3.9996 3.9996 0 0 1 8 12.0077")],
    {
      viewBox: "0 0 24 24",
      categories: ["social"],
    },
  ),
  icon(
    "logo-facebook",
    [fp("M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z")],
    {
      viewBox: "0 0 24 24",
      categories: ["social"],
    },
  ),
  icon(
    "logo-twitter",
    [fp("M14.234 10.162 22.977 0h-2.072l-7.591 8.824L7.251 0H.258l9.168 13.343L.258 24H2.33l8.016-9.318L16.749 24h6.993zm-2.837 3.299-.929-1.329L3.076 1.56h3.182l5.965 8.532.929 1.329 7.754 11.09h-3.182z")],
    {
      viewBox: "0 0 24 24",
      categories: ["social"],
    },
  ),
  icon(
    "logo-whatsapp",
    [fp("M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z")],
    {
      viewBox: "0 0 24 24",
      categories: ["social"],
    },
  ),
  icon(
    "logo-telegram",
    [fp("M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z")],
    {
      viewBox: "0 0 24 24",
      categories: ["social"],
    },
  ),
  icon(
    "logo-tiktok",
    [fp("M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z")],
    {
      viewBox: "0 0 24 24",
      categories: ["social"],
    },
  ),
  icon(
    "logo-pinterest",
    [fp("M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z")],
    {
      viewBox: "0 0 24 24",
      categories: ["social"],
    },
  ),
  icon(
    "logo-reddit",
    [fp("M12 0C5.373 0 0 5.373 0 12c0 3.314 1.343 6.314 3.515 8.485l-2.286 2.286C.775 23.225 1.097 24 1.738 24H12c6.627 0 12-5.373 12-12S18.627 0 12 0Zm4.388 3.199c1.104 0 1.999.895 1.999 1.999 0 1.105-.895 2-1.999 2-.946 0-1.739-.657-1.947-1.539v.002c-1.147.162-2.032 1.15-2.032 2.341v.007c1.776.067 3.4.567 4.686 1.363.473-.363 1.064-.58 1.707-.58 1.547 0 2.802 1.254 2.802 2.802 0 1.117-.655 2.081-1.601 2.531-.088 3.256-3.637 5.876-7.997 5.876-4.361 0-7.905-2.617-7.998-5.87-.954-.447-1.614-1.415-1.614-2.538 0-1.548 1.255-2.802 2.803-2.802.645 0 1.239.218 1.712.585 1.275-.79 2.881-1.291 4.64-1.365v-.01c0-1.663 1.263-3.034 2.88-3.207.188-.911.993-1.595 1.959-1.595Zm-8.085 8.376c-.784 0-1.459.78-1.506 1.797-.047 1.016.64 1.429 1.426 1.429.786 0 1.371-.369 1.418-1.385.047-1.017-.553-1.841-1.338-1.841Zm7.406 0c-.786 0-1.385.824-1.338 1.841.047 1.017.634 1.385 1.418 1.385.785 0 1.473-.413 1.426-1.429-.046-1.017-.721-1.797-1.506-1.797Zm-3.703 4.013c-.974 0-1.907.048-2.77.135-.147.015-.241.168-.183.305.483 1.154 1.622 1.964 2.953 1.964 1.33 0 2.47-.81 2.953-1.964.057-.137-.037-.29-.184-.305-.863-.087-1.795-.135-2.769-.135Z")],
    {
      viewBox: "0 0 24 24",
      categories: ["social"],
    },
  ),
  icon(
    "logo-snapchat",
    [fp("M12.206.793c.99 0 4.347.276 5.93 3.821.529 1.193.403 3.219.299 4.847l-.003.06c-.012.18-.022.345-.03.51.075.045.203.09.401.09.3-.016.659-.12 1.033-.301.165-.088.344-.104.464-.104.182 0 .359.029.509.09.45.149.734.479.734.838.015.449-.39.839-1.213 1.168-.089.029-.209.075-.344.119-.45.135-1.139.36-1.333.81-.09.224-.061.524.12.868l.015.015c.06.136 1.526 3.475 4.791 4.014.255.044.435.27.42.509 0 .075-.015.149-.045.225-.24.569-1.273.988-3.146 1.271-.059.091-.12.375-.164.57-.029.179-.074.36-.134.553-.076.271-.27.405-.555.405h-.03c-.135 0-.313-.031-.538-.074-.36-.075-.765-.135-1.273-.135-.3 0-.599.015-.913.074-.6.104-1.123.464-1.723.884-.853.599-1.826 1.288-3.294 1.288-.06 0-.119-.015-.18-.015h-.149c-1.468 0-2.427-.675-3.279-1.288-.599-.42-1.107-.779-1.707-.884-.314-.045-.629-.074-.928-.074-.54 0-.958.089-1.272.149-.211.043-.391.074-.54.074-.374 0-.523-.224-.583-.42-.061-.192-.09-.389-.135-.567-.046-.181-.105-.494-.166-.57-1.918-.222-2.95-.642-3.189-1.226-.031-.063-.052-.15-.055-.225-.015-.243.165-.465.42-.509 3.264-.54 4.73-3.879 4.791-4.02l.016-.029c.18-.345.224-.645.119-.869-.195-.434-.884-.658-1.332-.809-.121-.029-.24-.074-.346-.119-1.107-.435-1.257-.93-1.197-1.273.09-.479.674-.793 1.168-.793.146 0 .27.029.383.074.42.194.789.3 1.104.3.234 0 .384-.06.465-.105l-.046-.569c-.098-1.626-.225-3.651.307-4.837C7.392 1.077 10.739.807 11.727.807l.419-.015h.06z")],
    {
      viewBox: "0 0 24 24",
      categories: ["social"],
    },
  ),
  icon(
    "logo-threads",
    [fp("M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.964-.065-1.19.408-2.285 1.33-3.082.88-.76 2.119-1.207 3.583-1.291a13.853 13.853 0 0 1 3.02.142c-.126-.742-.375-1.332-.75-1.757-.513-.586-1.308-.883-2.359-.89h-.029c-.844 0-1.992.232-2.721 1.32L7.734 7.847c.98-1.454 2.568-2.256 4.478-2.256h.044c3.194.02 5.097 1.975 5.287 5.388.108.046.216.094.321.142 1.49.7 2.58 1.761 3.154 3.07.797 1.82.871 4.79-1.548 7.158-1.85 1.81-4.094 2.628-7.277 2.65Zm1.003-11.69c-.242 0-.487.007-.739.021-1.836.103-2.98.946-2.916 2.143.067 1.256 1.452 1.839 2.784 1.767 1.224-.065 2.818-.543 3.086-3.71a10.5 10.5 0 0 0-2.215-.221z")],
    {
      viewBox: "0 0 24 24",
      categories: ["social"],
    },
  ),
  icon(
    "logo-messenger",
    [fp("M12 0C5.24 0 0 4.952 0 11.64c0 3.499 1.434 6.521 3.769 8.61a.96.96 0 0 1 .323.683l.065 2.135a.96.96 0 0 0 1.347.85l2.381-1.053a.96.96 0 0 1 .641-.046A13 13 0 0 0 12 23.28c6.76 0 12-4.952 12-11.64S18.76 0 12 0m6.806 7.44c.522-.03.971.567.63 1.094l-4.178 6.457a.707.707 0 0 1-.977.208l-3.87-2.504a.44.44 0 0 0-.49.007l-4.363 3.01c-.637.438-1.415-.317-.995-.966l4.179-6.457a.706.706 0 0 1 .977-.21l3.87 2.505c.15.097.344.094.491-.007l4.362-3.008a.7.7 0 0 1 .364-.13")],
    {
      viewBox: "0 0 24 24",
      categories: ["social"],
    },
  ),
  icon(
    "logo-signal",
    [fp("M12 0q-.934 0-1.83.139l.17 1.111a11 11 0 0 1 3.32 0l.172-1.111A12 12 0 0 0 12 0M9.152.34A12 12 0 0 0 5.77 1.742l.584.961a10.8 10.8 0 0 1 3.066-1.27zm5.696 0-.268 1.094a10.8 10.8 0 0 1 3.066 1.27l.584-.962A12 12 0 0 0 14.848.34M12 2.25a9.75 9.75 0 0 0-8.539 14.459c.074.134.1.292.064.441l-1.013 4.338 4.338-1.013a.62.62 0 0 1 .441.064A9.7 9.7 0 0 0 12 21.75c5.385 0 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25m-7.092.068a12 12 0 0 0-2.59 2.59l.909.664a11 11 0 0 1 2.345-2.345zm14.184 0-.664.909a11 11 0 0 1 2.345 2.345l.909-.664a12 12 0 0 0-2.59-2.59M1.742 5.77A12 12 0 0 0 .34 9.152l1.094.268a10.8 10.8 0 0 1 1.269-3.066zm20.516 0-.961.584a10.8 10.8 0 0 1 1.27 3.066l1.093-.268a12 12 0 0 0-1.402-3.383M.138 10.168A12 12 0 0 0 0 12q0 .934.139 1.83l1.111-.17A11 11 0 0 1 1.125 12q0-.848.125-1.66zm23.723.002-1.111.17q.125.812.125 1.66c0 .848-.042 1.12-.125 1.66l1.111.172a12.1 12.1 0 0 0 0-3.662M1.434 14.58l-1.094.268a12 12 0 0 0 .96 2.591l-.265 1.14 1.096.255.36-1.539-.188-.365a10.8 10.8 0 0 1-.87-2.35m21.133 0a10.8 10.8 0 0 1-1.27 3.067l.962.584a12 12 0 0 0 1.402-3.383zm-1.793 3.848a11 11 0 0 1-2.345 2.345l.664.909a12 12 0 0 0 2.59-2.59zm-19.959 1.1L.357 21.48a1.8 1.8 0 0 0 2.162 2.161l1.954-.455-.256-1.095-1.953.455a.675.675 0 0 1-.81-.81l.454-1.954zm16.832 1.769a10.8 10.8 0 0 1-3.066 1.27l.268 1.093a12 12 0 0 0 3.382-1.402zm-10.94.213-1.54.36.256 1.095 1.139-.266c.814.415 1.683.74 2.591.961l.268-1.094a10.8 10.8 0 0 1-2.35-.869zm3.634 1.24-.172 1.111a12.1 12.1 0 0 0 3.662 0l-.17-1.111q-.812.125-1.66.125a11 11 0 0 1-1.66-.125")],
    {
      viewBox: "0 0 24 24",
      categories: ["social"],
    },
  ),
  icon(
    "logo-viber",
    [fp("M11.4 0C9.473.028 5.333.344 3.02 2.467 1.302 4.187.696 6.7.633 9.817.57 12.933.488 18.776 6.12 20.36h.003l-.004 2.416s-.037.977.61 1.177c.777.242 1.234-.5 1.98-1.302.407-.44.972-1.084 1.397-1.58 3.85.326 6.812-.416 7.15-.525.776-.252 5.176-.816 5.892-6.657.74-6.02-.36-9.83-2.34-11.546-.596-.55-3.006-2.3-8.375-2.323 0 0-.395-.025-1.037-.017zm.058 1.693c.545-.004.88.017.88.017 4.542.02 6.717 1.388 7.222 1.846 1.675 1.435 2.53 4.868 1.906 9.897v.002c-.604 4.878-4.174 5.184-4.832 5.395-.28.09-2.882.737-6.153.524 0 0-2.436 2.94-3.197 3.704-.12.12-.26.167-.352.144-.13-.033-.166-.188-.165-.414l.02-4.018c-4.762-1.32-4.485-6.292-4.43-8.895.054-2.604.543-4.738 1.996-6.173 1.96-1.773 5.474-2.018 7.11-2.03zm.38 2.602c-.167 0-.303.135-.304.302 0 .167.133.303.3.305 1.624.01 2.946.537 4.028 1.592 1.073 1.046 1.62 2.468 1.633 4.334.002.167.14.3.307.3.166-.002.3-.138.3-.304-.014-1.984-.618-3.596-1.816-4.764-1.19-1.16-2.692-1.753-4.447-1.765zm-3.96.695c-.19-.032-.4.005-.616.117l-.01.002c-.43.247-.816.562-1.146.932-.002.004-.006.004-.008.008-.267.323-.42.638-.46.948-.008.046-.01.093-.007.14 0 .136.022.27.065.4l.013.01c.135.48.473 1.276 1.205 2.604.42.768.903 1.5 1.446 2.186.27.344.56.673.87.984l.132.132c.31.308.64.6.984.87.686.543 1.418 1.027 2.186 1.447 1.328.733 2.126 1.07 2.604 1.206l.01.014c.13.042.265.064.402.063.046.002.092 0 .138-.008.31-.036.627-.19.948-.46.004 0 .003-.002.008-.005.37-.33.683-.72.93-1.148l.003-.01c.225-.432.15-.842-.18-1.12-.004 0-.698-.58-1.037-.83-.36-.255-.73-.492-1.113-.71-.51-.285-1.032-.106-1.248.174l-.447.564c-.23.283-.657.246-.657.246-3.12-.796-3.955-3.955-3.955-3.955s-.037-.426.248-.656l.563-.448c.277-.215.456-.737.17-1.248-.217-.383-.454-.756-.71-1.115-.25-.34-.826-1.033-.83-1.035-.137-.165-.31-.265-.502-.297zm4.49.88c-.158.002-.29.124-.3.282-.01.167.115.312.282.324 1.16.085 2.017.466 2.645 1.15.63.688.93 1.524.906 2.57-.002.168.13.306.3.31.166.003.305-.13.31-.297.025-1.175-.334-2.193-1.067-2.994-.74-.81-1.777-1.253-3.05-1.346h-.024zm.463 1.63c-.16.002-.29.127-.3.287-.008.167.12.31.288.32.523.028.875.175 1.113.422.24.245.388.62.416 1.164.01.167.15.295.318.287.167-.008.295-.15.287-.317-.03-.644-.215-1.178-.58-1.557-.367-.378-.893-.574-1.52-.607h-.018z")],
    {
      viewBox: "0 0 24 24",
      categories: ["social"],
    },
  ),

  // Communication & Video Apps
  icon(
    "logo-zoom",
    [fp("M5.033 14.649H.743a.74.74 0 0 1-.686-.458.74.74 0 0 1 .16-.808L3.19 10.41H1.06A1.06 1.06 0 0 1 0 9.35h3.957c.301 0 .57.18.686.458a.74.74 0 0 1-.161.808L1.51 13.59h2.464c.585 0 1.06.475 1.06 1.06zM24 11.338c0-1.14-.927-2.066-2.066-2.066-.61 0-1.158.265-1.537.686a2.061 2.061 0 0 0-1.536-.686c-1.14 0-2.066.926-2.066 2.066v3.311a1.06 1.06 0 0 0 1.06-1.06v-2.251a1.004 1.004 0 0 1 2.013 0v2.251c0 .586.474 1.06 1.06 1.06v-3.311a1.004 1.004 0 0 1 2.012 0v2.251c0 .586.475 1.06 1.06 1.06zM16.265 12a2.728 2.728 0 1 1-5.457 0 2.728 2.728 0 0 1 5.457 0zm-1.06 0a1.669 1.669 0 1 0-3.338 0 1.669 1.669 0 0 0 3.338 0zm-4.82 0a2.728 2.728 0 1 1-5.458 0 2.728 2.728 0 0 1 5.457 0zm-1.06 0a1.669 1.669 0 1 0-3.338 0 1.669 1.669 0 0 0 3.338 0z")],
    {
      viewBox: "0 0 24 24",
      categories: ["communication"],
    },
  ),
  icon(
    "logo-skype",
    [fp("M12.069 18.874c-4.023 0-5.82-1.979-5.82-3.464 0-.765.561-1.296 1.333-1.296 1.723 0 1.273 2.477 4.487 2.477 1.641 0 2.55-.895 2.55-1.811 0-.551-.269-1.16-1.354-1.429l-3.576-.895c-2.88-.724-3.403-2.286-3.403-3.751 0-3.047 2.861-4.191 5.549-4.191 2.471 0 5.393 1.373 5.393 3.199 0 .784-.688 1.24-1.453 1.24-1.469 0-1.198-2.037-4.164-2.037-1.469 0-2.292.664-2.292 1.617s1.153 1.258 2.157 1.487l2.637.587c2.891.649 3.624 2.346 3.624 3.944 0 2.476-1.902 4.324-5.722 4.324m11.084-4.882l-.029.135-.044-.24c.015.045.044.074.059.12.12-.675.181-1.363.181-2.052 0-1.529-.301-3.012-.898-4.42-.569-1.348-1.395-2.562-2.427-3.596-1.049-1.033-2.247-1.856-3.595-2.426-1.318-.631-2.801-.93-4.328-.93-.72 0-1.444.07-2.143.204l.119.06-.239-.033.119-.025C8.91.274 7.829 0 6.731 0c-1.789 0-3.47.698-4.736 1.967C.729 3.235.032 4.923.032 6.716c0 1.143.292 2.265.844 3.258l.02-.124.041.239-.06-.115c-.114.645-.172 1.299-.172 1.955 0 1.53.3 3.017.884 4.416.568 1.362 1.378 2.576 2.427 3.609 1.034 1.05 2.247 1.857 3.595 2.442 1.394.6 2.877.898 4.404.898.659 0 1.334-.06 1.977-.179l-.119-.062.24.046-.135.03c1.002.569 2.126.871 3.294.871 1.783 0 3.459-.69 4.733-1.963 1.259-1.259 1.962-2.951 1.962-4.749 0-1.138-.299-2.262-.853-3.266")],
    {
      viewBox: "0 0 24 24",
      categories: ["communication"],
    },
  ),

  // Tech & Cloud Brands
  icon(
    "logo-google",
    [fp("M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z")],
    {
      viewBox: "0 0 24 24",
      categories: ["tech"],
    },
  ),
  icon(
    "logo-google-drive",
    [fp("M12.01 1.485c-2.082 0-3.754.02-3.743.047.01.02 1.708 3.001 3.774 6.62l3.76 6.574h3.76c2.081 0 3.753-.02 3.742-.047-.005-.02-1.708-3.001-3.775-6.62l-3.76-6.574zm-4.76 1.73a789.828 789.861 0 0 0-3.63 6.319L0 15.868l1.89 3.298 1.885 3.297 3.62-6.335 3.618-6.33-1.88-3.287C8.1 4.704 7.255 3.22 7.25 3.214zm2.259 12.653-.203.348c-.114.198-.96 1.672-1.88 3.287a423.93 423.948 0 0 1-1.698 2.97c-.01.026 3.24.042 7.222.042h7.244l1.796-3.157c.992-1.734 1.85-3.23 1.906-3.323l.104-.167h-7.249z")],
    {
      viewBox: "0 0 24 24",
      categories: ["tech"],
    },
  ),
  icon(
    "logo-google-maps",
    [fp("M19.527 4.799c1.212 2.608.937 5.678-.405 8.173-1.101 2.047-2.744 3.74-4.098 5.614-.619.858-1.244 1.75-1.669 2.727-.141.325-.263.658-.383.992-.121.333-.224.673-.34 1.008-.109.314-.236.684-.627.687h-.007c-.466-.001-.579-.53-.695-.887-.284-.874-.581-1.713-1.019-2.525-.51-.944-1.145-1.817-1.79-2.671L19.527 4.799zM8.545 7.705l-3.959 4.707c.724 1.54 1.821 2.863 2.871 4.18.247.31.494.622.737.936l4.984-5.925-.029.01c-1.741.601-3.691-.291-4.392-1.987a3.377 3.377 0 0 1-.209-.716c-.063-.437-.077-.761-.004-1.198l.001-.007zM5.492 3.149l-.003.004c-1.947 2.466-2.281 5.88-1.117 8.77l4.785-5.689-.058-.05-3.607-3.035zM14.661.436l-3.838 4.563a.295.295 0 0 1 .027-.01c1.6-.551 3.403.15 4.22 1.626.176.319.323.683.377 1.045.068.446.085.773.012 1.22l-.003.016 3.836-4.561A8.382 8.382 0 0 0 14.67.439l-.009-.003zM9.466 5.868L14.162.285l-.047-.012A8.31 8.31 0 0 0 11.986 0a8.439 8.439 0 0 0-6.169 2.766l-.016.018 3.665 3.084z")],
    {
      viewBox: "0 0 24 24",
      categories: ["tech"],
    },
  ),
  icon(
    "logo-google-play",
    [fp("M22.018 13.298l-3.919 2.218-3.515-3.493 3.543-3.521 3.891 2.202a1.49 1.49 0 0 1 0 2.594zM1.337.924a1.486 1.486 0 0 0-.112.568v21.017c0 .217.045.419.124.6l11.155-11.087L1.337.924zm12.207 10.065l3.258-3.238L3.45.195a1.466 1.466 0 0 0-.946-.179l11.04 10.973zm0 2.067l-11 10.933c.298.036.612-.016.906-.183l13.324-7.54-3.23-3.21z")],
    {
      viewBox: "0 0 24 24",
      categories: ["tech"],
    },
  ),
  icon(
    "logo-apple",
    [fp("M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701")],
    {
      viewBox: "0 0 24 24",
      categories: ["tech"],
    },
  ),
  icon(
    "logo-microsoft",
    [fp("M0 0v11.408h11.408V0zm12.594 0v11.408H24V0zM0 12.594V24h11.408V12.594zm12.594 0V24H24V12.594z")],
    {
      viewBox: "0 0 24 24",
      categories: ["tech"],
    },
  ),
  icon(
    "logo-amazon",
    [fp("M.045 18.02c.072-.116.187-.124.348-.022 3.636 2.11 7.594 3.166 11.87 3.166 2.852 0 5.668-.533 8.447-1.595l.315-.14c.138-.06.234-.1.293-.13.226-.088.39-.046.525.13.12.174.09.336-.12.48-.256.19-.6.41-1.006.654-1.244.743-2.64 1.316-4.185 1.726a17.617 17.617 0 01-10.951-.577 17.88 17.88 0 01-5.43-3.35c-.1-.074-.151-.15-.151-.22 0-.047.021-.09.051-.13zm6.565-6.218c0-1.005.247-1.863.743-2.577.495-.71 1.17-1.25 2.04-1.615.796-.335 1.756-.575 2.912-.72.39-.046 1.033-.103 1.92-.174v-.37c0-.93-.105-1.558-.3-1.875-.302-.43-.78-.65-1.44-.65h-.182c-.48.046-.896.196-1.246.46-.35.27-.575.63-.675 1.096-.06.3-.206.465-.435.51l-2.52-.315c-.248-.06-.372-.18-.372-.39 0-.046.007-.09.022-.15.247-1.29.855-2.25 1.82-2.88.976-.616 2.1-.975 3.39-1.05h.54c1.65 0 2.957.434 3.888 1.29.135.15.27.3.405.48.12.165.224.314.283.45.075.134.15.33.195.57.06.254.105.42.135.51.03.104.062.3.076.615.01.313.02.493.02.553v5.28c0 .376.06.72.165 1.036.105.313.21.54.315.674l.51.674c.09.136.136.256.136.36 0 .12-.06.226-.18.314-1.2 1.05-1.86 1.62-1.963 1.71-.165.135-.375.15-.63.045a6.062 6.062 0 01-.526-.496l-.31-.347a9.391 9.391 0 01-.317-.42l-.3-.435c-.81.886-1.603 1.44-2.4 1.665-.494.15-1.093.227-1.83.227-1.11 0-2.04-.343-2.76-1.034-.72-.69-1.08-1.665-1.08-2.94l-.05-.076zm3.753-.438c0 .566.14 1.02.425 1.364.285.34.675.512 1.155.512.045 0 .106-.007.195-.02.09-.016.134-.023.166-.023.614-.16 1.08-.553 1.424-1.178.165-.28.285-.58.36-.91.09-.32.12-.59.135-.8.015-.195.015-.54.015-1.005v-.54c-.84 0-1.484.06-1.92.18-1.275.36-1.92 1.17-1.92 2.43l-.035-.02zm9.162 7.027c.03-.06.075-.11.132-.17.362-.243.714-.41 1.05-.5a8.094 8.094 0 011.612-.24c.14-.012.28 0 .41.03.65.06 1.05.168 1.172.33.063.09.099.228.099.39v.15c0 .51-.149 1.11-.424 1.8-.278.69-.664 1.248-1.156 1.68-.073.06-.14.09-.197.09-.03 0-.06 0-.09-.012-.09-.044-.107-.12-.064-.24.54-1.26.806-2.143.806-2.64 0-.15-.03-.27-.087-.344-.145-.166-.55-.257-1.224-.257-.243 0-.533.016-.87.046-.363.045-.7.09-1 .135-.09 0-.148-.014-.18-.044-.03-.03-.036-.047-.02-.077 0-.017.006-.03.02-.063v-.06z")],
    {
      viewBox: "0 0 24 24",
      categories: ["tech"],
    },
  ),
  icon(
    "logo-netflix",
    [fp("m5.398 0 8.348 23.602c2.346.059 4.856.398 4.856.398L10.113 0H5.398zm8.489 0v9.172l4.715 13.33V0h-4.715zM5.398 1.5V24c1.873-.225 2.81-.312 4.715-.398V14.83L5.398 1.5z")],
    {
      viewBox: "0 0 24 24",
      categories: ["tech"],
    },
  ),
  icon(
    "logo-spotify",
    [fp("M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z")],
    {
      viewBox: "0 0 24 24",
      categories: ["tech"],
    },
  ),
  icon(
    "logo-stripe",
    [fp("M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.594-7.305h.003z")],
    {
      viewBox: "0 0 24 24",
      categories: ["tech"],
    },
  ),
  icon(
    "logo-paypal",
    [fp("M15.607 4.653H8.941L6.645 19.251H1.82L4.862 0h7.995c3.754 0 6.375 2.294 6.473 5.513-.648-.478-2.105-.86-3.722-.86m6.57 5.546c0 3.41-3.01 6.853-6.958 6.853h-2.493L11.595 24H6.74l1.845-11.538h3.592c4.208 0 7.346-3.634 7.153-6.949a5.24 5.24 0 0 1 2.848 4.686M9.653 5.546h6.408c.907 0 1.942.222 2.363.541-.195 2.741-2.655 5.483-6.441 5.483H8.714Z")],
    {
      viewBox: "0 0 24 24",
      categories: ["tech"],
    },
  ),

  // Developer & Cloud
  icon(
    "logo-aws",
    [fp("M6.763 10.036c0 .296.032.535.088.71.064.176.144.368.256.576.04.063.056.127.056.183 0 .08-.048.16-.152.24l-.503.335a.383.383 0 0 1-.208.072c-.08 0-.16-.04-.239-.112a2.47 2.47 0 0 1-.287-.375 6.18 6.18 0 0 1-.248-.471c-.622.734-1.405 1.101-2.347 1.101-.67 0-1.205-.191-1.596-.574-.391-.384-.59-.894-.59-1.533 0-.678.239-1.23.726-1.644.487-.415 1.133-.623 1.955-.623.272 0 .551.024.846.064.296.04.6.104.918.176v-.583c0-.607-.127-1.03-.375-1.277-.255-.248-.686-.367-1.3-.367-.28 0-.568.031-.863.103-.295.072-.583.16-.862.272a2.287 2.287 0 0 1-.28.104.488.488 0 0 1-.127.023c-.112 0-.168-.08-.168-.247v-.391c0-.128.016-.224.056-.28a.597.597 0 0 1 .224-.167c.279-.144.614-.264 1.005-.36a4.84 4.84 0 0 1 1.246-.151c.95 0 1.644.216 2.091.647.439.43.662 1.085.662 1.963v2.586zm-3.24 1.214c.263 0 .534-.048.822-.144.287-.096.543-.271.758-.51.128-.152.224-.32.272-.512.047-.191.08-.423.08-.694v-.335a6.66 6.66 0 0 0-.735-.136 6.02 6.02 0 0 0-.75-.048c-.535 0-.926.104-1.19.32-.263.215-.39.518-.39.917 0 .375.095.655.295.846.191.2.47.296.838.296zm6.41.862c-.144 0-.24-.024-.304-.08-.064-.048-.12-.16-.168-.311L7.586 5.55a1.398 1.398 0 0 1-.072-.32c0-.128.064-.2.191-.2h.783c.151 0 .255.025.31.08.065.048.113.16.16.312l1.342 5.284 1.245-5.284c.04-.16.088-.264.151-.312a.549.549 0 0 1 .32-.08h.638c.152 0 .256.025.32.08.063.048.12.16.151.312l1.261 5.348 1.381-5.348c.048-.16.104-.264.16-.312a.52.52 0 0 1 .311-.08h.743c.127 0 .2.065.2.2 0 .04-.009.08-.017.128a1.137 1.137 0 0 1-.056.2l-1.923 6.17c-.048.16-.104.263-.168.311a.51.51 0 0 1-.303.08h-.687c-.151 0-.255-.024-.32-.08-.063-.056-.119-.16-.15-.32l-1.238-5.148-1.23 5.14c-.04.16-.087.264-.15.32-.065.056-.177.08-.32.08zm10.256.215c-.415 0-.83-.048-1.229-.143-.399-.096-.71-.2-.918-.32-.128-.071-.215-.151-.247-.223a.563.563 0 0 1-.048-.224v-.407c0-.167.064-.247.183-.247.048 0 .096.008.144.024.048.016.12.048.2.08.271.12.566.215.878.279.319.064.63.096.95.096.502 0 .894-.088 1.165-.264a.86.86 0 0 0 .415-.758.777.777 0 0 0-.215-.559c-.144-.151-.416-.287-.807-.415l-1.157-.36c-.583-.183-1.014-.454-1.277-.813a1.902 1.902 0 0 1-.4-1.158c0-.335.073-.63.216-.886.144-.255.335-.479.575-.654.24-.184.51-.32.83-.415.32-.096.655-.136 1.006-.136.175 0 .359.008.535.032.183.024.35.056.518.088.16.04.312.08.455.127.144.048.256.096.336.144a.69.69 0 0 1 .24.2.43.43 0 0 1 .071.263v.375c0 .168-.064.256-.184.256a.83.83 0 0 1-.303-.096 3.652 3.652 0 0 0-1.532-.311c-.455 0-.815.071-1.062.223-.248.152-.375.383-.375.71 0 .224.08.416.24.567.159.152.454.304.877.44l1.134.358c.574.184.99.44 1.237.767.247.327.367.702.367 1.117 0 .343-.072.655-.207.926-.144.272-.336.511-.583.703-.248.2-.543.343-.886.447-.36.111-.734.167-1.142.167zM21.698 16.207c-2.626 1.94-6.442 2.969-9.722 2.969-4.598 0-8.74-1.7-11.87-4.526-.247-.223-.024-.527.272-.351 3.384 1.963 7.559 3.153 11.877 3.153 2.914 0 6.114-.607 9.06-1.852.439-.2.814.287.383.607zM22.792 14.961c-.336-.43-2.22-.207-3.074-.103-.255.032-.295-.192-.063-.36 1.5-1.053 3.967-.75 4.254-.399.287.36-.08 2.826-1.485 4.007-.215.184-.423.088-.327-.151.32-.79 1.03-2.57.695-2.994z")],
    {
      viewBox: "0 0 24 24",
      categories: ["tech"],
    },
  ),
  icon(
    "logo-azure",
    [fp("M22.379 23.343a1.62 1.62 0 0 0 1.536-2.14v.002L17.35 1.76A1.62 1.62 0 0 0 15.816.657H8.184A1.62 1.62 0 0 0 6.65 1.76L.086 21.204a1.62 1.62 0 0 0 1.536 2.139h4.741a1.62 1.62 0 0 0 1.535-1.103l.977-2.892 4.947 3.675c.28.208.618.32.966.32m-3.084-12.531 3.624 10.739a.54.54 0 0 1-.51.713v-.001h-.03a.54.54 0 0 1-.322-.106l-9.287-6.9h4.853m6.313 7.006c.116-.326.13-.694.007-1.058L9.79 1.76a1.722 1.722 0 0 0-.007-.02h6.034a.54.54 0 0 1 .512.366l6.562 19.445a.54.54 0 0 1-.338.684")],
    {
      viewBox: "0 0 24 24",
      categories: ["tech"],
    },
  ),
  icon(
    "logo-firebase",
    [fp("M19.455 8.369c-.538-.748-1.778-2.285-3.681-4.569-.826-.991-1.535-1.832-1.884-2.245a146 146 0 0 0-.488-.576l-.207-.245-.113-.133-.022-.032-.01-.005L12.57 0l-.609.488c-1.555 1.246-2.828 2.851-3.681 4.64-.523 1.064-.864 2.105-1.043 3.176-.047.241-.088.489-.121.738-.209-.017-.421-.028-.632-.033-.018-.001-.035-.002-.059-.003a7.46 7.46 0 0 0-2.28.274l-.317.089-.163.286c-.765 1.342-1.198 2.869-1.252 4.416-.07 2.01.477 3.954 1.583 5.625 1.082 1.633 2.61 2.882 4.42 3.611l.236.095.071.025.003-.001a9.59 9.59 0 0 0 2.941.568q.171.006.342.006c1.273 0 2.513-.249 3.69-.742l.008.004.313-.145a9.63 9.63 0 0 0 3.927-3.335c1.01-1.49 1.577-3.234 1.641-5.042.075-2.161-.643-4.304-2.133-6.371m-7.083 6.695c.328 1.244.264 2.44-.191 3.558-1.135-1.12-1.967-2.352-2.475-3.665-.543-1.404-.87-2.74-.974-3.975.48.157.922.366 1.315.622 1.132.737 1.914 1.902 2.325 3.461zm.207 6.022c.482.368.99.712 1.513 1.028-.771.21-1.565.302-2.369.273a8 8 0 0 1-.373-.022c.458-.394.869-.823 1.228-1.279zm1.347-6.431c-.516-1.957-1.527-3.437-3.002-4.398-.647-.421-1.385-.741-2.194-.95.011-.134.026-.268.043-.4.014-.113.03-.216.046-.313.133-.689.332-1.37.589-2.025.099-.25.206-.499.321-.74l.004-.008c.177-.358.376-.719.61-1.105l.092-.152-.003-.001c.544-.851 1.197-1.627 1.942-2.311l.288.341c.672.796 1.304 1.548 1.878 2.237 1.291 1.549 2.966 3.583 3.612 4.48 1.277 1.771 1.893 3.579 1.83 5.375-.049 1.395-.461 2.755-1.195 3.933-.694 1.116-1.661 2.05-2.8 2.708-.636-.318-1.559-.839-2.539-1.599.79-1.575.952-3.28.479-5.072zm-2.575 5.397c-.725.939-1.587 1.55-2.09 1.856-.081-.029-.163-.06-.243-.093l-.065-.026c-1.49-.616-2.747-1.656-3.635-3.01-.907-1.384-1.356-2.993-1.298-4.653.041-1.19.338-2.327.882-3.379.316-.07.638-.114.96-.131l.084-.002c.162-.003.324-.003.478 0 .227.011.454.035.677.07.073 1.513.445 3.145 1.105 4.852.637 1.644 1.694 3.162 3.144 4.515z")],
    {
      viewBox: "0 0 24 24",
      categories: ["tech"],
    },
  ),
  icon(
    "logo-vercel",
    [fp("m12 1.608 12 20.784H0Z")],
    {
      viewBox: "0 0 24 24",
      categories: ["tech"],
    },
  ),
  icon(
    "logo-netlify",
    [fp("M6.49 19.04h-.23L5.13 17.9v-.23l1.73-1.71h1.2l.15.15v1.2L6.5 19.04ZM5.13 6.31V6.1l1.13-1.13h.23L8.2 6.68v1.2l-.15.15h-1.2L5.13 6.31Zm9.96 9.09h-1.65l-.14-.13v-3.83c0-.68-.27-1.2-1.1-1.23-.42 0-.9 0-1.43.02l-.07.08v4.96l-.14.14H8.9l-.13-.14V8.73l.13-.14h3.7a2.6 2.6 0 0 1 2.61 2.6v4.08l-.13.14Zm-8.37-2.44H.14L0 12.82v-1.64l.14-.14h6.58l.14.14v1.64l-.14.14Zm17.14 0h-6.58l-.14-.14v-1.64l.14-.14h6.58l.14.14v1.64l-.14.14ZM11.05 6.55V1.64l.14-.14h1.65l.14.14v4.9l-.14.14h-1.65l-.14-.13Zm0 15.81v-4.9l.14-.14h1.65l.14.13v4.91l-.14.14h-1.65l-.14-.14Z")],
    {
      viewBox: "0 0 24 24",
      categories: ["tech"],
    },
  ),
  icon(
    "logo-digitalocean",
    [fp("M12.04 0C5.408-.02.005 5.37.005 11.992h4.638c0-4.923 4.882-8.731 10.064-6.855a6.95 6.95 0 014.147 4.148c1.889 5.177-1.924 10.055-6.84 10.064v-4.61H7.391v4.623h4.61V24c7.86 0 13.967-7.588 11.397-15.83-1.115-3.59-3.985-6.446-7.575-7.575A12.8 12.8 0 0012.039 0zM7.39 19.362H3.828v3.564H7.39zm-3.563 0v-2.978H.85v2.978z")],
    {
      viewBox: "0 0 24 24",
      categories: ["tech"],
    },
  ),
  icon(
    "logo-cloudflare",
    [fp("M16.5088 16.8447c.1475-.5068.0908-.9707-.1553-1.3154-.2246-.3164-.6045-.499-1.0615-.5205l-8.6592-.1123a.1559.1559 0 0 1-.1333-.0713c-.0283-.042-.0351-.0986-.021-.1553.0278-.084.1123-.1484.2036-.1562l8.7359-.1123c1.0351-.0489 2.1601-.8868 2.5537-1.9136l.499-1.3013c.0215-.0561.0293-.1128.0147-.168-.5625-2.5463-2.835-4.4453-5.5499-4.4453-2.5039 0-4.6284 1.6177-5.3876 3.8614-.4927-.3658-1.1187-.5625-1.794-.499-1.2026.119-2.1665 1.083-2.2861 2.2856-.0283.31-.0069.6128.0635.894C1.5683 13.171 0 14.7754 0 16.752c0 .1748.0142.3515.0352.5273.0141.083.0844.1475.1689.1475h15.9814c.0909 0 .1758-.0645.2032-.1553l.12-.4268zm2.7568-5.5634c-.0771 0-.1611 0-.2383.0112-.0566 0-.1054.0415-.127.0976l-.3378 1.1744c-.1475.5068-.0918.9707.1543 1.3164.2256.3164.6055.498 1.0625.5195l1.8437.1133c.0557 0 .1055.0263.1329.0703.0283.043.0351.1074.0214.1562-.0283.084-.1132.1485-.204.1553l-1.921.1123c-1.041.0488-2.1582.8867-2.5527 1.914l-.1406.3585c-.0283.0713.0215.1416.0986.1416h6.5977c.0771 0 .1474-.0489.169-.126.1122-.4082.1757-.837.1757-1.2803 0-2.6025-2.125-4.727-4.7344-4.727")],
    {
      viewBox: "0 0 24 24",
      categories: ["tech"],
    },
  ),
  icon(
    "logo-npm",
    [fp("M1.763 0C.786 0 0 .786 0 1.763v20.474C0 23.214.786 24 1.763 24h20.474c.977 0 1.763-.786 1.763-1.763V1.763C24 .786 23.214 0 22.237 0zM5.13 5.323l13.837.019-.009 13.836h-3.464l.01-10.382h-3.456L12.04 19.17H5.113z")],
    {
      viewBox: "0 0 24 24",
      categories: ["tech"],
    },
  ),
  icon(
    "logo-docker",
    [fp("M13.983 11.078h2.119a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.119a.185.185 0 00-.185.185v1.888c0 .102.083.185.185.185m-2.954-5.43h2.118a.186.186 0 00.186-.186V3.574a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185m0 2.716h2.118a.187.187 0 00.186-.186V6.29a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.887c0 .102.082.185.185.186m-2.93 0h2.12a.186.186 0 00.184-.186V6.29a.185.185 0 00-.185-.185H8.1a.185.185 0 00-.185.185v1.887c0 .102.083.185.185.186m-2.964 0h2.119a.186.186 0 00.185-.186V6.29a.185.185 0 00-.185-.185H5.136a.186.186 0 00-.186.185v1.887c0 .102.084.185.186.186m5.893 2.715h2.118a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185m-2.93 0h2.12a.185.185 0 00.184-.185V9.006a.185.185 0 00-.184-.186h-2.12a.185.185 0 00-.184.185v1.888c0 .102.083.185.185.185m-2.964 0h2.119a.185.185 0 00.185-.185V9.006a.185.185 0 00-.184-.186h-2.12a.186.186 0 00-.186.186v1.887c0 .102.084.185.186.185m-2.92 0h2.12a.185.185 0 00.184-.185V9.006a.185.185 0 00-.184-.186h-2.12a.185.185 0 00-.184.185v1.888c0 .102.082.185.185.185M23.763 9.89c-.065-.051-.672-.51-1.954-.51-.338.001-.676.03-1.01.087-.248-1.7-1.653-2.53-1.716-2.566l-.344-.199-.226.327c-.284.438-.49.922-.612 1.43-.23.97-.09 1.882.403 2.661-.595.332-1.55.413-1.744.42H.751a.751.751 0 00-.75.748 11.376 11.376 0 00.692 4.062c.545 1.428 1.355 2.48 2.41 3.124 1.18.723 3.1 1.137 5.275 1.137.983.003 1.963-.086 2.93-.266a12.248 12.248 0 003.823-1.389c.98-.567 1.86-1.288 2.61-2.136 1.252-1.418 1.998-2.997 2.553-4.4h.221c1.372 0 2.215-.549 2.68-1.009.309-.293.55-.65.707-1.046l.098-.288Z")],
    {
      viewBox: "0 0 24 24",
      categories: ["tech"],
    },
  ),
  icon(
    "logo-kubernetes",
    [fp("M10.204 14.35l.007.01-.999 2.413a5.171 5.171 0 0 1-2.075-2.597l2.578-.437.004.005a.44.44 0 0 1 .484.606zm-.833-2.129a.44.44 0 0 0 .173-.756l.002-.011L7.585 9.7a5.143 5.143 0 0 0-.73 3.255l2.514-.725.002-.009zm1.145-1.98a.44.44 0 0 0 .699-.337l.01-.005.15-2.62a5.144 5.144 0 0 0-3.01 1.442l2.147 1.523.004-.002zm.76 2.75l.723.349.722-.347.18-.78-.5-.623h-.804l-.5.623.179.779zm1.5-3.095a.44.44 0 0 0 .7.336l.008.003 2.134-1.513a5.188 5.188 0 0 0-2.992-1.442l.148 2.615.002.001zm10.876 5.97l-5.773 7.181a1.6 1.6 0 0 1-1.248.594l-9.261.003a1.6 1.6 0 0 1-1.247-.596l-5.776-7.18a1.583 1.583 0 0 1-.307-1.34L2.1 5.573c.108-.47.425-.864.863-1.073L11.305.513a1.606 1.606 0 0 1 1.385 0l8.345 3.985c.438.209.755.604.863 1.073l2.062 8.955c.108.47-.005.963-.308 1.34zm-3.289-2.057c-.042-.01-.103-.026-.145-.034-.174-.033-.315-.025-.479-.038-.35-.037-.638-.067-.895-.148-.105-.04-.18-.165-.216-.216l-.201-.059a6.45 6.45 0 0 0-.105-2.332 6.465 6.465 0 0 0-.936-2.163c.052-.047.15-.133.177-.159.008-.09.001-.183.094-.282.197-.185.444-.338.743-.522.142-.084.273-.137.415-.242.032-.024.076-.062.11-.089.24-.191.295-.52.123-.736-.172-.216-.506-.236-.745-.045-.034.027-.08.062-.111.088-.134.116-.217.23-.33.35-.246.25-.45.458-.673.609-.097.056-.239.037-.303.033l-.19.135a6.545 6.545 0 0 0-4.146-2.003l-.012-.223c-.065-.062-.143-.115-.163-.25-.022-.268.015-.557.057-.905.023-.163.061-.298.068-.475.001-.04-.001-.099-.001-.142 0-.306-.224-.555-.5-.555-.275 0-.499.249-.499.555l.001.014c0 .041-.002.092 0 .128.006.177.044.312.067.475.042.348.078.637.056.906a.545.545 0 0 1-.162.258l-.012.211a6.424 6.424 0 0 0-4.166 2.003 8.373 8.373 0 0 1-.18-.128c-.09.012-.18.04-.297-.029-.223-.15-.427-.358-.673-.608-.113-.12-.195-.234-.329-.349-.03-.026-.077-.062-.111-.088a.594.594 0 0 0-.348-.132.481.481 0 0 0-.398.176c-.172.216-.117.546.123.737l.007.005.104.083c.142.105.272.159.414.242.299.185.546.338.743.522.076.082.09.226.1.288l.16.143a6.462 6.462 0 0 0-1.02 4.506l-.208.06c-.055.072-.133.184-.215.217-.257.081-.546.11-.895.147-.164.014-.305.006-.48.039-.037.007-.09.02-.133.03l-.004.002-.007.002c-.295.071-.484.342-.423.608.061.267.349.429.645.365l.007-.001.01-.003.129-.029c.17-.046.294-.113.448-.172.33-.118.604-.217.87-.256.112-.009.23.069.288.101l.217-.037a6.5 6.5 0 0 0 2.88 3.596l-.09.218c.033.084.069.199.044.282-.097.252-.263.517-.452.813-.091.136-.185.242-.268.399-.02.037-.045.095-.064.134-.128.275-.034.591.213.71.248.12.556-.007.69-.282v-.002c.02-.039.046-.09.062-.127.07-.162.094-.301.144-.458.132-.332.205-.68.387-.897.05-.06.13-.082.215-.105l.113-.205a6.453 6.453 0 0 0 4.609.012l.106.192c.086.028.18.042.256.155.136.232.229.507.342.84.05.156.074.295.145.457.016.037.043.09.062.129.133.276.442.402.69.282.247-.118.341-.435.213-.71-.02-.039-.045-.096-.065-.134-.083-.156-.177-.261-.268-.398-.19-.296-.346-.541-.443-.793-.04-.13.007-.21.038-.294-.018-.022-.059-.144-.083-.202a6.499 6.499 0 0 0 2.88-3.622c.064.01.176.03.213.038.075-.05.144-.114.28-.104.266.039.54.138.87.256.154.06.277.128.448.173.036.01.088.019.13.028l.009.003.007.001c.297.064.584-.098.645-.365.06-.266-.128-.537-.423-.608zM16.4 9.701l-1.95 1.746v.005a.44.44 0 0 0 .173.757l.003.01 2.526.728a5.199 5.199 0 0 0-.108-1.674A5.208 5.208 0 0 0 16.4 9.7zm-4.013 5.325a.437.437 0 0 0-.404-.232.44.44 0 0 0-.372.233h-.002l-1.268 2.292a5.164 5.164 0 0 0 3.326.003l-1.27-2.296h-.01zm1.888-1.293a.44.44 0 0 0-.27.036.44.44 0 0 0-.214.572l-.003.004 1.01 2.438a5.15 5.15 0 0 0 2.081-2.615l-2.6-.44-.004.005z")],
    {
      viewBox: "0 0 24 24",
      categories: ["tech"],
    },
  ),
  icon(
    "logo-openai",
    [fp("M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z")],
    {
      viewBox: "0 0 24 24",
      categories: ["tech"],
    },
  ),

  // Food & Delivery
  icon(
    "logo-uber",
    [fp("M0 7.97v4.958c0 1.867 1.302 3.101 3 3.101.826 0 1.562-.316 2.094-.87v.736H6.27V7.97H5.082v4.888c0 1.257-.85 2.106-1.947 2.106-1.11 0-1.946-.827-1.946-2.106V7.971H0zm7.44 0v7.925h1.13v-.725c.521.532 1.257.86 2.06.86a3.006 3.006 0 0 0 3.034-3.01 3.01 3.01 0 0 0-3.033-3.024 2.86 2.86 0 0 0-2.049.861V7.971H7.439zm9.869 2.038c-1.687 0-2.965 1.37-2.965 3 0 1.72 1.334 3.01 3.066 3.01 1.053 0 1.913-.463 2.49-1.233l-.826-.611c-.43.577-.996.847-1.664.847-.973 0-1.753-.7-1.912-1.64h4.697v-.373c0-1.72-1.222-3-2.886-3zm6.295.068c-.634 0-1.098.294-1.381.758v-.713h-1.131v5.774h1.142V12.61c0-.894.544-1.47 1.291-1.47H24v-1.065h-.396zm-6.319.928c.85 0 1.564.588 1.756 1.47H15.52c.203-.882.916-1.47 1.765-1.47zm-6.732.012c1.086 0 1.98.883 1.98 2.004a1.993 1.993 0 0 1-1.98 2.001A1.989 1.989 0 0 1 8.56 13.02a1.99 1.99 0 0 1 1.992-2.004z")],
    {
      viewBox: "0 0 24 24",
      categories: ["social"],
    },
  ),
  icon(
    "logo-lyft",
    [fp("M4.38 15.883c.036.042.125.135.125.135s-.094.059-.152.086a3.046 3.046 0 0 1-1.28.286C1.593 16.39 0 15.29 0 12.878v-8.78h3.512v9.365c0 .95.306 1.781.867 2.42zM24 11.122V7.61h-1.253c-.524-2.76-3.425-4.574-6.341-3.484-1.624.607-2.943 2.548-2.943 4.282v7.979a1608.8 1608.8 0 0 0 .153 0 3.495 3.495 0 0 0 2.38-1.077c.632-.658.98-1.522.98-2.432h1.463V9.366h-1.463V8.4c0-.375.198-.726.526-.909.9-.5 1.815.143 1.815.996v3.22c0 1.273.48 2.456 1.354 3.329a4.666 4.666 0 0 0 3.178 1.351H24v-3.51a1.17 1.17 0 0 1-1.17-1.17v-.586H24zm-14.927 1.17a.585.585 0 0 1-1.17 0V7.61H4.39v5.853a2.928 2.928 0 0 0 4.83 2.224c-.055.433-.294.792-.69 1.04-.373.234-.857.357-1.402.357a3.83 3.83 0 0 1-1.65-.382s-.093-.044-.21-.11v3.119a6.65 6.65 0 0 0 2.468.484c1.312 0 2.51-.41 3.371-1.155.967-.836 1.478-2.056 1.478-3.528V7.61H9.073v4.683z")],
    {
      viewBox: "0 0 24 24",
      categories: ["social"],
    },
  ),
  icon(
    "logo-doordash",
    [fp("M23.071 8.409a6.09 6.09 0 00-5.396-3.228H.584A.589.589 0 00.17 6.184L3.894 9.93a1.752 1.752 0 001.242.516h12.049a1.554 1.554 0 11.031 3.108H8.91a.589.589 0 00-.415 1.003l3.725 3.747a1.75 1.75 0 001.242.516h3.757c4.887 0 8.584-5.225 5.852-10.413")],
    {
      viewBox: "0 0 24 24",
      categories: ["social"],
    },
  ),
  icon(
    "logo-airbnb",
    [fp("M12.001 18.275c-1.353-1.697-2.148-3.184-2.413-4.457-.263-1.027-.16-1.848.291-2.465.477-.71 1.188-1.056 2.121-1.056s1.643.345 2.12 1.063c.446.61.558 1.432.286 2.465-.291 1.298-1.085 2.785-2.412 4.458zm9.601 1.14c-.185 1.246-1.034 2.28-2.2 2.783-2.253.98-4.483-.583-6.392-2.704 3.157-3.951 3.74-7.028 2.385-9.018-.795-1.14-1.933-1.695-3.394-1.695-2.944 0-4.563 2.49-3.927 5.382.37 1.565 1.352 3.343 2.917 5.332-.98 1.085-1.91 1.856-2.732 2.333-.636.344-1.245.558-1.828.609-2.679.399-4.778-2.2-3.825-4.88.132-.345.395-.98.845-1.961l.025-.053c1.464-3.178 3.242-6.79 5.285-10.795l.053-.132.58-1.116c.45-.822.635-1.19 1.351-1.643.346-.21.77-.315 1.246-.315.954 0 1.698.558 2.016 1.007.158.239.345.557.582.953l.558 1.089.08.159c2.041 4.004 3.821 7.608 5.279 10.794l.026.025.533 1.22.318.764c.243.613.294 1.222.213 1.858zm1.22-2.39c-.186-.583-.505-1.271-.9-2.094v-.03c-1.889-4.006-3.642-7.608-5.307-10.844l-.111-.163C15.317 1.461 14.468 0 12.001 0c-2.44 0-3.476 1.695-4.535 3.898l-.081.16c-1.669 3.236-3.421 6.843-5.303 10.847v.053l-.559 1.22c-.21.504-.317.768-.345.847C-.172 20.74 2.611 24 5.98 24c.027 0 .132 0 .265-.027h.372c1.75-.213 3.554-1.325 5.384-3.317 1.829 1.989 3.635 3.104 5.382 3.317h.372c.133.027.239.027.265.027 3.37.003 6.152-3.261 4.802-6.975z")],
    {
      viewBox: "0 0 24 24",
      categories: ["social"],
    },
  ),
  icon(
    "logo-shopify",
    [fp("M15.337 23.979l7.216-1.561s-2.604-17.613-2.625-17.73c-.018-.116-.114-.192-.211-.192s-1.929-.136-1.929-.136-1.275-1.274-1.439-1.411c-.045-.037-.075-.057-.121-.074l-.914 21.104h.023zM11.71 11.305s-.81-.424-1.774-.424c-1.447 0-1.504.906-1.504 1.141 0 1.232 3.24 1.715 3.24 4.629 0 2.295-1.44 3.76-3.406 3.76-2.354 0-3.54-1.465-3.54-1.465l.646-2.086s1.245 1.066 2.28 1.066c.675 0 .975-.545.975-.932 0-1.619-2.654-1.694-2.654-4.359-.034-2.237 1.571-4.416 4.827-4.416 1.257 0 1.875.361 1.875.361l-.945 2.715-.02.01zM11.17.83c.136 0 .271.038.405.135-.984.465-2.064 1.639-2.508 3.992-.656.213-1.293.405-1.889.578C7.697 3.75 8.951.84 11.17.84V.83zm1.235 2.949v.135c-.754.232-1.583.484-2.394.736.466-1.777 1.333-2.645 2.085-2.971.193.501.309 1.176.309 2.1zm.539-2.234c.694.074 1.141.867 1.429 1.755-.349.114-.735.231-1.158.366v-.252c0-.752-.096-1.371-.271-1.871v.002zm2.992 1.289c-.02 0-.06.021-.078.021s-.289.075-.714.21c-.423-1.233-1.176-2.37-2.508-2.37h-.115C12.135.209 11.669 0 11.265 0 8.159 0 6.675 3.877 6.21 5.846c-1.194.365-2.063.636-2.16.674-.675.213-.694.232-.772.87-.075.462-1.83 14.063-1.83 14.063L15.009 24l.927-21.166z")],
    {
      viewBox: "0 0 24 24",
      categories: ["social"],
    },
  ),

  // Messaging & Sharing
  icon(
    "logo-send",
    [
      fp(
        "M20.73 4.17a.9.9 0 0 0-.95-.17L4.32 10.04a.9.9 0 0 0 .06 1.7l4.3 1.42 1.43 4.3a.9.9 0 0 0 1.68.09l8.99-12.39a.9.9 0 0 0-.05-.99ZM10.42 12.54l7.04-5.19-5.2 7.03-.65 1.96Z",
      ),
    ],
    {
      viewBox: "0 0 24 24",
      categories: ["communication"],
    },
  ),
  icon(
    "logo-message-circle",
    [
      r(3, 3.5, 9, 8, { rx: 2 }),
      p("M6 7h8v5c0 1-1 2-2 2l-2-.5-2 .5c-1 0-2-1-2-2V7z"),
      c(10, 5.5, 0.8, { fill: "currentColor", stroke: "none" }),
    ],
    {
      categories: ["communication"],
    },
  ),
  icon(
    "logo-message-square",
    [r(3, 3, 9, 9, { rx: 1.5 }), p("M5.5 6h7v5h-7z"), l(5.5, 8, 8.5, 8)],
    {
      categories: ["communication"],
    },
  ),

  // Music & Audio
  icon("logo-music", [fp("M17.95 3.6a1.2 1.2 0 0 0-.44.05l-7.1 1.72a1.2 1.2 0 0 0-.91 1.17v7.53a3.35 3.35 0 1 0 1.9 3.02V8.05l4.7-1.14v4.51a3.35 3.35 0 1 0 1.9 3.02V4.8a1.2 1.2 0 0 0-1.05-1.2Z")], {
    viewBox: "0 0 24 24",
    categories: ["media"],
  }),
  icon(
    "logo-headphones",
    [
      p("M6 12a6 6 0 0 1 12 0", {
        fill: "none",
        stroke: "currentColor",
        strokeWidth: 1.7,
        strokeLinecap: "round",
      }),
      r(5, 11.5, 3, 6.5, { rx: 1.5, fill: "none", stroke: "currentColor" }),
      r(16, 11.5, 3, 6.5, { rx: 1.5, fill: "none", stroke: "currentColor" }),
      p("M8 17.2c.45 1.08 1.5 1.8 2.7 1.8h2.6", {
        fill: "none",
        stroke: "currentColor",
        strokeWidth: 1.5,
        strokeLinecap: "round",
      }),
    ],
    {
      viewBox: "0 0 24 24",
      categories: ["media"],
    },
  ),
  icon(
    "logo-podcast",
    [
      c(12, 8.1, 2.15, {
        fill: "none",
        stroke: "currentColor",
        strokeWidth: 1.7,
      }),
      p("M12 10.25v4.7", {
        fill: "none",
        stroke: "currentColor",
        strokeWidth: 1.7,
        strokeLinecap: "round",
      }),
      p("M10.9 18.35h2.2", {
        fill: "none",
        stroke: "currentColor",
        strokeWidth: 1.7,
        strokeLinecap: "round",
      }),
      p("M7.45 12.1a6.25 6.25 0 0 1 9.1 0", {
        fill: "none",
        stroke: "currentColor",
        strokeWidth: 1.7,
        strokeLinecap: "round",
      }),
      p("M5.25 9.45a9.35 9.35 0 0 1 13.5 0", {
        fill: "none",
        stroke: "currentColor",
        strokeWidth: 1.7,
        strokeLinecap: "round",
      }),
    ],
    {
      viewBox: "0 0 24 24",
      categories: ["media"],
    },
  ),

  // Maps & Location
  icon(
    "logo-map-pin",
    [
      p(
        "M7.5 12.3s3.8-3.38 3.8-5.85A3.8 3.8 0 0 0 3.7 6.45c0 2.47 3.8 5.85 3.8 5.85z",
      ),
      c(7.5, 6.45, 1.35),
    ],
    {
      categories: ["maps-location"],
    },
  ),

  icon(
    "align-h-center-distribute",
    [
      l(3, 4.2, 12, 4.2),
      l(3, 10.8, 12, 10.8),
      r(5.6, 6.2, 1.8, 2.6, { rx: 0.3 }),
      r(8.6, 6.2, 1.8, 2.6, { rx: 0.3 }),
      l(4.5, 6.2, 4.5, 8.8),
      l(11.6, 6.2, 11.6, 8.8),
    ],
    {
      categories: ["alignment"],
    },
  ),
  icon(
    "align-v-center-distribute",
    [
      l(4.2, 3, 4.2, 12),
      l(10.8, 3, 10.8, 12),
      r(6.2, 5.6, 2.6, 1.8, { rx: 0.3 }),
      r(6.2, 8.6, 2.6, 1.8, { rx: 0.3 }),
      l(6.2, 4.5, 8.8, 4.5),
      l(6.2, 11.6, 8.8, 11.6),
    ],
    {
      categories: ["alignment"],
    },
  ),
  icon(
    "align-baseline-typography",
    [
      l(3, 10.9, 12, 10.9),
      p("M4.1 9.7 6.1 4.2 8.1 9.7"),
      l(5, 7.3, 7.2, 7.3),
      l(9.2, 5.1, 9.2, 9.7),
      p("M9.2 6.3a1.2 1.2 0 0 1 1.2-1.2"),
    ],
    {
      categories: ["alignment"],
    },
  ),
  icon(
    "align-stretch-box",
    [
      r(3.1, 3.1, 8.8, 8.8, { rx: 1 }),
      r(5, 4.2, 5, 6.6, { rx: 0.5 }),
      l(3.1, 7.5, 12, 7.5),
    ],
    {
      categories: ["alignment"],
    },
  ),
  icon(
    "align-pack-start",
    [
      l(3.2, 4.1, 11.8, 4.1),
      r(3.6, 5.6, 2.1, 4.8, { rx: 0.4 }),
      r(6.4, 6.6, 2.1, 3.8, { rx: 0.4 }),
      r(9.2, 7.6, 2.1, 2.8, { rx: 0.4 }),
    ],
    {
      categories: ["alignment"],
    },
  ),
  icon(
    "align-pack-end",
    [
      l(3.2, 11.9, 11.8, 11.9),
      r(3.6, 7.1, 2.1, 4.8, { rx: 0.4 }),
      r(6.4, 8.1, 2.1, 3.8, { rx: 0.4 }),
      r(9.2, 9.1, 2.1, 2.8, { rx: 0.4 }),
    ],
    {
      categories: ["alignment"],
    },
  ),

  icon(
    "border-style-dashed",
    [r(3.1, 3.1, 8.8, 8.8, { rx: 1, strokeDasharray: "2 1.4" })],
    {
      categories: ["borders-corners"],
    },
  ),
  icon(
    "border-style-dotted",
    [r(3.1, 3.1, 8.8, 8.8, { rx: 1, strokeDasharray: "0.6 1.3" })],
    {
      categories: ["borders-corners"],
    },
  ),
  icon(
    "border-style-double",
    [r(2.8, 2.8, 9.4, 9.4, { rx: 1.1 }), r(4.2, 4.2, 6.6, 6.6, { rx: 0.8 })],
    {
      categories: ["borders-corners"],
    },
  ),
  icon(
    "border-radius-all",
    [
      r(3.1, 3.1, 8.8, 8.8, { rx: 2.2 }),
      l(7.5, 2.8, 7.5, 4.1),
      l(7.5, 10.9, 7.5, 12.2),
    ],
    {
      categories: ["borders-corners"],
    },
  ),
  icon(
    "border-radius-corners",
    [
      r(3.1, 3.1, 8.8, 8.8, { rx: 0.6 }),
      p("M3.1 6.5a3.4 3.4 0 0 1 3.4-3.4"),
      p("M11.9 8.5a3.4 3.4 0 0 1-3.4 3.4"),
    ],
    {
      categories: ["borders-corners"],
    },
  ),
  icon(
    "corner-cut-style",
    [polygon("3.1,3.1 9.8,3.1 11.9,5.2 11.9,11.9 3.1,11.9")],
    {
      categories: ["borders-corners"],
    },
  ),

  icon(
    "arrow-bend-up-right",
    [l(3.2, 11.8, 8.6, 6.4), polyline("8.6 9.1 8.6 6.4 11.3 6.4")],
    {
      categories: ["arrows"],
    },
  ),
  icon(
    "arrow-bend-down-right",
    [l(3.2, 3.2, 8.6, 8.6), polyline("8.6 5.9 8.6 8.6 11.3 8.6")],
    {
      categories: ["arrows"],
    },
  ),
  icon(
    "arrow-uturn-left",
    [
      p("M10.8 3.6H6.4a2.8 2.8 0 0 0-2.8 2.8v2.2"),
      polyline("5.1 6.6 3.6 8.1 2.1 6.6"),
    ],
    {
      categories: ["arrows"],
    },
  ),
  icon(
    "arrow-uturn-right",
    [
      p("M4.2 3.6h4.4a2.8 2.8 0 0 1 2.8 2.8v2.2"),
      polyline("9.9 6.6 11.4 8.1 12.9 6.6"),
    ],
    {
      categories: ["arrows"],
    },
  ),
  icon(
    "arrow-swap-horizontal",
    [
      l(3.1, 5.1, 11.9, 5.1),
      polyline("9.8 3 11.9 5.1 9.8 7.2"),
      l(11.9, 9.9, 3.1, 9.9),
      polyline("5.2 7.8 3.1 9.9 5.2 12"),
    ],
    {
      categories: ["arrows"],
    },
  ),
  icon(
    "arrow-swap-vertical",
    [
      l(5.1, 3.1, 5.1, 11.9),
      polyline("3 9.8 5.1 11.9 7.2 9.8"),
      l(9.9, 11.9, 9.9, 3.1),
      polyline("7.8 5.2 9.9 3.1 12 5.2"),
    ],
    {
      categories: ["arrows"],
    },
  ),
  icon(
    "arrow-circle-cw",
    [
      c(7.5, 7.5, 4.7),
      p("M7.5 4.1a3.4 3.4 0 1 1-2.4 1"),
      polyline("4.1 4.2 5.8 4.2 5.8 2.5"),
    ],
    {
      categories: ["arrows"],
    },
  ),
  icon(
    "arrow-circle-ccw",
    [
      c(7.5, 7.5, 4.7),
      p("M7.5 4.1a3.4 3.4 0 1 0 2.4 1"),
      polyline("10.9 4.2 9.2 4.2 9.2 2.5"),
    ],
    {
      categories: ["arrows"],
    },
  ),

  icon(
    "design-pen-tool",
    [
      c(4.1, 4.1, 0.7),
      c(10.9, 4.1, 0.7),
      c(7.5, 10.9, 0.7),
      l(4.8, 4.8, 7, 10.2),
      l(10.2, 4.8, 8, 10.2),
      l(4.8, 4.1, 10.2, 4.1),
    ],
    {
      categories: ["design"],
    },
  ),
  icon(
    "design-eyedropper",
    [
      p(
        "M10.8 4.2a1.8 1.8 0 0 0-2.5 0L6.8 5.7l2.5 2.5 1.5-1.5a1.8 1.8 0 0 0 0-2.5z",
      ),
      l(6.2, 6.3, 3.2, 9.3),
      p("M2.8 9.7 2.4 12.2 4.9 11.8"),
    ],
    {
      categories: ["design"],
    },
  ),
  icon(
    "design-grid-layout",
    [
      r(3.1, 3.1, 8.8, 8.8, { rx: 1 }),
      l(6, 3.1, 6, 11.9),
      l(9, 3.1, 9, 11.9),
      l(3.1, 6, 11.9, 6),
      l(3.1, 9, 11.9, 9),
    ],
    {
      categories: ["design"],
    },
  ),
  icon(
    "design-prototype-link",
    [
      r(3.1, 3.1, 3.3, 3.3, { rx: 0.6 }),
      r(8.6, 8.6, 3.3, 3.3, { rx: 0.6 }),
      l(6.4, 6.4, 8.6, 8.6),
      polyline("7.3 8.6 8.6 8.6 8.6 7.3"),
    ],
    {
      categories: ["design"],
    },
  ),
  icon(
    "design-magic-wand",
    [
      l(3.1, 11.9, 8.9, 6.1),
      p("M8.9 2.8 9.4 4.3 10.9 4.8 9.4 5.3 8.9 6.8 8.4 5.3 6.9 4.8 8.4 4.3z"),
      p(
        "M11.3 7.7 11.6 8.6 12.5 8.9 11.6 9.2 11.3 10.1 11 9.2 10.1 8.9 11 8.6z",
      ),
    ],
    {
      categories: ["design"],
    },
  ),
  icon(
    "design-ruler-tool",
    [
      r(3.1, 4.8, 8.8, 5.4, { rx: 0.8 }),
      l(4.4, 6.1, 4.4, 8.8),
      l(5.7, 6.1, 5.7, 7.8),
      l(7, 6.1, 7, 8.8),
      l(8.3, 6.1, 8.3, 7.8),
      l(9.6, 6.1, 9.6, 8.8),
    ],
    {
      categories: ["design"],
    },
  ),
  icon(
    "design-vector-node",
    [
      c(4.1, 4.1, 0.6),
      c(10.9, 4.1, 0.6),
      c(4.1, 10.9, 0.6),
      c(10.9, 10.9, 0.6),
      l(4.7, 4.7, 10.3, 10.3),
      l(10.3, 4.7, 4.7, 10.3),
    ],
    {
      categories: ["design"],
    },
  ),

  icon(
    "type-uppercase",
    [
      p("M3.3 11.9 5.4 4.2 7.5 11.9"),
      l(4.1, 8.7, 6.7, 8.7),
      p("M9 4.2h3"),
      p("M10.5 4.2v7.7"),
    ],
    {
      categories: ["typography"],
    },
  ),
  icon(
    "type-lowercase",
    [
      p("M3.8 11.9V7.7a2.1 2.1 0 0 1 4.2 0v4.2"),
      p("M9 8.7h2.6a1.6 1.6 0 1 1 0 3.2H9V6.4"),
    ],
    {
      categories: ["typography"],
    },
  ),
  icon(
    "type-superscript",
    [
      p("M3.4 11.9 6 7.7"),
      l(3.4, 7.7, 6, 11.9),
      p("M8.7 5.2h2.7"),
      p("M10.05 5.2V2.8"),
    ],
    {
      categories: ["typography"],
    },
  ),
  icon(
    "type-subscript",
    [
      p("M3.4 10.8 6 6.6"),
      l(3.4, 6.6, 6, 10.8),
      p("M8.6 10.2h2.8"),
      p("M9.2 12.1h2.2"),
    ],
    {
      categories: ["typography"],
    },
  ),
  icon(
    "type-letter-spacing",
    [
      p("M3.4 11.9 5.1 4.2 6.8 11.9"),
      l(3.9, 8.7, 6.3, 8.7),
      l(9, 4.2, 9, 11.9),
      polyline("8 5.2 9 4.2 10 5.2"),
      polyline("8 10.9 9 11.9 10 10.9"),
    ],
    {
      categories: ["typography"],
    },
  ),
  icon(
    "type-line-height",
    [
      l(3.2, 5.2, 11.8, 5.2),
      l(3.2, 9.8, 11.8, 9.8),
      l(7.5, 3.2, 7.5, 11.8),
      polyline("6.5 4.2 7.5 3.2 8.5 4.2"),
      polyline("6.5 10.8 7.5 11.8 8.5 10.8"),
    ],
    {
      categories: ["typography"],
    },
  ),
  icon(
    "type-text-direction",
    [
      l(3.2, 4.8, 9.2, 4.8),
      l(3.2, 7.5, 9.2, 7.5),
      l(3.2, 10.2, 9.2, 10.2),
      polyline("8.1 3.7 9.2 4.8 8.1 5.9"),
      polyline("10.8 9.1 9.7 10.2 10.8 11.3"),
    ],
    {
      categories: ["typography"],
    },
  ),
  // End promoted semantic terms.
  // Promoted domain semantic terms as dedicated icons.
  icon(
    "admin-panel",
    [
      r(2.8, 3.1, 9.4, 8.8, { rx: 1 }),
      r(3.3, 3.6, 2.3, 7.8, { rx: 0.5 }),
      l(6.4, 5.1, 11.4, 5.1),
      l(6.4, 7.4, 11.4, 7.4),
      l(6.4, 9.7, 10.1, 9.7),
    ],
    {
      aliases: [
        "super-admin",
        "organization",
        "organization-chart",
        "workspace",
        "workspace-add",
        "workspace-remove",
        "tenant",
        "tenant-add",
        "tenant-switch",
        "team-add",
      ],
    },
  ),
  icon(
    "role",
    [
      c(5.4, 5.1, 1.5),
      p("M2.9 10.8c.5-1.3 1.5-2 2.8-2s2.3.7 2.8 2"),
      c(10.7, 5.6, 1.2),
      l(10.7, 7.2, 10.7, 10.9),
      l(9.1, 9.3, 12.3, 9.3),
    ],
    {
      aliases: [
        "role-admin",
        "role-user",
        "role-guest",
        "permission",
        "permission-add",
        "permission-remove",
        "access-control",
        "access-granted",
        "access-denied",
        "authorization",
      ],
    },
  ),
  icon(
    "audit-log",
    [
      r(3, 2.8, 9, 9.6, { rx: 1 }),
      l(5, 5.1, 10, 5.1),
      l(5, 7.4, 10, 7.4),
      l(5, 9.7, 8.6, 9.7),
      c(10.7, 10.7, 1.6),
      l(11.8, 11.8, 13, 13),
    ],
    {
      aliases: [
        "activity-log",
        "system-log",
        "event-log",
        "log",
        "log-filter",
        "log-search",
      ],
    },
  ),
  icon(
    "report",
    [
      r(3, 2.8, 9, 9.6, { rx: 1 }),
      l(5, 5.2, 9.8, 5.2),
      l(5, 7.5, 10.8, 7.5),
      l(5, 9.8, 8.3, 9.8),
      p("M9.2 11.4h3"),
    ],
    {
      aliases: [
        "report-generate",
        "report-download",
        "report-share",
        "report-scheduled",
        "report-analytics",
        "executive-summary",
        "board-report-product",
      ],
    },
  ),
  icon(
    "kpi",
    [
      l(3.1, 11.9, 11.9, 11.9),
      l(3.1, 11.9, 3.1, 3.4),
      p("M3.6 9.7 5.7 7.4 7.4 8.3 9.3 5.8 11.2 7.1"),
      c(11.2, 7.1, 0.45, { fill: "currentColor", stroke: "none" }),
    ],
    {
      aliases: [
        "kpi-trend",
        "insight",
        "insight-ai",
        "target-metric",
        "benchmark-metric",
        "comparison",
        "comparison-chart",
      ],
    },
  ),
  icon(
    "revenue",
    [
      l(3.1, 11.9, 11.9, 11.9),
      p("M3.6 9.7 5.6 7.7 7.3 8.8 9.5 6 11.3 4.8"),
      polyline("9.4 4.8 11.3 4.8 11.3 6.7"),
    ],
    {
      aliases: [
        "revenue-growth",
        "revenue-decline",
        "sales-growth",
        "sales-decline",
        "margin",
        "margin-gross",
        "margin-net",
        "roi",
        "roi-positive",
        "roi-negative",
      ],
    },
  ),
  icon(
    "conversion",
    [
      polygon("3.2,4.2 11.8,4.2 9.7,7.5 11.8,10.8 3.2,10.8 5.3,7.5", {
        fill: "none",
      }),
      l(5.4, 7.5, 9.6, 7.5),
    ],
    {
      aliases: [
        "conversion-rate",
        "funnel",
        "funnel-conversion",
        "churn",
        "churn-rate",
        "retention",
        "retention-rate",
        "acquisition",
        "acquisition-cost",
        "attribution",
        "attribution-model",
        "source",
        "source-organic",
        "source-paid",
      ],
    },
  ),
  icon(
    "forecast",
    [
      c(4.5, 9.1, 0.8, { fill: "currentColor", stroke: "none" }),
      c(7.5, 6.8, 0.8, { fill: "currentColor", stroke: "none" }),
      c(10.5, 4.9, 0.8, { fill: "currentColor", stroke: "none" }),
      l(4.5, 9.1, 7.5, 6.8),
      l(7.5, 6.8, 10.5, 4.9),
    ],
    {
      aliases: [
        "forecast-up",
        "forecast-down",
        "projection",
        "projection-growth",
        "variance",
        "variance-positive",
        "variance-negative",
        "goal",
        "goal-track",
      ],
    },
  ),
  icon(
    "budget",
    [
      r(2.8, 4.6, 9.4, 5.8, { rx: 1 }),
      l(2.8, 6.8, 12.2, 6.8),
      l(7.5, 4.6, 7.5, 10.4),
      c(7.5, 7.5, 1.1),
    ],
    {
      aliases: [
        "budget-plan",
        "expense",
        "expense-report",
        "profit",
        "loss",
        "balance",
        "balance-sheet",
        "cashflow",
        "cashflow-positive",
        "cashflow-negative",
        "ledger",
        "ledger-entry",
        "accounting",
        "bookkeeping",
        "journal",
        "reconciliation",
      ],
    },
  ),
  icon(
    "subscription",
    [
      c(7.5, 7.5, 4.7),
      l(7.5, 4.2, 7.5, 7.5),
      l(7.5, 7.5, 9.8, 8.9),
      polyline("9.4 2.9 11.4 2.9 11.4 4.9"),
    ],
    {
      aliases: [
        "subscription-active",
        "subscription-paused",
        "subscription-cancelled",
        "plan",
        "plan-upgrade",
        "plan-downgrade",
        "pricing",
        "pricing-tier",
        "billing",
        "billing-cycle",
        "billing-invoice",
        "recurring-payment",
        "subscription-fintech",
      ],
    },
  ),
  icon(
    "tax",
    [
      r(3, 2.8, 9, 9.6, { rx: 1 }),
      l(5, 5.2, 10, 5.2),
      l(5, 7.5, 10.8, 7.5),
      l(5, 9.8, 8.4, 9.8),
      l(9.8, 9.2, 11.6, 11),
    ],
    {
      aliases: [
        "tax-rate",
        "tax-report",
        "tax-filing",
        "tax-return",
        "invoice-admin",
        "invoice-ecommerce",
        "invoice-payment",
        "invoice-print",
        "receipt-digital",
        "receipt-print",
      ],
    },
  ),
  icon(
    "payout",
    [
      l(3.2, 11.8, 11.8, 11.8),
      l(7.5, 3.2, 7.5, 9.6),
      polyline("4.9 7 7.5 9.6 10.1 7"),
    ],
    {
      aliases: [
        "payout-scheduled",
        "payout-completed",
        "payout-failed",
        "payout-instant",
        "gateway",
        "gateway-stripe",
        "gateway-paypal",
        "gateway-razorpay",
        "clearing",
        "settlement",
        "remittance",
        "cross-border",
      ],
    },
  ),
  icon(
    "api-key",
    [
      c(4.8, 7.5, 1.6),
      l(6.4, 7.5, 12.2, 7.5),
      l(10.2, 7.5, 10.2, 9.1),
      l(11.4, 7.5, 11.4, 8.5),
    ],
    {
      aliases: [
        "api-key-generate",
        "api-key-revoke",
        "api-limit",
        "rate-limit",
        "throttle",
        "quota",
        "usage",
        "usage-daily",
        "usage-monthly",
        "usage-yearly",
        "limit",
        "limit-exceeded",
      ],
    },
  ),
  icon(
    "integration",
    [
      r(2.9, 4.4, 3.8, 3.8, { rx: 0.7 }),
      r(8.3, 4.4, 3.8, 3.8, { rx: 0.7 }),
      l(6.7, 6.3, 8.3, 6.3),
      l(3.9, 8.2, 3.9, 10.8),
      l(11.1, 8.2, 11.1, 10.8),
    ],
    {
      aliases: [
        "integration-add",
        "integration-remove",
        "integration-active",
        "webhook",
        "webhook-active",
        "sync-ecommerce",
        "sync-fintech",
      ],
    },
  ),
  icon(
    "support-ticket",
    [
      r(2.8, 4.2, 9.4, 6.8, { rx: 1 }),
      p("M4.3 8.4 3.7 10.8l2-.9"),
      l(5.2, 6.3, 9.8, 6.3),
    ],
    {
      aliases: [
        "support",
        "support-open",
        "support-closed",
        "helpdesk",
        "helpdesk-agent",
        "sla",
        "sla-breach",
        "feedback",
        "feedback-positive",
        "feedback-negative",
        "survey",
        "survey-response",
        "survey-analytics",
        "notification-admin",
        "broadcast-admin",
        "announcement",
        "announcement-global",
      ],
    },
  ),
  icon(
    "maintenance",
    [
      c(7.5, 7.5, 2.4),
      l(7.5, 2.8, 7.5, 4.1),
      l(7.5, 10.9, 7.5, 12.2),
      l(2.8, 7.5, 4.1, 7.5),
      l(10.9, 7.5, 12.2, 7.5),
      l(4.2, 4.2, 5.1, 5.1),
      l(9.9, 9.9, 10.8, 10.8),
    ],
    {
      aliases: [
        "maintenance-mode",
        "uptime",
        "uptime-99",
        "downtime",
        "downtime-alert",
        "server-admin",
        "server-health",
        "server-restart",
        "database-admin",
        "database-backup",
        "database-restore",
        "backup",
        "backup-scheduled",
        "restore",
        "restore-point",
      ],
    },
  ),
  icon(
    "compliance",
    [
      p(
        "M7.5 2.8 11.2 4.1v3.6c0 2.3-1.3 3.7-3.7 4.7-2.4-1-3.7-2.4-3.7-4.7V4.1z",
      ),
      p("M5.8 7.4 7.1 8.7 9.4 6.4"),
    ],
    {
      aliases: [
        "compliance-gdpr",
        "compliance-hipaa",
        "compliance-soc2",
        "compliance-fintech",
        "audit-fintech",
        "policy",
        "policy-update",
      ],
    },
  ),
  icon(
    "risk",
    [
      polygon("7.5,2.8 12.4,11.8 2.6,11.8"),
      l(7.5, 6, 7.5, 8.6),
      c(7.5, 10.3, 0.55, { fill: "currentColor", stroke: "none" }),
    ],
    {
      aliases: [
        "risk-low",
        "risk-medium",
        "risk-high",
        "risk-score",
        "incident",
        "incident-report",
        "incident-resolved",
        "anomaly",
        "anomaly-detected",
        "anomaly-ai",
        "fraud",
        "fraud-detected",
        "fraud-prevented",
      ],
    },
  ),
  icon(
    "monitoring",
    [
      l(3.1, 11.9, 11.9, 11.9),
      polyline("3.6 9.2 5.5 9.2 6.8 5.8 8.2 10.1 9.4 7.2 11.4 7.2"),
    ],
    {
      aliases: [
        "monitoring-live",
        "alert-admin",
        "alert-critical",
        "alert-warning",
        "alert-info",
        "threshold",
        "threshold-crossed",
      ],
    },
  ),
  icon(
    "deployment",
    [
      r(3, 3, 9, 9, { rx: 1 }),
      l(7.5, 4.1, 7.5, 9.8),
      polyline("5.4 7.7 7.5 9.8 9.6 7.7"),
    ],
    {
      aliases: [
        "deployment-success",
        "deployment-failed",
        "release",
        "release-version",
        "rollback",
        "rollback-success",
        "staging",
        "production",
        "sandbox",
        "devops",
        "devops-pipeline",
        "ci",
        "cd",
      ],
    },
  ),
  icon(
    "feature-flag",
    [l(4, 2.8, 4, 12.2), p("M4 3.4h6.6l-1.2 2.1 1.2 2.1H4")],
    {
      aliases: [
        "feature-flag-on",
        "feature-flag-off",
        "experimentation",
        "ab-test",
        "variant-a",
        "variant-b",
      ],
    },
  ),
  icon(
    "crm",
    [
      c(5.1, 5.2, 1.4),
      c(10.1, 5.2, 1.2),
      p("M2.9 10.8c.5-1.3 1.5-2 2.8-2s2.3.7 2.8 2"),
      p("M8.1 10.8c.4-1 1.2-1.6 2.2-1.6 1 0 1.8.6 2.2 1.6"),
    ],
    {
      aliases: [
        "crm-contact",
        "crm-deal",
        "crm-pipeline",
        "crm-stage",
        "crm-lead",
        "crm-conversion",
        "crm-sales",
        "pipeline-sales",
        "lead",
        "lead-qualified",
        "lead-converted",
        "proposal",
        "quotation",
        "estimate",
        "contract-deal",
        "negotiation",
      ],
    },
  ),
  icon(
    "workflow",
    [
      c(3.8, 4.3, 0.9),
      c(11.2, 4.3, 0.9),
      c(7.5, 10.7, 0.9),
      l(4.7, 4.3, 10.3, 4.3),
      l(4.3, 5.1, 6.9, 9.9),
      l(10.7, 5.1, 8.1, 9.9),
    ],
    {
      aliases: [
        "workflow-automation",
        "automation",
        "automation-rule",
        "automation-trigger",
        "pipeline",
        "pipeline-stage",
        "approval",
        "approval-pending",
        "approval-approved",
        "approval-rejected",
        "task-admin",
        "task-overdue",
        "milestone",
      ],
    },
  ),
  icon(
    "roadmap",
    [
      l(3, 11.8, 12, 11.8),
      l(4.2, 11.8, 4.2, 4.3),
      l(7.5, 11.8, 7.5, 6.3),
      l(10.8, 11.8, 10.8, 8.3),
      c(4.2, 4.3, 0.8),
      c(7.5, 6.3, 0.8),
      c(10.8, 8.3, 0.8),
    ],
    {
      aliases: [
        "roadmap-quarter",
        "roadmap-year",
        "sprint",
        "sprint-active",
        "sprint-completed",
        "kanban",
        "kanban-board",
        "backlog",
        "backlog-item",
        "priority",
        "priority-high",
        "priority-medium",
        "priority-low",
      ],
    },
  ),
  icon(
    "product",
    [
      p("M7.5 2.9 12 5.2v5.6l-4.5 2.3-4.5-2.3V5.2z"),
      l(7.5, 7.4, 7.5, 13.1),
      l(3, 5.2, 7.5, 7.4),
      l(12, 5.2, 7.5, 7.4),
    ],
    {
      aliases: [
        "product-add",
        "product-remove",
        "product-variant",
        "product-bundle",
        "product-digital",
        "product-physical",
        "catalog",
        "catalog-grid",
        "category",
        "category-add",
        "sku",
      ],
    },
  ),
  icon(
    "inventory",
    [
      r(3.1, 3.4, 8.8, 8.4, { rx: 1 }),
      l(3.1, 6.4, 11.9, 6.4),
      l(6.3, 6.4, 6.3, 11.8),
      l(8.7, 6.4, 8.7, 11.8),
    ],
    {
      aliases: [
        "inventory-low",
        "inventory-out",
        "stock",
        "stock-in",
        "stock-out",
        "warehouse-alt",
        "supplier",
        "supplier-add",
        "procurement",
        "wholesale",
        "retail",
        "demand",
        "supply",
        "purchase-order",
        "sales-order",
      ],
    },
  ),
  icon(
    "order",
    [
      r(3.2, 3.3, 8.6, 8.8, { rx: 1 }),
      l(5.2, 5.7, 9.8, 5.7),
      l(5.2, 8, 9.8, 8),
      l(5.2, 10.3, 8.4, 10.3),
    ],
    {
      aliases: [
        "order-pending",
        "order-processing",
        "order-shipped",
        "order-delivered",
        "order-cancelled",
        "order-returned",
        "fulfillment",
        "fulfillment-center",
        "cart-checkout",
        "checkout",
        "checkout-secure",
        "checkout-fast",
        "marketplace",
        "vendor",
        "commission",
        "commission-rate",
        "payout-vendor",
      ],
    },
  ),
  icon(
    "shipment",
    [
      p("M3.1 5.2 7.5 3 11.9 5.2v5.6l-4.4 2.2-4.4-2.2z"),
      l(7.5, 7.4, 7.5, 13),
      l(3.1, 5.2, 7.5, 7.4),
      l(11.9, 5.2, 7.5, 7.4),
    ],
    {
      aliases: [
        "shipment-track",
        "tracking-number",
        "address",
        "address-add",
        "address-edit",
        "packaging",
        "packaging-box",
        "label-shipping",
        "dropshipping",
        "international-shipping",
        "customs",
        "duty",
      ],
    },
  ),
  icon(
    "payment",
    [
      r(2.8, 4.3, 9.4, 6.4, { rx: 1 }),
      l(2.8, 6.5, 12.2, 6.5),
      l(4.3, 9.2, 7.2, 9.2),
    ],
    {
      aliases: [
        "payment-success",
        "payment-failed",
        "payment-method",
        "payment-card",
        "payment-upi",
        "payment-netbanking",
        "payment-wallet",
        "qr-payment",
        "pos",
        "pos-terminal",
        "wallet-balance",
        "wallet-add",
        "wallet-withdraw",
        "wallet-transfer",
        "secure-payment",
        "encryption",
        "vault",
        "vault-secure",
        "two-factor",
        "authentication",
      ],
    },
  ),
  icon(
    "transaction",
    [
      l(3.2, 4.7, 11.8, 4.7),
      polyline("9.6 2.9 11.8 4.7 9.6 6.5"),
      l(11.8, 10.3, 3.2, 10.3),
      polyline("5.4 8.5 3.2 10.3 5.4 12.1"),
    ],
    {
      aliases: [
        "transaction-success",
        "transaction-failed",
        "transaction-pending",
        "debit",
        "debit-card",
        "credit-limit",
        "credit-score",
        "emi",
        "installment",
        "cash",
        "cash-register",
        "change",
        "tip",
        "gratuity",
      ],
    },
  ),
  icon(
    "refund",
    [
      l(11.8, 4.7, 3.2, 4.7),
      polyline("5.4 2.9 3.2 4.7 5.4 6.5"),
      l(3.2, 10.3, 11.8, 10.3),
      polyline("9.6 8.5 11.8 10.3 9.6 12.1"),
    ],
    {
      aliases: [
        "refund-approved",
        "refund-rejected",
        "exchange",
        "exchange-item",
        "return",
        "return-request",
        "return-approved",
        "coupon",
        "coupon-active",
        "coupon-apply",
        "discount",
        "discount-percentage",
        "discount-fixed",
        "discount-code",
        "flash-sale",
        "clearance",
        "deal",
        "deal-hot",
        "bundle-offer",
        "dynamic-pricing",
        "pricing-discount",
        "price-tag",
        "price-drop",
      ],
    },
  ),
  icon(
    "loyalty",
    [p("M7.5 2.9 8.8 5.6l3 .4-2.2 2.1.5 3-2.6-1.4-2.6 1.4.5-3-2.2-2.1 3-.4z")],
    {
      aliases: [
        "loyalty-points",
        "gift-card-balance",
        "wishlist",
        "wishlist-add",
        "compare-product",
        "review",
        "review-add",
        "review-star",
        "rating",
        "rating-half",
        "customer-new",
        "customer-repeat",
        "customer-vip",
        "upsell",
        "cross-sell",
        "affiliate",
        "affiliate-link",
        "referral",
        "referral-code",
        "referral-bonus",
      ],
    },
  ),
  icon(
    "fintech",
    [
      r(2.8, 4.6, 9.4, 5.8, { rx: 1 }),
      c(7.5, 7.5, 1.3),
      l(10.7, 4.4, 12.2, 2.9),
      l(10.7, 10.6, 12.2, 12.1),
    ],
    {
      aliases: [
        "kyc",
        "kyc-verified",
        "aml",
        "biometric-payment",
        "face-id",
        "touch-id",
        "otp",
        "blockchain",
        "crypto",
        "crypto-wallet",
        "nft",
        "nft-marketplace",
        "staking",
        "mining",
        "mutual-fund",
        "stocks",
        "portfolio",
        "portfolio-diversified",
        "investment",
        "investment-growth",
        "savings",
        "savings-goal",
        "interest",
        "interest-rate",
        "loan",
        "loan-approved",
        "loan-rejected",
        "mortgage",
        "insurance",
        "insurance-policy",
        "claim",
        "claim-approved",
        "claim-rejected",
      ],
    },
  ),
  icon(
    "productivity",
    [c(7.5, 7.5, 4.7), l(7.5, 4.5, 7.5, 7.5), l(7.5, 7.5, 9.5, 8.9)],
    {
      aliases: [
        "productivity-focus",
        "pomodoro",
        "timer-productivity",
        "notes",
        "notes-add",
        "notes-checklist",
        "document",
        "document-sign",
        "document-verify",
        "contract",
        "contract-sign",
        "signature",
        "e-signature",
        "collaboration",
        "collaboration-live",
        "team-chat",
        "project",
        "project-active",
        "project-complete",
        "goal-productivity",
        "habit",
        "habit-track",
        "streak",
        "streak-fire",
        "calendar-productivity",
        "reminder",
        "reminder-add",
        "reminder-snooze",
        "planner",
        "planner-week",
        "planner-month",
        "roadmap-product",
        "idea-board",
        "brainstorming",
        "mindmap",
        "whiteboard",
        "task-productivity",
        "task-complete",
        "task-pending",
        "checklist-productivity",
        "kanban-productivity",
        "gantt",
        "milestone-product",
        "dashboard-productivity",
      ],
    },
  ),
  icon(
    "marketing",
    [
      polygon("3.2,7.1 9.6,4.6 9.6,10.4 3.2,7.9", { fill: "none" }),
      l(9.6, 5.6, 11.5, 5.1),
      l(9.6, 9.4, 11.5, 9.9),
      r(3.2, 7.1, 1.8, 3.6, { rx: 0.45 }),
    ],
    {
      aliases: [
        "campaign",
        "campaign-active",
        "campaign-paused",
        "campaign-sales",
        "email-campaign",
        "sms-campaign",
        "push-campaign",
        "social-commerce",
        "live-commerce",
        "influencer",
        "influencer-marketing",
        "ad-spend",
        "mobile-commerce",
        "omnichannel",
        "channel-online",
        "channel-offline",
        "storefront",
        "storefront-online",
        "storefront-offline",
        "export-sales",
        "import-products",
        "dashboard-ecommerce",
        "dashboard-fintech",
      ],
    },
  ),
  // End promoted domain semantic terms.
  // Semantic alias bundles to map broad admin/UI vocabulary onto base glyphs.
  icon(
    "semantic-ui",
    [
      r(2.8, 3.1, 9.4, 8.8, { rx: 1 }),
      l(3.5, 6.1, 11.5, 6.1),
      l(3.5, 8.9, 11.5, 8.9),
      l(5.4, 3.7, 5.4, 11.3),
    ],
    {
      aliases: [
        "drag-handle",
        "drag-indicator",
        "heatmap",
        "user-flow",
        "sitemap",
      ],
    },
  ),
  icon(
    "semantic-admin",
    [
      r(2.8, 3.1, 9.4, 8.8, { rx: 1 }),
      c(5, 5.3, 0.6, { fill: "currentColor", stroke: "none" }),
      c(5, 8.1, 0.6, { fill: "currentColor", stroke: "none" }),
      l(6.6, 5.3, 11.2, 5.3),
      l(6.6, 8.1, 11.2, 8.1),
      l(3.3, 10.6, 11.7, 10.6),
    ],
    {
      aliases: [
        "cohort",
        "cohort-analysis",
        "segmentation",
        "segmentation-user",
        "segmentation-behavior",
        "segmentation-demographic",
        "user-analytics",
        "user-growth",
        "active-users",
        "daily-active-users",
        "monthly-active-users",
        "session",
        "session-duration",
        "bounce-rate",
        "page-view",
        "heatmap-analytics",
        "click-tracking",
        "scroll-depth",
      ],
    },
  ),
  icon(
    "semantic-business",
    [
      r(2.8, 3.1, 9.4, 8.8, { rx: 1 }),
      p("M3.6 10.5 5.6 8.2 7.2 8.9 9.1 6.4 11.6 7.8"),
      l(3.3, 10.6, 11.7, 10.6),
      l(3.3, 10.6, 3.3, 4.2),
    ],
    {
      aliases: [
        "tag-admin",
        "label-admin",
        "archive-admin",
        "export",
        "export-csv",
        "export-pdf",
        "import",
        "import-csv",
        "import-api",
        "data",
        "data-sync",
        "data-refresh",
        "data-clean",
        "data-warehouse",
        "data-lake",
        "etl",
        "etl-process",
        "schema",
        "schema-update",
        "mapping",
        "mapping-field",
        "transformation",
        "transformation-rule",
        "analytics-ai",
        "ai-model",
        "ai-training",
        "ai-deployment",
        "ai-prediction",
        "recommendation",
        "recommendation-ai",
        "personalization",
        "personalization-ai",
        "chatbot",
        "chatbot-admin",
        "bot-training",
        "bot-response",
        "experiment",
        "experiment-result",
        "insights-dashboard",
        "barcode-scan",
        "subscription-product",
        "recurring-order",
        "escrow",
        "escrow-secure",
        "yield",
        "payroll",
        "payslip",
        "attendance",
        "attendance-checkin",
        "attendance-checkout",
        "timesheet",
        "analytics-sales",
        "currency-convert",
        "currency-exchange",
        "exchange-rate",
        "global-payment",
        "subscription-box",
        "preorder",
        "backorder",
        "waitlist",
        "ledger-fintech",
        "arrears",
        "overdue",
        "dunning",
        "donation",
        "charity",
        "crowdfunding",
        "fundraiser",
        "campaign-donation",
      ],
    },
  ),
  icon(
    "link-2",
    [
      polyline("5.5 9 4.25 10.25 2.95 8.95 4.2 7.7"),
      polyline("9.5 6 10.75 4.75 12.05 6.05 10.8 7.3"),
      l(5.9, 9.1, 9.1, 5.9),
    ],
    { aliases: ["chain-link", "attachment", "paperclip"] },
  ),
  icon("command", [
    p(
      "M5.1 5.1a1.6 1.6 0 1 1 0-3.2h1.2v4.4H5.1a1.6 1.6 0 1 1 0-3.2h4.8a1.6 1.6 0 1 1 0 3.2H8.7v4.4h1.2a1.6 1.6 0 1 1 0 3.2H8.7V9.5H6.3v1.2H5.1a1.6 1.6 0 1 1 0 3.2h1.2V9.5H5.1a1.6 1.6 0 1 1 0-3.2",
    ),
  ]),
];

export const iconNameList = Array.from(
  new Set(iconDefinitions.map((entry) => entry.name)),
).sort();
