import React, { PropTypes } from 'react';

export default function Html(props) {
  const {
    title,
    lang,
    content,
    initialState,
    meta,
    bundle,
  } = props;
  const metaTags = Object.keys(meta).map(key => {
    return <meta key={key} name={key} content={meta[key]} />;
  });
  const state = {
    __html: JSON.stringify(initialState)
  };
  return (
    <html className="no-js" lang={lang}>
      <head>
        <meta charSet="utf-8" />
        <title>{title}</title>
        {metaTags}
      </head>
      <body>
        <div id="app" dangerouslySetInnerHTML={content} />
        <script type="app-initial-state" dangerouslySetInnerHTML={state} />
        <script src={bundle}/>
      </body>
    </html>
  );
}

Html.propTypes = {
  title: PropTypes.string,
  lang: PropTypes.string,
  content: PropTypes.object,
  initialState: PropTypes.object,
  meta: PropTypes.object,
  bundle: PropTypes.string,
};
