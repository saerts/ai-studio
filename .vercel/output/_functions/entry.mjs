import { renderers } from './renderers.mjs';
import { c as createExports, s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_CMVePzp7.mjs';
import { manifest } from './manifest_Dd7YcX9_.mjs';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/404.astro.mjs');
const _page2 = () => import('./pages/ai-voor-bedrijven.astro.mjs');
const _page3 = () => import('./pages/api/blog/_slug_.astro.mjs');
const _page4 = () => import('./pages/api/blog.astro.mjs');
const _page5 = () => import('./pages/blog/_slug_.astro.mjs');
const _page6 = () => import('./pages/blog.astro.mjs');
const _page7 = () => import('./pages/contact.astro.mjs');
const _page8 = () => import('./pages/diensten.astro.mjs');
const _page9 = () => import('./pages/nieuws/_slug_.astro.mjs');
const _page10 = () => import('./pages/nieuws.astro.mjs');
const _page11 = () => import('./pages/privacy.astro.mjs');
const _page12 = () => import('./pages/rss.xml.astro.mjs');
const _page13 = () => import('./pages/terms.astro.mjs');
const _page14 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/404.astro", _page1],
    ["src/pages/ai-voor-bedrijven.astro", _page2],
    ["src/pages/api/blog/[slug].ts", _page3],
    ["src/pages/api/blog.ts", _page4],
    ["src/pages/blog/[slug].astro", _page5],
    ["src/pages/blog.astro", _page6],
    ["src/pages/contact.astro", _page7],
    ["src/pages/diensten.astro", _page8],
    ["src/pages/nieuws/[slug].astro", _page9],
    ["src/pages/nieuws.astro", _page10],
    ["src/pages/privacy.astro", _page11],
    ["src/pages/rss.xml.ts", _page12],
    ["src/pages/terms.astro", _page13],
    ["src/pages/index.astro", _page14]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./_noop-actions.mjs'),
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = {
    "middlewareSecret": "7febebb5-2469-419a-a254-6dce2e818d3d",
    "skewProtection": false
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = 'start';
if (Object.prototype.hasOwnProperty.call(serverEntrypointModule, _start)) ;

export { __astrojsSsrVirtualEntry as default, pageMap };
