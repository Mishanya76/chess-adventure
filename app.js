(() => {
  "use strict";

  const FILES = "abcdefgh";
  const STORAGE_KEY = "chess-adventure-progress-v1";
  const EXTRA_MOVES = 2;
  const BOSS_EXTRA_MOVES = 1;
  const MAX_STARS = 3;
  const CORRECT_MESSAGE = "Нажми на свою фигуру, чтобы увидеть её ходы.";

  const REWARDS = [
    {
      id: "sticker",
      emoji: "🌟",
      title: "Наклейка на тетрадь",
      note: "Покажи родителям свой первый приз.",
      cost: 30
    },
    {
      id: "cartoon",
      emoji: "📺",
      title: "Мультик по выбору",
      note: "Один мультик после занятия.",
      cost: 60
    },
    {
      id: "game",
      emoji: "♟️",
      title: "Партия с родителем",
      note: "Сыграйте вместе настоящую партию.",
      cost: 100
    },
    {
      id: "icecream",
      emoji: "🍦",
      title: "Мороженое",
      note: "Сладкая награда за старание.",
      cost: 150
    },
    {
      id: "set",
      emoji: "🏆",
      title: "Свой шахматный набор",
      note: "Большая цель для юного гроссмейстера.",
      cost: 250
    }
  ];

  const LEVELS = [
    { min: 0, name: "Новичок" },
    { min: 30, name: "Ученик" },
    { min: 80, name: "Знаток" },
    { min: 150, name: "Юный гроссмейстер" },
    { min: 250, name: "Мастер" },
    { min: 380, name: "Гроссмейстер" },
    { min: 600, name: "Легенда шахмат" }
  ];

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  const els = {
    header: $("#siteHeader"),
    headerPoints: $("#headerPoints"),
    headerPointsWord: $("#headerPointsWord"),
    headerPointsPill: $("#headerPointsPill"),
    board: $("#board"),
    boardEffects: $("#boardEffects"),
    boardPuzzleLabel: $("#boardPuzzleLabel"),
    pieceTabs: $("#pieceTabs"),
    puzzleNav: $("#puzzleNav"),
    puzzleCard: $("#puzzleCard"),
    puzzleKicker: $("#puzzleKicker"),
    puzzleTitle: $("#puzzleTitle"),
    puzzleTip: $("#puzzleTip"),
    puzzlePar: $("#puzzlePar"),
    movesStat: $("#movesStat"),
    starsStat: $("#starsStat"),
    bonusStat: $("#bonusStat"),
    ratingStat: $("#ratingStat"),
    puzzleMessage: $("#puzzleMessage"),
    puzzleActions: $("#puzzleActions"),
    levelName: $("#levelName"),
    levelFill: $("#levelFill"),
    levelTrack: $("#levelTrack"),
    levelNote: $("#levelNote"),
    panelPoints: $("#panelPoints"),
    solvedCount: $("#solvedCount"),
    totalStars: $("#totalStars"),
    claimedCount: $("#claimedCount"),
    rewardPoints: $("#rewardPoints"),
    rewardPointsWord: $("#rewardPointsWord"),
    rewardsGrid: $("#rewardsGrid"),
    restartBtn: $("#restartBtn"),
    hintBtn: $("#hintBtn"),
    heroTaskCount: $("#heroTaskCount"),
    heroTaskWord: $("#heroTaskWord"),
    resetProgressBtn: $("#resetProgress"),
    modal: $("#modal"),
    modalCard: $("#modalCard"),
    toast: $("#toast"),
    footerYear: $("#footerYear")
  };

  let progress = loadProgress();

  const state = {
    pieceId: "pawn",
    puzzleIndex: 0,
    game: null,
    selected: null,
    legal: [],
    hint: null,
    message: CORRECT_MESSAGE,
    messageKind: "",
    focusSquare: null,
    lastPoints: null
  };

  let toastTimer = null;

  /* ------------------------------------------------------------------ */
  /*  Данные и прогресс                                                 */
  /* ------------------------------------------------------------------ */

  function defaultProgress() {
    return {
      points: 0,
      earned: 0,
      solved: {},
      rewards: [],
      bonusPieces: [],
      lastPuzzleId: null
    };
  }

  function loadProgress() {
    const base = defaultProgress();
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return base;
      const saved = JSON.parse(raw);
      if (!saved || typeof saved !== "object") return base;
      return {
        ...base,
        ...saved,
        points: Number.isFinite(saved.points) ? saved.points : 0,
        earned: Number.isFinite(saved.earned) ? saved.earned : 0,
        solved: migrateSolved(saved.solved),
        rewards: Array.isArray(saved.rewards) ? saved.rewards : [],
        bonusPieces: Array.isArray(saved.bonusPieces) ? saved.bonusPieces : [],
        lastPuzzleId: typeof saved.lastPuzzleId === "string" ? saved.lastPuzzleId : null
      };
    } catch {
      return base;
    }
  }

  function migrateSolved(rawSolved) {
    if (!rawSolved || typeof rawSolved !== "object") return {};
    const byId = new Map(CHESS_PUZZLES.map((puzzle) => [puzzle.id, puzzle]));
    const solved = {};
    Object.entries(rawSolved).forEach(([id, record]) => {
      if (!record || typeof record !== "object") return;
      const puzzle = byId.get(id);
      const moves = Number.isFinite(record.moves) ? record.moves : puzzle ? puzzle.par : 1;
      let stars = Number(record.stars);
      if (!Number.isFinite(stars) || stars < 1 || stars > MAX_STARS) {
        if (record.perfect) {
          stars = 3;
        } else if (puzzle && moves > puzzle.par + 1) {
          stars = 1;
        } else {
          stars = 2;
        }
      }
      solved[id] = {
        moves,
        stars: Math.max(1, Math.min(MAX_STARS, Math.round(stars))),
        hints: Number.isFinite(record.hints) ? Math.max(0, Math.round(record.hints)) : 0,
        perfect: Boolean(record.perfect) || stars >= MAX_STARS,
        at: Number.isFinite(record.at) ? record.at : 0
      };
    });
    return solved;
  }

  function saveProgress() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
      /* Игра продолжает работать, даже если браузер запретил сохранение. */
    }
  }

  function puzzlesFor(pieceId) {
    return CHESS_PUZZLES.filter((puzzle) => puzzle.piece === pieceId);
  }

  function pieceInfo(pieceId) {
    return CHESS_PIECES.find((piece) => piece.id === pieceId) || CHESS_PIECES[0];
  }

  function currentPuzzle() {
    return puzzlesFor(state.pieceId)[state.puzzleIndex];
  }

  function plural(number, forms) {
    const abs = Math.abs(number) % 100;
    const last = abs % 10;
    if (abs > 10 && abs < 20) return forms[2];
    if (last === 1) return forms[0];
    if (last >= 2 && last <= 4) return forms[1];
    return forms[2];
  }

  function solvedCount() {
    return Object.keys(progress.solved).length;
  }

  function totalStars() {
    return Object.values(progress.solved).reduce(
      (sum, record) => sum + (Number.isFinite(record.stars) ? record.stars : 0),
      0
    );
  }

  function maxMovesFor(puzzle) {
    return puzzle.par + (puzzle.boss ? BOSS_EXTRA_MOVES : EXTRA_MOVES);
  }

  function starRating(puzzle, moves, hints) {
    if (moves <= puzzle.par) return hints === 0 ? 3 : 2;
    if (moves <= puzzle.par + 1 && hints === 0) return 2;
    return 1;
  }

  function bestStarsFor(puzzle) {
    const record = progress.solved[puzzle.id];
    return record && Number.isFinite(record.stars) ? record.stars : 0;
  }

  function allPieceSolved(pieceId) {
    return puzzlesFor(pieceId).every((puzzle) => Boolean(progress.solved[puzzle.id]));
  }

  function levelFor(earned) {
    let index = 0;
    LEVELS.forEach((level, i) => {
      if (earned >= level.min) index = i;
    });
    const level = LEVELS[index];
    const next = LEVELS[index + 1] || null;
    if (!next) {
      return {
        name: level.name,
        pct: 100,
        nextName: null,
        remaining: 0
      };
    }
    const span = next.min - level.min;
    const pct = Math.min(100, Math.max(0, ((earned - level.min) / span) * 100));
    return {
      name: level.name,
      pct,
      nextName: next.name,
      remaining: Math.max(0, next.min - earned)
    };
  }

  /* ------------------------------------------------------------------ */
  /*  Шахматная геометрия                                               */
  /* ------------------------------------------------------------------ */

  function squareToXY(square) {
    return {
      x: FILES.indexOf(square[0]),
      y: Number(square[1]) - 1
    };
  }

  function xyToSquare(x, y) {
    return FILES[x] + String(y + 1);
  }

  function inBoard(x, y) {
    return x >= 0 && x < 8 && y >= 0 && y < 8;
  }

  function getLegalMoves(pos, game, pieceId) {
    const { x, y } = squareToXY(pos);
    const stars = new Set(game.stars);
    const guards = new Set(game.guards);
    const rocks = new Set(game.rocks);
    const moves = [];

    const addMove = (nx, ny, diagonalOnly = false) => {
      if (!inBoard(nx, ny)) return false;
      const to = xyToSquare(nx, ny);
      if (rocks.has(to)) return false;
      const capture = guards.has(to);
      if (diagonalOnly && !capture) return false;
      moves.push({ to, capture });
      return true;
    };

    if (pieceId === "pawn") {
      if (inBoard(x, y + 1)) {
        const one = xyToSquare(x, y + 1);
        if (!rocks.has(one) && !guards.has(one)) {
          moves.push({ to: one, capture: false });
          if (y === 1) {
            const two = xyToSquare(x, y + 2);
            if (!rocks.has(two) && !guards.has(two)) {
              moves.push({ to: two, capture: false });
            }
          }
        }
      }
      addMove(x - 1, y + 1, true);
      addMove(x + 1, y + 1, true);
      return moves;
    }

    if (pieceId === "knight") {
      const jumps = [
        [2, 1],
        [2, -1],
        [-2, 1],
        [-2, -1],
        [1, 2],
        [1, -2],
        [-1, 2],
        [-1, -2]
      ];
      jumps.forEach(([dx, dy]) => addMove(x + dx, y + dy));
      return moves;
    }

    const directions = [];
    if (pieceId === "bishop" || pieceId === "queen") {
      directions.push([1, 1], [1, -1], [-1, 1], [-1, -1]);
    }
    if (pieceId === "rook" || pieceId === "queen") {
      directions.push([1, 0], [-1, 0], [0, 1], [0, -1]);
    }

    directions.forEach(([dx, dy]) => {
      let nx = x + dx;
      let ny = y + dy;
      while (inBoard(nx, ny)) {
        const to = xyToSquare(nx, ny);
        if (rocks.has(to)) break;
        if (guards.has(to)) {
          moves.push({ to, capture: true });
          break;
        }
        moves.push({ to, capture: false });
        nx += dx;
        ny += dy;
      }
    });

    return moves;
  }

  function findHintPath(game, puzzle) {
    const start = {
      pos: game.pos,
      stars: [...game.stars].sort(),
      guards: [...game.guards].sort()
    };
    const key = (node) => `${node.pos}|${node.stars.join(",")}|${node.guards.join(",")}`;
    const queue = [start];
    const seen = new Set([key(start)]);
    const parent = new Map();

    while (queue.length) {
      const current = queue.shift();

      if (current.pos === puzzle.target && current.stars.length === 0) {
        const path = [];
        let node = current;
        while (true) {
          const previous = parent.get(key(node));
          if (!previous) break;
          path.push(node.pos);
          node = previous;
        }
        path.reverse();
        return path;
      }

      const pseudoGame = {
        stars: current.stars,
        guards: current.guards,
        rocks: puzzle.rocks
      };

      getLegalMoves(current.pos, pseudoGame, puzzle.piece).forEach((move) => {
        const next = {
          pos: move.to,
          stars: current.stars.filter((star) => star !== move.to),
          guards: current.guards.filter((guard) => guard !== move.to)
        };
        const nextKey = key(next);
        if (seen.has(nextKey)) return;
        seen.add(nextKey);
        parent.set(nextKey, current);
        queue.push(next);
      });
    }

    return null;
  }

  /* ------------------------------------------------------------------ */
  /*  Игра                                                              */
  /* ------------------------------------------------------------------ */

  function startGame() {
    const puzzle = currentPuzzle();
    state.game = {
      pos: puzzle.start,
      stars: [...puzzle.stars],
      guards: [...puzzle.guards],
      rocks: [...puzzle.rocks],
      moves: 0,
      hints: 0,
      status: "playing",
      scored: false,
      lastFrom: null,
      lastTo: null
    };
    state.selected = null;
    state.legal = [];
    state.hint = null;
    state.focusSquare = puzzle.start;
    setMessage(CORRECT_MESSAGE, "");
    progress.lastPuzzleId = puzzle.id;
    saveProgress();
  }

  function setMessage(text, kind = "") {
    state.message = text;
    state.messageKind = kind;
  }

  function focusBoardSquare(square) {
    const cell = els.board.querySelector(`[data-square="${square}"]`);
    if (cell) cell.focus({ preventScroll: true });
  }

  function selectPiece(pieceId) {
    if (state.pieceId === pieceId) return;
    state.pieceId = pieceId;
    const list = puzzlesFor(pieceId);
    let index = list.findIndex((puzzle) => !progress.solved[puzzle.id]);
    if (index < 0) index = 0;
    state.puzzleIndex = index;
    startGame();
    renderAll();
    focusBoardSquare(state.game.pos);
  }

  function selectPuzzle(index) {
    const list = puzzlesFor(state.pieceId);
    if (!list[index]) return;
    if (index === state.puzzleIndex && state.game && state.game.status === "playing") return;
    state.puzzleIndex = index;
    startGame();
    renderAll();
    focusBoardSquare(state.game.pos);
  }

  function restartGame() {
    startGame();
    setMessage("Заново! Попробуй другой маршрут.", "");
    renderAll();
    focusBoardSquare(state.game.pos);
  }

  function useHint() {
    if (!state.game || state.game.status !== "playing") {
      showToast("Сначала начни задание заново.", "warn");
      return;
    }

    const puzzle = currentPuzzle();
    const path = findHintPath(state.game, puzzle);

    if (!path || path.length === 0) {
      setMessage("Кажется, путь закрыт. Нажми «Заново» и попробуй другой маршрут.", "warn");
      renderPanel();
      return;
    }

    state.hint = path[0];
    state.game.hints += 1;
    state.selected = null;
    state.legal = [];
    const next = path[0];
    const guardThere = state.game.guards.includes(next);
    const starThere = state.game.stars.includes(next);
    let extra = "";
    if (starThere && guardThere) extra = " Там звезда и страж.";
    else if (starThere) extra = " Там звезда.";
    else if (guardThere) extra = " Там страж.";
    setMessage(`Подсказка: сходи на клетку ${next}.${extra}`, "hint");
    renderBoard();
    renderPanel();
  }

  function handleSquareClick(square) {
    if (!state.game || state.game.status !== "playing") return;
    state.focusSquare = square;

    if (state.selected === null) {
      if (square === state.game.pos) {
        state.selected = square;
        setMessage("Отлично! Теперь выбери клетку с жёлтой точкой.", "");
        renderBoard();
        renderPanel();
        focusBoardSquare(square);
      } else {
        setMessage("Сначала нажми на свою фигуру — она стоит на доске.", "warn");
        renderPanel();
      }
      return;
    }

    if (square === state.selected) {
      state.selected = null;
      state.legal = [];
      setMessage("Хорошо, выбирай фигуру снова.", "");
      renderBoard();
      renderPanel();
      focusBoardSquare(square);
      return;
    }

    const move = state.legal.find((item) => item.to === square);
    if (move) {
      makeMove(move);
      return;
    }

    if (square === state.game.pos) {
      state.selected = square;
      setMessage("Это твоя фигура. Выбери подсвеченную клетку.", "");
      renderBoard();
      renderPanel();
      focusBoardSquare(square);
      return;
    }

    const cell = els.board.querySelector(`[data-square="${square}"]`);
    if (cell) {
      cell.classList.remove("shake");
      void cell.offsetWidth;
      cell.classList.add("shake");
    }
    setMessage(invalidMoveMessage(state.pieceId), "warn");
    renderPanel();
  }

  function invalidMoveMessage(pieceId) {
    switch (pieceId) {
      case "pawn":
        return "Пешка ходит прямо, а бьёт только по диагонали. Выбери клетку с точкой.";
      case "knight":
        return "Конь ходит буквой «Г»: две клетки в одну сторону и одна в другую.";
      case "bishop":
        return "Слон ходит только по диагонали и не перепрыгивает камни.";
      case "rook":
        return "Ладья ходит по прямым линиям — горизонтали и вертикали.";
      case "queen":
        return "Ферзь ходит прямо и по диагонали. Ему доступны линии ладьи и слона.";
      default:
        return "Так эта фигура не ходит. Посмотри на клетки с точками.";
    }
  }

  function makeMove(move) {
    const game = state.game;
    const puzzle = currentPuzzle();
    const from = game.pos;
    const to = move.to;
    const hadStar = game.stars.includes(to);
    const hadGuard = game.guards.includes(to);

    game.stars = game.stars.filter((square) => square !== to);
    game.guards = game.guards.filter((square) => square !== to);
    game.pos = to;
    game.moves += 1;
    game.lastFrom = from;
    game.lastTo = to;

    state.selected = null;
    state.legal = [];
    state.hint = null;
    state.focusSquare = to;

    if (hadStar) addEffect(to, "★ +1", "star");
    if (hadGuard) addEffect(to, "Страж!", "capture");

    const maxMoves = maxMovesFor(puzzle);
    if (game.pos === puzzle.target && game.stars.length === 0) {
      game.status = "won";
      setMessage("Замок взят! Задание решено.", "success");
    } else if (game.moves >= maxMoves) {
      game.status = "out";
      setMessage(
        `Ходы закончились (${maxMoves}). Не страшно — нажми «Заново» и попробуй другой путь.`,
        "warn"
      );
    } else if (hadStar && hadGuard) {
      setMessage(`Звезда собрана, страж побеждён! Осталось звёзд: ${game.stars.length}.`, "success");
    } else if (hadStar) {
      setMessage(
        game.stars.length === 0
          ? "Все звёзды собраны! Теперь — в замок."
          : `Звезда собрана! Осталось звёзд: ${game.stars.length}.`,
        "success"
      );
    } else if (hadGuard) {
      setMessage("Страж побеждён! Продолжай путь.", "success");
    } else if (game.stars.length === 0) {
      setMessage("Все звёзды собраны! Теперь вставай на замок.", "success");
    } else {
      setMessage("Хороший ход! Продолжай.", "");
    }

    renderBoard();
    renderPanel();

    if (game.status === "won") {
      handleWin();
    } else {
      renderProgress();
    }

    focusBoardSquare(game.pos);
  }

  function handleWin() {
    const game = state.game;
    const puzzle = currentPuzzle();
    if (game.scored) return;
    game.scored = true;

    const previousRecord = progress.solved[puzzle.id];
    const isNew = !previousRecord;
    const perfect = game.moves <= puzzle.par;
    const stars = starRating(puzzle, game.moves, game.hints);
    const boss = Boolean(puzzle.boss);
    let earned = 0;
    let pieceBonus = false;
    let improved = false;
    let bestStars = stars;

    if (isNew) {
      earned = 10;
      if (perfect) earned += 5;
      if (boss) earned += 5;

      progress.solved[puzzle.id] = {
        moves: game.moves,
        stars,
        hints: game.hints,
        perfect,
        at: Date.now()
      };

      if (allPieceSolved(puzzle.piece) && !progress.bonusPieces.includes(puzzle.piece)) {
        progress.bonusPieces.push(puzzle.piece);
        earned += 10;
        pieceBonus = true;
      }

      progress.points += earned;
      progress.earned += earned;
      saveProgress();
    } else {
      const previousStars = Number.isFinite(previousRecord.stars) ? previousRecord.stars : 1;
      bestStars = Math.max(previousStars, stars);
      improved = game.moves < previousRecord.moves || bestStars > previousStars;
      if (improved) {
        previousRecord.moves = Math.min(previousRecord.moves, game.moves);
        previousRecord.stars = bestStars;
        if (stars > previousStars) previousRecord.hints = game.hints;
        previousRecord.perfect = previousRecord.perfect || perfect;
        saveProgress();
      }
    }

    setMessage(
      isNew
        ? `Задание решено! +${earned} ${plural(earned, ["балл", "балла", "баллов"])}.`
        : improved
          ? "Новый рекорд! Оценка сохранена."
          : "Задание уже было решено. Рекорд сохранён!",
      "success"
    );

    renderPoints(true);
    renderProgress();
    renderPieceTabs();
    renderPuzzleNav();
    renderPanel();
    renderRewards();

    showWinModal({
      isNew,
      earned,
      perfect,
      pieceBonus,
      improved,
      moves: game.moves,
      stars,
      bestStars,
      boss,
      puzzle
    });
  }

  /* ------------------------------------------------------------------ */
  /*  Отрисовка                                                         */
  /* ------------------------------------------------------------------ */

  function renderAll() {
    renderPoints(false);
    renderProgress();
    renderPieceTabs();
    renderPuzzleNav();
    renderBoard();
    renderPanel();
    renderRewards();
  }

  function renderPoints(animate) {
    const points = progress.points;
    els.headerPoints.textContent = String(points);
    els.headerPointsWord.textContent = plural(points, ["балл", "балла", "баллов"]);
    els.panelPoints.textContent = String(points);
    const panelWord = els.panelPoints.nextElementSibling;
    if (panelWord) panelWord.textContent = plural(points, ["балл", "балла", "баллов"]);
    els.rewardPoints.textContent = String(points);
    els.rewardPointsWord.textContent = plural(points, ["балл", "балла", "баллов"]);

    if (animate && state.lastPoints !== null && points !== state.lastPoints) {
      els.headerPointsPill.classList.remove("is-bump");
      const panelPoints = els.panelPoints.parentElement;
      if (panelPoints) panelPoints.classList.remove("is-bump");
      void els.headerPointsPill.offsetWidth;
      els.headerPointsPill.classList.add("is-bump");
      if (panelPoints) panelPoints.classList.add("is-bump");
    }
    state.lastPoints = points;
  }

  function renderProgress() {
    const level = levelFor(progress.earned);
    els.levelName.textContent = level.name;
    els.levelFill.style.width = `${level.pct}%`;
    els.levelTrack.setAttribute("aria-valuenow", String(Math.round(level.pct)));
    els.levelNote.textContent = level.nextName
      ? `До уровня «${level.nextName}» — ${level.remaining} ${plural(level.remaining, [
          "балл",
          "балла",
          "баллов"
        ])}`
      : "Это высший уровень. Так держать!";
    els.solvedCount.textContent = `${solvedCount()} из ${CHESS_PUZZLES.length}`;
    if (els.totalStars) els.totalStars.textContent = String(totalStars());
    els.claimedCount.textContent = String(progress.rewards.length);
  }

  function renderPieceTabs() {
    els.pieceTabs.innerHTML = CHESS_PIECES.map((piece) => {
      const list = puzzlesFor(piece.id);
      const done = list.filter((puzzle) => progress.solved[puzzle.id]).length;
      const active = piece.id === state.pieceId;
      return `
        <button type="button" class="piece-tab${active ? " is-active" : ""}"
          data-piece="${piece.id}" role="tab" aria-selected="${active}"
          aria-label="${piece.name}, решено ${done} из ${list.length}">
          <span class="piece-tab-glyph" aria-hidden="true">${piece.glyph}</span>
          <span class="piece-tab-name">${piece.name}</span>
          <span class="piece-tab-count">${done}/${list.length}</span>
        </button>`;
    }).join("");
  }

  function renderPuzzleNav() {
    const list = puzzlesFor(state.pieceId);
    els.puzzleNav.innerHTML = list.map((puzzle, index) => {
      const record = progress.solved[puzzle.id];
      const solved = Boolean(record);
      const active = index === state.puzzleIndex;
      const boss = Boolean(puzzle.boss);
      const stars = record && Number.isFinite(record.stars) ? record.stars : 0;
      return `
        <button type="button" class="puzzle-dot${solved ? " is-solved" : ""}${active ? " is-active" : ""}${
          boss ? " is-boss" : ""
        }"
          data-puzzle="${index}" aria-label="${boss ? "Босс, " : ""}задание ${index + 1}: ${puzzle.title}${
            solved ? `, решено, ${stars} из 3 звёзд` : ""
          }"
          aria-current="${active ? "true" : "false"}">
          ${solved ? "✓" : index + 1}
          ${boss ? '<span class="dot-crown" aria-hidden="true">👑</span>' : ""}
        </button>`;
    }).join("");
  }

  function renderBoard() {
    const puzzle = currentPuzzle();
    const game = state.game;
    const piece = pieceInfo(puzzle.piece);

    state.legal = state.selected
      ? getLegalMoves(game.pos, game, puzzle.piece)
      : [];
    const legalMap = new Map(state.legal.map((move) => [move.to, move]));

    let html = "";

    for (let rank = 7; rank >= 0; rank -= 1) {
      for (let file = 0; file < 8; file += 1) {
        const square = xyToSquare(file, rank);
        const isLight = (file + rank) % 2 === 1;
        const classes = ["cell", isLight ? "light" : "dark"];
        const legal = legalMap.get(square);

        if (state.selected === square) classes.push("is-selected");
        if (legal) {
          classes.push("is-legal");
          if (legal.capture) classes.push("is-capture");
        }
        if (state.hint === square) classes.push("is-hint");
        if (puzzle.target === square) classes.push("is-target");
        if (game.lastFrom === square || game.lastTo === square) classes.push("is-last");

        let content = "";
        if (puzzle.target === square) {
          content += '<span class="target-mark" aria-hidden="true">🏰</span>';
        }
        if (game.rocks.includes(square)) {
          content += '<span class="rock" aria-hidden="true">🪨</span>';
        }
        if (game.guards.includes(square)) {
          content += '<span class="guard" aria-hidden="true">♟</span>';
        }
        if (game.stars.includes(square)) {
          content += '<span class="star-badge" aria-hidden="true">★</span>';
        }
        if (game.pos === square) {
          content += `<span class="piece" aria-hidden="true">${piece.glyph}</span>`;
        }

        if (rank === 0) {
          content += `<span class="coord coord-file" aria-hidden="true">${FILES[file]}</span>`;
        }
        if (file === 0) {
          content += `<span class="coord coord-rank" aria-hidden="true">${rank + 1}</span>`;
        }

        const label = [];
        if (file === 0) label.push(`ряд ${rank + 1}`);
        label.push(`клетка ${square}`);
        if (puzzle.target === square) label.push("замок, цель");
        if (game.stars.includes(square)) label.push("звезда");
        if (game.guards.includes(square)) label.push("страж");
        if (game.rocks.includes(square)) label.push("камень");
        if (game.pos === square) label.push("твоя фигура");
        if (legal) label.push(legal.capture ? "можно взять стража" : "можно сходить");

        const tabIndex = state.focusSquare === square ? 0 : -1;
        html += `<button type="button" class="${classes.join(" ")}" data-square="${square}"
          tabindex="${tabIndex}" aria-label="${label.join(", ")}">${content}</button>`;
      }
    }

    els.board.innerHTML = html;

    els.boardPuzzleLabel.textContent = `${piece.name} · задание ${state.puzzleIndex + 1}`;
  }

  function renderPanel() {
    const puzzle = currentPuzzle();
    const game = state.game;
    const piece = pieceInfo(puzzle.piece);
    const maxMoves = maxMovesFor(puzzle);
    const collected = puzzle.stars.length - game.stars.length;
    const bestStars = bestStarsFor(puzzle);
    const rating = bestStars
      ? `${"★".repeat(bestStars)}${"☆".repeat(MAX_STARS - bestStars)}`
      : "—";

    if (els.puzzleCard) els.puzzleCard.classList.toggle("is-boss", Boolean(puzzle.boss));
    els.puzzleKicker.textContent = puzzle.boss
      ? `${piece.name} · босс`
      : `${piece.name} · задание ${state.puzzleIndex + 1}`;
    els.puzzleTitle.textContent = puzzle.title;
    els.puzzleTip.textContent = puzzle.tip;
    els.puzzlePar.textContent = `${puzzle.par} ${plural(puzzle.par, ["ход", "хода", "ходов"])}`;
    els.movesStat.textContent = `${game.moves} / ${maxMoves}`;
    els.starsStat.textContent = `${collected} / ${puzzle.stars.length}`;
    els.bonusStat.textContent = game.moves <= puzzle.par ? "+5" : "—";
    if (els.ratingStat) {
      els.ratingStat.textContent = rating;
      els.ratingStat.setAttribute(
        "aria-label",
        bestStars ? `Лучшая оценка: ${bestStars} из 3 звёзд` : "Оценка появится после победы"
      );
    }

    els.puzzleMessage.textContent = state.message;
    els.puzzleMessage.className = `puzzle-message${state.messageKind ? ` is-${state.messageKind}` : ""}`;

    if (game.status === "won") {
      const next = findNextPuzzle();
      els.puzzleActions.innerHTML = `
        <button type="button" class="btn btn-primary btn-block" data-panel-action="${
          next ? "next" : "rewards"
        }">${next ? "Следующее задание →" : "К наградам →"}</button>
        <button type="button" class="btn btn-ghost btn-block" data-panel-action="restart">Пройти ещё раз</button>`;
    } else if (game.status === "out") {
      els.puzzleActions.innerHTML =
        '<button type="button" class="btn btn-primary btn-block" data-panel-action="restart">Попробовать снова</button>';
    } else {
      els.puzzleActions.innerHTML = "";
    }
  }

  function renderRewards() {
    els.rewardsGrid.innerHTML = REWARDS.map((reward) => {
      const claimed = progress.rewards.includes(reward.id);
      const short = !claimed && progress.points < reward.cost;
      return `
        <article class="reward-card${claimed ? " is-claimed" : ""}">
          <div class="reward-icon" aria-hidden="true">${reward.emoji}</div>
          <h3>${reward.title}</h3>
          <p>${reward.note}</p>
          <div class="reward-footer">
            <span class="reward-cost${short ? " is-short" : ""}">★ ${reward.cost}</span>
            <button type="button" class="btn ${claimed ? "btn-ghost" : "btn-primary"}"
              data-reward="${reward.id}" ${claimed ? "disabled" : ""}>
              ${claimed ? "Получено ✓" : "Обменять"}
            </button>
          </div>
        </article>`;
    }).join("");
  }

  function addEffect(square, text, kind) {
    const { x, y } = squareToXY(square);
    const effect = document.createElement("span");
    effect.className = `effect${kind === "capture" ? " is-capture" : ""}`;
    effect.textContent = text;
    effect.style.left = `${((x + 0.5) / 8) * 100}%`;
    effect.style.top = `${((7 - y + 0.5) / 8) * 100}%`;
    els.boardEffects.appendChild(effect);
    effect.addEventListener("animationend", () => effect.remove(), { once: true });
    window.setTimeout(() => effect.remove(), 1500);
  }

  /* ------------------------------------------------------------------ */
  /*  Модальные окна, награды и переходы                                */
  /* ------------------------------------------------------------------ */

  function openModal(html, options = {}) {
    els.modalCard.innerHTML = html;
    if (!els.modal.open) {
      els.modal.showModal();
    }
    if (options.confetti) spawnConfetti();
    const primary = els.modalCard.querySelector(".btn-primary, .btn-danger");
    if (primary) {
      window.requestAnimationFrame(() => primary.focus({ preventScroll: true }));
    }
  }

  function spawnConfetti() {
    const layer = $(".confetti", els.modalCard);
    if (!layer) return;
    const colors = ["#FF8A3D", "#FFC93C", "#2FAE7E", "#6C5CE7", "#E25C8A", "#2F80ED"];
    for (let i = 0; i < 28; i += 1) {
      const bit = document.createElement("span");
      bit.style.left = `${Math.random() * 100}%`;
      bit.style.background = colors[i % colors.length];
      bit.style.setProperty("--drift", `${Math.random() * 180 - 90}px`);
      bit.style.setProperty("--spin", `${Math.random() * 720 - 360}deg`);
      bit.style.animationDelay = `${Math.random() * 0.35}s`;
      bit.style.animationDuration = `${1.35 + Math.random() * 0.7}s`;
      layer.appendChild(bit);
    }
  }

  function showWinModal(result) {
    const puzzle = result.puzzle;
    const piece = pieceInfo(puzzle.piece);
    const next = findNextPuzzle();
    const breakdown = [];

    if (result.isNew) {
      breakdown.push(["Задание решено", "+10"]);
      if (result.perfect) breakdown.push([`Без лишних ходов (${puzzle.par})`, "+5"]);
      if (result.boss) breakdown.push(["Победа над боссом", "+5"]);
      if (result.pieceBonus) breakdown.push(["Все задания фигуры", "+10"]);
    }

    const subtitle = result.isNew
      ? "Баллы уже на счету. Продолжай собирать звёзды!"
      : result.improved
        ? `Новый рекорд: ${result.moves} ${plural(result.moves, ["ход", "хода", "ходов"])}! Баллы за это задание уже начислены раньше.`
        : "Это задание уже было решено. Баллы не начисляются, но ты можешь улучшить рекорд.";

    const rating = result.bestStars || result.stars;
    const starsHtml = `<div class="win-stars" aria-label="Оценка: ${rating} из 3">${"★".repeat(
      rating
    )}${"☆".repeat(MAX_STARS - rating)}</div>`;
    const starsNote =
      rating >= 3
        ? "Три звезды! Без подсказок и лишних ходов."
        : rating === 2
          ? "Две звезды. Ещё немного — и будет три!"
          : "Звезда за победу. Попробуй пройти короче!";

    const score =
      result.isNew
        ? `<div class="win-score"><span aria-hidden="true">★</span> +${result.earned}</div>`
        : `<div class="win-replay">Рекорд: ${result.moves} ${plural(result.moves, ["ход", "хода", "ходов"])}</div>`;

    const breakdownHtml = breakdown.length
      ? `<ul class="win-breakdown">${breakdown
          .map(([label, value]) => `<li><span>${label}</span><strong>${value}</strong></li>`)
          .join("")}</ul>`
      : "";

    openModal(
      `
      <div class="confetti" aria-hidden="true"></div>
      <div class="modal-emoji" aria-hidden="true">${result.isNew ? "🏆" : "⭐"}</div>
      <p class="modal-kicker">${piece.name} · ${puzzle.title}</p>
      <h2 class="modal-title" id="modalTitle">${result.isNew ? "Победа!" : "Отличный ход!"}</h2>
      <p class="modal-subtitle">${subtitle}</p>
      ${starsHtml}
      <p class="win-stars-note">${starsNote}</p>
      ${score}
      ${breakdownHtml}
      <div class="modal-actions">
        <button type="button" class="btn btn-primary" data-action="${next ? "next" : "rewards"}">
          ${next ? "Следующее задание →" : "К наградам →"}
        </button>
        <button type="button" class="btn btn-ghost" data-close>Остаться здесь</button>
      </div>
      `,
      { confetti: result.isNew }
    );
  }

  function findNextPuzzle() {
    const currentList = puzzlesFor(state.pieceId);

    for (let i = state.puzzleIndex + 1; i < currentList.length; i += 1) {
      if (!progress.solved[currentList[i].id]) {
        return { pieceId: state.pieceId, index: i };
      }
    }

    for (let i = 0; i < currentList.length; i += 1) {
      if (!progress.solved[currentList[i].id]) {
        return { pieceId: state.pieceId, index: i };
      }
    }

    const order = CHESS_PIECES.map((piece) => piece.id);
    const start = order.indexOf(state.pieceId);

    for (let step = 1; step < order.length; step += 1) {
      const pieceId = order[(start + step) % order.length];
      const list = puzzlesFor(pieceId);
      for (let i = 0; i < list.length; i += 1) {
        if (!progress.solved[list[i].id]) {
          return { pieceId, index: i };
        }
      }
    }

    return null;
  }

  function goNextPuzzle() {
    const next = findNextPuzzle();
    if (!next) {
      document.getElementById("rewards").scrollIntoView({ behavior: "smooth", block: "start" });
      showToast("Все задания решены! Выбирай награду ★", "success");
      return;
    }

    state.pieceId = next.pieceId;
    state.puzzleIndex = next.index;
    startGame();
    renderAll();
    focusBoardSquare(state.game.pos);

    if (window.matchMedia("(max-width: 940px)").matches) {
      document.getElementById("trainer").scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function confirmReward(rewardId) {
    const reward = REWARDS.find((item) => item.id === rewardId);
    if (!reward || progress.rewards.includes(reward.id)) return;

    if (progress.points < reward.cost) {
      const missing = reward.cost - progress.points;
      showToast(
        `Нужно ещё ${missing} ${plural(missing, ["балл", "балла", "баллов"])}. Реши ещё одно задание!`,
        "warn"
      );
      return;
    }

    openModal(`
      <div class="modal-emoji" aria-hidden="true">🎁</div>
      <p class="modal-kicker">Магазин наград</p>
      <h2 class="modal-title" id="modalTitle">Обменять баллы?</h2>
      <p class="modal-subtitle">«${reward.title}» будет стоить ${reward.cost} ${plural(reward.cost, [
        "балл",
        "балла",
        "баллов"
      ])}. После обмена останется ${progress.points - reward.cost}.</p>
      <div class="modal-actions">
        <button type="button" class="btn btn-primary" data-action="claim-confirm" data-reward="${reward.id}">
          Да, обменять
        </button>
        <button type="button" class="btn btn-ghost" data-close>Пока нет</button>
      </div>
    `);
  }

  function claimReward(rewardId) {
    const reward = REWARDS.find((item) => item.id === rewardId);
    if (!reward || progress.rewards.includes(reward.id) || progress.points < reward.cost) return;

    progress.points -= reward.cost;
    progress.rewards.push(reward.id);
    saveProgress();
    renderAll();

    openModal(
      `
      <div class="confetti" aria-hidden="true"></div>
      <div class="modal-emoji" aria-hidden="true">🎉</div>
      <p class="modal-kicker">Награда получена</p>
      <h2 class="modal-title" id="modalTitle">${reward.title}</h2>
      <p class="modal-subtitle">Покажи этот экран родителям — и договоритесь, когда заберёшь награду. Осталось ${progress.points} ${plural(
        progress.points,
        ["балл", "балла", "баллов"]
      )}.</p>
      <div class="win-score"><span aria-hidden="true">★</span> −${reward.cost}</div>
      <div class="modal-actions">
        <button type="button" class="btn btn-primary" data-close>Ура!</button>
      </div>
      `,
      { confetti: true }
    );
  }

  function askReset() {
    openModal(`
      <div class="modal-emoji" aria-hidden="true">🧹</div>
      <p class="modal-kicker">Прогресс</p>
      <h2 class="modal-title" id="modalTitle">Сбросить всё?</h2>
      <p class="modal-subtitle">Баллы, решённые задания и полученные награды исчезнут. Это действие нельзя отменить.</p>
      <div class="modal-actions">
        <button type="button" class="btn btn-danger" data-action="reset-confirm">Да, сбросить</button>
        <button type="button" class="btn btn-ghost" data-close>Отмена</button>
      </div>
    `);
  }

  function resetProgress() {
    progress = defaultProgress();
    saveProgress();
    state.pieceId = "pawn";
    state.puzzleIndex = 0;
    state.lastPoints = null;
    startGame();
    renderAll();
    els.modal.close();
    focusBoardSquare(state.game.pos);
    showToast("Прогресс сброшен. Начинаем заново!", "success");
  }

  function showToast(text, kind = "") {
    window.clearTimeout(toastTimer);
    els.toast.textContent = text;
    els.toast.className = `toast is-visible${kind ? ` is-${kind}` : ""}`;
    toastTimer = window.setTimeout(() => {
      els.toast.className = "toast";
    }, 2800);
  }

  /* ------------------------------------------------------------------ */
  /*  События                                                           */
  /* ------------------------------------------------------------------ */

  function bindEvents() {
    els.board.addEventListener("click", (event) => {
      const cell = event.target.closest("button[data-square]");
      if (!cell) return;
      handleSquareClick(cell.dataset.square);
    });

    els.board.addEventListener("keydown", (event) => {
      const keys = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"];
      if (!keys.includes(event.key)) return;
      event.preventDefault();

      const { x, y } = squareToXY(state.focusSquare || state.game.pos);
      let nx = x;
      let ny = y;
      if (event.key === "ArrowLeft") nx = Math.max(0, x - 1);
      if (event.key === "ArrowRight") nx = Math.min(7, x + 1);
      if (event.key === "ArrowUp") ny = Math.min(7, y + 1);
      if (event.key === "ArrowDown") ny = Math.max(0, y - 1);

      state.focusSquare = xyToSquare(nx, ny);
      $$(".cell", els.board).forEach((cell) => {
        cell.tabIndex = cell.dataset.square === state.focusSquare ? 0 : -1;
      });
      const next = els.board.querySelector(`[data-square="${state.focusSquare}"]`);
      if (next) next.focus({ preventScroll: true });
    });

    els.restartBtn.addEventListener("click", restartGame);
    els.hintBtn.addEventListener("click", useHint);

    els.pieceTabs.addEventListener("click", (event) => {
      const button = event.target.closest("button[data-piece]");
      if (button) selectPiece(button.dataset.piece);
    });

    els.puzzleNav.addEventListener("click", (event) => {
      const button = event.target.closest("button[data-puzzle]");
      if (button) selectPuzzle(Number(button.dataset.puzzle));
    });

    els.puzzleActions.addEventListener("click", (event) => {
      const button = event.target.closest("button[data-panel-action]");
      if (!button) return;
      const action = button.dataset.panelAction;
      if (action === "restart") restartGame();
      if (action === "next") goNextPuzzle();
      if (action === "rewards") {
        document.getElementById("rewards").scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });

    els.rewardsGrid.addEventListener("click", (event) => {
      const button = event.target.closest("button[data-reward]");
      if (!button || button.disabled) return;
      confirmReward(button.dataset.reward);
    });

    els.resetProgressBtn.addEventListener("click", askReset);

    els.modalCard.addEventListener("click", (event) => {
      const button = event.target.closest("button");
      if (!button) return;

      if (button.hasAttribute("data-close")) {
        els.modal.close();
        return;
      }

      const action = button.dataset.action;
      if (action === "next") {
        els.modal.close();
        goNextPuzzle();
      } else if (action === "rewards") {
        els.modal.close();
        document.getElementById("rewards").scrollIntoView({ behavior: "smooth", block: "start" });
      } else if (action === "claim-confirm") {
        claimReward(button.dataset.reward);
      } else if (action === "reset-confirm") {
        resetProgress();
      }
    });

    els.modal.addEventListener("click", (event) => {
      if (event.target === els.modal) els.modal.close();
    });

    const onScroll = () => {
      els.header.classList.toggle("is-scrolled", window.scrollY > 8);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  function init() {
    const savedPuzzle = CHESS_PUZZLES.find((puzzle) => puzzle.id === progress.lastPuzzleId);
    if (savedPuzzle) {
      state.pieceId = savedPuzzle.piece;
      state.puzzleIndex = puzzlesFor(savedPuzzle.piece).findIndex(
        (puzzle) => puzzle.id === savedPuzzle.id
      );
      if (state.puzzleIndex < 0) state.puzzleIndex = 0;
    }

    const year = new Date().getFullYear();
    if (els.footerYear) els.footerYear.textContent = String(year);
    if (els.heroTaskCount) els.heroTaskCount.textContent = String(CHESS_PUZZLES.length);
    if (els.heroTaskWord) {
      els.heroTaskWord.textContent = plural(CHESS_PUZZLES.length, [
        "короткое задание",
        "коротких задания",
        "коротких заданий"
      ]);
    }
    els.solvedCount.textContent = `0 из ${CHESS_PUZZLES.length}`;

    bindEvents();
    startGame();
    renderAll();
  }

  init();
})();
