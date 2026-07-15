(function () {
  var DRINKS = [
    { name: 'Espresso', emoji: '☕', recipe: ['espresso'], hint: 'Just a pure shot of espresso. Simple and strong!' },
    { name: 'Americano', emoji: '🍵', recipe: ['espresso', 'water'], hint: 'Espresso diluted with hot water.' },
    { name: 'Latte', emoji: '🥛', recipe: ['espresso', 'milk', 'milk', 'foam'], hint: 'Espresso with lots of steamed milk and a little foam.' },
    { name: 'Cappuccino', emoji: '☕', recipe: ['espresso', 'milk', 'foam'], hint: 'Equal parts espresso, steamed milk, and foam.' },
    { name: 'Mocha', emoji: '🍫', recipe: ['espresso', 'milk', 'chocolate', 'foam'], hint: 'Espresso with milk, chocolate syrup, and foam.' },
    { name: 'Macchiato', emoji: '🎯', recipe: ['espresso', 'foam'], hint: 'Espresso marked with a dollop of foam.' }
  ];
  var INGREDIENTS = [
    { id: 'espresso', label: 'Espresso Shot', emoji: '🟤', color: 'bg-[#4A2C1A]' },
    { id: 'water', label: 'Hot Water', emoji: '💧', color: 'bg-[#A8C8D8]' },
    { id: 'milk', label: 'Steamed Milk', emoji: '🥛', color: 'bg-[#F5E6D3]' },
    { id: 'foam', label: 'Milk Foam', emoji: '☁️', color: 'bg-[#FFFAF0]' },
    { id: 'chocolate', label: 'Chocolate', emoji: '🍫', color: 'bg-[#6B3F2A]' }
  ];
  var HEIGHTS = { espresso: 'h-16', water: 'h-12', milk: 'h-14', foam: 'h-8', chocolate: 'h-6' };
  var CUSTOMERS = ['🧑‍💼', '👩‍🎨', '🧓', '👨‍💻', '👩‍🔬', '🧕', '👦', '👩‍🚀'];

  var score = 0, streak = 0, round = 0;
  var order = null, cup = [], feedback = null;

  var $ = function (id) { return document.getElementById(id); };
  var startScreen = $('start-screen'), gameScreen = $('game-screen'), hud = $('hud'),
      restartWrap = $('restart-wrap'), modal = $('modal');

  function findIng(id) {
    for (var i = 0; i < INGREDIENTS.length; i++) if (INGREDIENTS[i].id === id) return INGREDIENTS[i];
    return null;
  }

  function renderIngredients() {
    var wrap = $('ingredients');
    wrap.innerHTML = '';
    INGREDIENTS.forEach(function (ing) {
      var btn = document.createElement('button');
      btn.className = 'w-full flex items-center gap-4 p-4 bg-[#F1ECE4] border border-[#1C1613]/10 hover:border-[#8C6239] hover:bg-white transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed';
      btn.innerHTML = '<span class="text-3xl">' + ing.emoji + '</span>' +
        '<span class="font-sans font-semibold text-sm text-[#1C1613]">' + ing.label + '</span>' +
        '<span class="ml-auto text-[#8C6239] font-bold text-lg">+</span>';
      btn.addEventListener('click', function () {
        if (feedback) return;
        cup.push(ing.id);
        renderCup();
      });
      wrap.appendChild(btn);
    });
  }

  function renderCup() {
    var layers = $('cup-layers');
    layers.innerHTML = '';
    cup.forEach(function (id) {
      var ing = findIng(id);
      var div = document.createElement('div');
      div.className = 'ing-layer ' + ing.color + ' ' + HEIGHTS[id] + ' w-full flex items-center justify-center text-lg';
      div.textContent = ing.emoji;
      layers.appendChild(div);
    });
    $('cup-empty').classList.toggle('hidden', cup.length > 0);
    $('steam-wrap').classList.toggle('hidden', !(cup.length > 0 && !feedback));
    $('steam-wrap').classList.toggle('flex', cup.length > 0 && !feedback);
    $('clear-btn').disabled = !!feedback || cup.length === 0;
    $('serve-btn').disabled = !!feedback || cup.length === 0;
    var inCup = $('in-cup');
    inCup.classList.toggle('hidden', !(cup.length > 0 && !feedback));
    var emojis = $('in-cup-emojis');
    emojis.innerHTML = '';
    cup.forEach(function (id) {
      var s = document.createElement('span');
      s.className = 'text-lg';
      s.textContent = findIng(id).emoji;
      emojis.appendChild(s);
    });
    var wrap = $('cup-wrap');
    wrap.classList.remove('wiggle');
    if (cup.length > 0) { void wrap.offsetWidth; wrap.classList.add('wiggle'); }
  }

  function newOrder() {
    order = DRINKS[Math.floor(Math.random() * DRINKS.length)];
    cup = [];
    feedback = null;
    round++;
    $('customer').textContent = CUSTOMERS[round % CUSTOMERS.length];
    $('order-name').textContent = order.name + ' ' + order.emoji;
    $('order-hint').textContent = '"' + order.hint + '"';
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    renderCup();
  }

  function serve() {
    if (!order || feedback) return;
    var got = cup.slice().sort().join(',');
    var want = order.recipe.slice().sort().join(',');
    if (got === want) {
      var points = 100 + streak * 25;
      score += points;
      streak++;
      feedback = { correct: true, message: 'Perfect brew! Customer is delighted! ✨', points: points };
    } else {
      streak = 0;
      var recipeLabels = order.recipe.map(function (id) { return findIng(id).label; }).join(' + ');
      feedback = { correct: false, message: 'Oops! The recipe was: ' + recipeLabels, points: 0 };
    }
    $('score').textContent = score;
    $('streak').textContent = streak;
    showModal();
    renderCup();
  }

  function showModal() {
    $('modal-emoji').textContent = feedback.correct ? '🥳' : '😅';
    var title = $('modal-title');
    title.textContent = feedback.correct ? 'Perfect Brew!' : 'Not Quite...';
    title.className = 'font-serif text-3xl font-bold mb-2 ' + (feedback.correct ? 'text-[#8C6239]' : 'text-[#1C1613]');
    $('modal-message').textContent = feedback.message;
    var stars = $('modal-stars');
    stars.innerHTML = '';
    if (feedback.correct) {
      var n = Math.min(streak, 5);
      for (var i = 0; i < n; i++) {
        stars.innerHTML += '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#C4A482" stroke="#C4A482" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/></svg>';
      }
      $('modal-points').textContent = '+' + feedback.points + ' points';
      $('modal-points').classList.remove('hidden');
    } else {
      $('modal-points').classList.add('hidden');
    }
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }

  function startGame() {
    score = 0; streak = 0; round = 0;
    $('score').textContent = '0';
    $('streak').textContent = '0';
    startScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    gameScreen.classList.add('grid');
    hud.classList.remove('hidden');
    hud.classList.add('flex');
    restartWrap.classList.remove('hidden');
    newOrder();
  }

  $('start-btn').addEventListener('click', startGame);
  $('clear-btn').addEventListener('click', function () { if (!feedback) { cup = []; renderCup(); } });
  $('serve-btn').addEventListener('click', serve);
  $('next-btn').addEventListener('click', newOrder);
  modal.addEventListener('click', function (e) { if (e.target === modal) newOrder(); });
  $('restart-btn').addEventListener('click', function () {
    gameScreen.classList.add('hidden');
    gameScreen.classList.remove('grid');
    hud.classList.add('hidden');
    hud.classList.remove('flex');
    restartWrap.classList.add('hidden');
    startScreen.classList.remove('hidden');
  });

  renderIngredients();
})();
