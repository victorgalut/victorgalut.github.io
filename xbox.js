/* Xbox 360 "Achievement unlocked" toasts.
   Add <script src="xbox.js"></script> just before </body>. */
(function () {
  var toast = document.createElement('div');
  toast.className = 'toast';
  toast.setAttribute('role', 'status');
  toast.setAttribute('aria-live', 'polite');
  toast.innerHTML =
    '<span class="toast-icon" aria-hidden="true">G</span>' +
    '<span><span class="toast-title"></span><span class="toast-desc"></span></span>';
  document.body.appendChild(toast);

  var title = toast.querySelector('.toast-title');
  var desc = toast.querySelector('.toast-desc');
  var queue = [];
  var busy = false;

  function next() {
    if (busy || !queue.length) return;
    busy = true;
    var a = queue.shift();
    title.textContent = a.points + 'G · Achievement unlocked';
    desc.textContent = a.name;
    toast.classList.add('show');
    setTimeout(function () {
      toast.classList.remove('show');
      setTimeout(function () { busy = false; next(); }, 600);
    }, 3200);
  }

  var earned = {};
  function unlock(id, name, points) {
    if (earned[id]) return;
    earned[id] = true;
    queue.push({ name: name, points: points });
    next();
  }

  // Page load
  setTimeout(function () { unlock('load', 'Welcome to the portfolio', 10); }, document.documentElement.classList.contains('booting') ? 5200 : 1500);

  // Opening any popup (project or experience)
  document.querySelectorAll('[data-open]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var id = btn.dataset.open;
      unlock(id, id.charAt(0) === 'p' ? 'Opened a project' : 'Read the full story', 15);
    });
  });

  // Reaching each section
  var sections = {
    experience: 'Checked the experience',
    projects: 'Browsed the projects',
    interests: 'Found the hobbies',
    contact: 'Reached the end. Say hi!'
  };
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) unlock('sec-' + e.target.id, sections[e.target.id], 20);
    });
  }, { threshold: 0.4 });
  Object.keys(sections).forEach(function (id) {
    var el = document.getElementById(id);
    if (el) io.observe(el);
  });
})();
