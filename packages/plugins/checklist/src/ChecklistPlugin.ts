import { Plugin } from '@editora/core';

export const ChecklistPlugin = (): Plugin => ({
  name: "checklist",
  nodes: {
    checklist: {
      content: "checklistItem+",
      group: "block",
      parseDOM: [{ tag: 'ul[data-type="checklist"]' }],
      toDOM: () => ["ul", { "data-type": "checklist" }, 0],
    },
    checklistItem: {
      content: "paragraph",
      attrs: {
        checked: { default: false },
      },
      parseDOM: [
        {
          tag: 'li[data-type="checklist-item"]',
          getAttrs: (dom) => ({
            checked: (dom as HTMLElement).getAttribute("data-checked") === "true",
          }),
        },
      ],
      toDOM: (node) => [
        "li",
        {
          "data-type": "checklist-item",
          "data-checked": node?.attrs?.checked ? "true" : "false",
        },
        0,
      ],
    },
  },
  toolbar: [
    {
      label: "Checklist",
      command: "toggleChecklist",
      icon: '<svg width="24px" height="24px" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path fill-rule="evenodd" clip-rule="evenodd" d="M3.75 4.48h-.71L2 3.43l.71-.7.69.68L4.81 2l.71.71-1.77 1.77zM6.99 3h8v1h-8V3zm0 3h8v1h-8V6zm8 3h-8v1h8V9zm-8 3h8v1h-8v-1zM3.04 7.48h.71l1.77-1.77-.71-.7L3.4 6.42l-.69-.69-.71.71 1.04 1.04zm.71 3.01h-.71L2 9.45l.71-.71.69.69 1.41-1.42.71.71-1.77 1.77zm-.71 3.01h.71l1.77-1.77-.71-.71-1.41 1.42-.69-.69-.71.7 1.04 1.05z"></path></g></svg>',
    },
  ],
});
