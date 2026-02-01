// Page-Scoped Assistant — SoulInPsyAbstract
// Scope: current page only. No global knowledge.

(function () {
  const page = location.pathname.split('/').pop().replace('.html','');
  const dataPath = `/meta/data/${page}.json`;

  let knowledge = null;

  fetch(dataPath)
    .then(r => r.json())
    .then(j => knowledge = j)
    .catch(() => knowledge = null);

  window.SIPA_ASK = function(question) {
    if (!knowledge) {
      return "This assistant is scoped to this page only. No data loaded.";
    }

    const text = JSON.stringify(knowledge).toLowerCase();
    const q = question.toLowerCase();

    if (text.includes(q)) {
      return "Yes. This page covers that. Scroll — it’s already here.";
    }

    return "This page does not contain information about that.";
  };
})();
