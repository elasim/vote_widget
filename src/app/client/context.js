export default {
  insertCss: (...styles) => {
    styles.forEach(style => style.use());
    return () => styles.forEach(style => style.unuse());
  },
  setTitle: value => document.title = value,
  setMeta: (key, value) => {
    const metaTags = document.getElementsByTagNames('meta');
    Array.from(metaTags).forEach(meta => {
      if (meta.getAttribute('name') === key) {
        meta.parentNode.removeChild(meta);
      }
    });
    const newMeta = document.createElement('meta');
    newMeta.setAttribute('name', key);
    newMeta.setAttribute('content', value);
    document.getElementsByTagName('head')[0].appendChild(newMeta);
  }
};
