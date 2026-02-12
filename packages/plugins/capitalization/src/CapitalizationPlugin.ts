import { Plugin } from '@editora/core';

export const CapitalizationPlugin = (): Plugin => ({
  name: "capitalization",
  toolbar: [
    {
      label: "Capitalization",
      command: "setCapitalization",
      type: "inline-menu",
      options: [
        { label: "lowercase", value: "lowercase" },
        { label: "UPPERCASE", value: "uppercase" },
        { label: "Title Case", value: "titlecase" },
      ],
      icon: '<svg fill="#000000" width="24" height="24" viewBox="0 0 32.00 32.00" id="icon" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.192"></g><g id="SVGRepo_iconCarrier"><defs><style>.cls-1{fill:none;}</style></defs><title>letter--Aa</title><path d="M23,13H18v2h5v2H19a2,2,0,0,0-2,2v2a2,2,0,0,0,2,2h6V15A2,2,0,0,0,23,13Zm0,8H19V19h4Z"></path><path d="M13,9H9a2,2,0,0,0-2,2V23H9V18h4v5h2V11A2,2,0,0,0,13,9ZM9,16V11h4v5Z"></path><rect id="_Transparent_Rectangle_" data-name="&lt;Transparent Rectangle&gt;" class="cls-1" width="32" height="32"></rect></g></svg>',
    },
  ],
  // context: {
  //   provider: CapitalizationPluginProvider
  // }
});
