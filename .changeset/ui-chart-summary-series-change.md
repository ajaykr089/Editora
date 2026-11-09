---
'@editora/ui-core': patch
'@editora/ui-react': patch
---

`ui-chart`: with several series, the summary row and the readout under the plot say which series their figures describe (they always used the first one, unnamed). New `show-change="false"` (React `showChange={false}`) for charts of categories, such as deal stages or devices: the summary shows the lowest value instead of a first-to-last change, which means nothing there. The "Delta" label now reads "Change".
