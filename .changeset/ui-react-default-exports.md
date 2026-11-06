---
'@editora/ui-react': patch
---

Every `@editora/ui-react/<Name>` entry now has both a default and a named export (the same component). Avatar, Checkbox, DirectionProvider, Portal, Presence, Progress, Radio, RadioGroup, ScrollArea, Separator and VisuallyHidden only had the named one, so `import Checkbox from '@editora/ui-react/Checkbox'` rendered "Element type is invalid".
