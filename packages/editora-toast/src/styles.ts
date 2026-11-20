/// <reference path="./css.d.ts" />
// Hands the stylesheet to the renderer, which puts it on the page with the first toast. (The reference above declares
// `*.css?inline` for any program that compiles this file, such as an app type-checking the package from its source.)
import css from "./toast.css?inline";
import { provideStyles } from "./core/styles";

provideStyles(css);
