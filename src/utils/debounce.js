/*
  debounce.js
  -----------
  Classic debounce with cancel support — delays execution
  until the caller stops firing for `wait` milliseconds.
  Used mainly in the global search bar so we don't hammer
  Supabase on every keystroke.
*/

export function debounce(fn, wait = 350) {
  let timer;
  function debounced(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), wait);
  }
  debounced.cancel = () => clearTimeout(timer);
  return debounced;
}
