// Hands the stylesheet to the renderer, which puts it on the page with the first toast.
import css from "./toast.css?inline";
import { provideStyles } from "./core/styles";

provideStyles(css);
