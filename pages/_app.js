/**
 * _app.js
 *
 * Next.js custom App component. This wraps every page.
 * We import global styles here so they apply everywhere.
 */

import '../styles/globals.css';

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
