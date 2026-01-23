import React from 'react';
import { Helmet } from 'react-helmet';

export default function RouteSEO({ title, description, url, image }){
  const site = 'https://mytechz.in';
  return (
    <Helmet>
      <title>{title ? `${title} — MytechZ` : 'MytechZ — Jobs & Internships'}</title>
      <meta name="description" content={description || 'MytechZ — job portal and tech solutions.'} />
      <link rel="canonical" href={url ? `${site}${url}` : site} />
      <meta property="og:title" content={title || 'MytechZ — Jobs & Internships'} />
      <meta property="og:description" content={description || 'MytechZ — job portal and tech solutions.'} />
      <meta property="og:image" content={image || '/og-image.png'} />
      <meta property="og:url" content={url ? `${site}${url}` : site} />
      <meta name="twitter:card" content="summary_large_image" />
    </Helmet>
  );
}
