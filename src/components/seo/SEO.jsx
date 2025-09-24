import { Helmet } from 'react-helmet-async';

const SEO = ({ 
  title = "Serguo AI - Your Image to Text AI Assistant",
  description = "Intelligent AI assistant powered by Google's Gemini model. Upload images, PDFs, and get detailed analysis. Free to use with advanced image recognition capabilities.",
  keywords = "Serguo AI, AI assistant, image analysis, PDF reader, Google Gemini, AI chat, image to text, AI image recognition, free AI tool, Mr Heritage",
  image = "/serguo.jpeg",
  url = "https://serguo-ai.web.app",
  structuredData = null,
  author = "Mr Heritage",
  twitterHandle = "@Inioluwa_dev"
}) => {
  const fullTitle = title.includes("Serguo AI") ? title : `${title} | Serguo AI`;
  
  // Ensure image URL is absolute for social media cards
  const fullImageUrl = image.startsWith('http') ? image : `${url}${image}`;
  
  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={url} />
      
      {/* Language and Locale */}
      <meta name="language" content="English" />
      <meta name="geo.region" content="NG" />
      <meta name="geo.country" content="Nigeria" />
      
      {/* App Information */}
      <meta name="application-name" content="Serguo AI" />
      <meta name="apple-mobile-web-app-title" content="Serguo AI" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      
      {/* Theme and Viewport */}
      <meta name="theme-color" content="#181818" />
      <meta name="msapplication-TileColor" content="#181818" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:image:secure_url" content={fullImageUrl} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content="Serguo AI" />
      <meta property="og:locale" content="en_US" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:type" content="image/jpeg" />
      <meta property="og:image:alt" content="Serguo AI - Your Image to Text AI Assistant" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageUrl} />
      <meta name="twitter:image:src" content={fullImageUrl} />
      <meta name="twitter:image:alt" content="Serguo AI - Your Image to Text AI Assistant" />
      <meta name="twitter:creator" content={twitterHandle} />
      <meta name="twitter:site" content={twitterHandle} />
      <meta name="twitter:domain" content="serguo-ai.web.app" />
      
      {/* Additional SEO Meta Tags */}
      <meta name="rating" content="General" />
      <meta name="distribution" content="Global" />
      <meta name="revisit-after" content="7 days" />
      <meta name="expires" content="never" />
      <meta name="cache-control" content="public, max-age=31536000" />
      
      {/* Name variations for better searchability */}
      <meta name="alternate-name" content="Serguo" />
      <meta name="alternate-name" content="Serguo AI" />
      <meta name="alternate-name" content="Image to Text AI" />
      <meta name="alternate-name" content="AI Image Analysis" />
      <meta name="alternate-name" content="Mr Heritage AI" />
      
      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
      
      {/* Favicon */}
      <link rel="icon" type="image/jpeg" href={fullImageUrl} />
      <link rel="apple-touch-icon" href={fullImageUrl} />
      <link rel="shortcut icon" href={fullImageUrl} />
    </Helmet>
  );
};

export default SEO;
