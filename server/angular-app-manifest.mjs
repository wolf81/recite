
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/recite/',
  locale: undefined,
  routes: undefined,
  entryPointToBrowserMapping: {},
  assets: {
    'index.csr.html': {size: 6779, hash: '207b55b4cad25cd1bd6c00c90366f0d2e51182790452aa13ae505322728a20a0', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1295, hash: 'e31dc2ef1ec406c6aedd8da73a706c74e449970624f7458f6aa21516f5df7209', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'styles-Y4UA3O3I.css': {size: 83836, hash: 'WsPjzHP/EMU', text: () => import('./assets-chunks/styles-Y4UA3O3I_css.mjs').then(m => m.default)}
  },
};
