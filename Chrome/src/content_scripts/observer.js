/** This file handles observing page changes */

/** Begins running the observer
 * callback: the function to call when a change is observed and when the observer is set up
*/
/*eslint-disable*/
const initObserver = (() => {
  const config = {
    subtree: true,
    childList: true,
    characterData: true,
    attributes: true,
    attributeFilter: ['contenteditable', 'crypto_mark'],
  };
  let otherDecryptTimeout = false;

  return (callback) => {
    const observer = new MutationObserver(() => {
      clearTimeout(otherDecryptTimeout);
      otherDecryptTimeout = setTimeout(() => {
        callback();
      }, 50);
    });

    observer.observe(document.body, config);
    callback();
  };
})();

// if (typeof module !== 'undefined' && module.exports) {
//   module.exports = initObserver;
// } else {
//   window.initObserver = initObserver;
// }
export { initObserver };
