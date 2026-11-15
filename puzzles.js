/* Данные тренажёра. Ходы и решения проверены поиском в ширину (tools/validate_puzzles.py). */

const CHESS_PIECES = [
  {
    id: "pawn",
    name: "Пешка",
    glyph: "♟",
    motto: "Маленькая, но важная",
    color: "#6C5CE7"
  },
  {
    id: "knight",
    name: "Конь",
    glyph: "♞",
    motto: "Прыгает буквой «Г»",
    color: "#2F80ED"
  },
  {
    id: "bishop",
    name: "Слон",
    glyph: "♝",
    motto: "Только по диагонали",
    color: "#2FAE7E"
  },
  {
    id: "rook",
    name: "Ладья",
    glyph: "♜",
    motto: "Прямые линии",
    color: "#F2994A"
  },
  {
    id: "queen",
    name: "Ферзь",
    glyph: "♛",
    motto: "Самая сильная",
    color: "#E25C8A"
  }
];

const CHESS_PUZZLES = [
  {
    "id": "pawn-1",
    "piece": "pawn",
    "title": "Первый шаг",
    "start": "a2",
    "target": "a6",
    "stars": [
      "a4"
    ],
    "guards": [],
    "rocks": [],
    "par": 3,
    "tip": "Пешка ходит только вперёд. С поля старта можно шагнуть сразу на две клетки."
  },
  {
    "id": "pawn-2",
    "piece": "pawn",
    "title": "Поворот по диагонали",
    "start": "b2",
    "target": "c5",
    "stars": [
      "c3"
    ],
    "guards": [
      "c3"
    ],
    "rocks": [],
    "par": 3,
    "tip": "Пешка бьёт по диагонали. Только так она может сменить полосу."
  },
  {
    "id": "pawn-3",
    "piece": "pawn",
    "title": "Лесенка",
    "start": "e2",
    "target": "e6",
    "stars": [
      "d3",
      "e5"
    ],
    "guards": [
      "d3",
      "e5"
    ],
    "rocks": [],
    "par": 4,
    "tip": "Прямо, потом наискосок — и снова прямо. Собери обе звезды по дороге."
  },
  {
    "id": "pawn-4",
    "piece": "pawn",
    "title": "Смелый поход",
    "start": "a2",
    "target": "d6",
    "stars": [
      "b3",
      "c4",
      "d5"
    ],
    "guards": [
      "b3",
      "c4",
      "d5"
    ],
    "rocks": [],
    "par": 4,
    "tip": "Каждый страж — ступенька. Бей по диагонали и не забывай про звёзды."
  },
  {
    "id": "pawn-5",
    "piece": "pawn",
    "title": "Правый подъём",
    "start": "h4",
    "target": "f7",
    "stars": [
      "g5",
      "f6"
    ],
    "guards": [
      "g5",
      "f6"
    ],
    "rocks": [
      "c3",
      "h2"
    ],
    "par": 3,
    "tip": "Два взятия наискосок, а потом один шаг прямо — и ты в замке."
  },
  {
    "id": "pawn-6",
    "piece": "pawn",
    "title": "Зеркальная лестница",
    "start": "e2",
    "target": "b6",
    "stars": [
      "d3",
      "c4",
      "b5"
    ],
    "guards": [
      "d3",
      "c4",
      "b5"
    ],
    "rocks": [
      "g4",
      "h6"
    ],
    "par": 4,
    "tip": "Иди наискосок через стражей-ступеньки, а последний шаг сделай прямо."
  },
  {
    "id": "pawn-7",
    "piece": "pawn",
    "title": "Форсированный ход",
    "start": "e2",
    "target": "f5",
    "stars": [
      "f3",
      "f4"
    ],
    "guards": [
      "f3"
    ],
    "rocks": [
      "c5"
    ],
    "par": 3,
    "tip": "Первый шаг — наискосок, дальше пешка идёт прямо к замку."
  },
  {
    "id": "pawn-8",
    "piece": "pawn",
    "title": "Два поворота",
    "start": "b2",
    "target": "d5",
    "stars": [
      "c3",
      "d4"
    ],
    "guards": [
      "c3",
      "d4"
    ],
    "rocks": [
      "f2",
      "h3"
    ],
    "par": 3,
    "tip": "Каждый страж — это ступенька наискосок. Два взятия — и ты почти у цели."
  },
  {
    "id": "pawn-9",
    "piece": "pawn",
    "title": "Диагональный подъём",
    "start": "c3",
    "target": "f7",
    "stars": [
      "d4",
      "e5",
      "f6"
    ],
    "guards": [
      "d4",
      "e5",
      "f6"
    ],
    "rocks": [
      "a6",
      "h2"
    ],
    "par": 4,
    "tip": "Три взятия подряд ведут вверх наискосок. Последний шаг — прямо в замок."
  },
  {
    "id": "pawn-10",
    "piece": "pawn",
    "title": "Через две клетки",
    "start": "d2",
    "target": "f6",
    "stars": [
      "e3",
      "f4"
    ],
    "guards": [
      "e3",
      "f4"
    ],
    "rocks": [
      "b5",
      "h4"
    ],
    "par": 4,
    "tip": "Сначала собери звёзды по диагонали, потом шагай прямо до замка."
  },
  {
    "id": "pawn-11",
    "piece": "pawn",
    "title": "Лесенка со стражами",
    "start": "d3",
    "target": "d8",
    "stars": [
      "d6",
      "d7"
    ],
    "guards": [
      "c4",
      "d5"
    ],
    "rocks": [
      "b7"
    ],
    "par": 5,
    "tip": "Пешка бьёт только по диагонали. Сначала убери стражей, потом собирай звёзды."
  },
  {
    "id": "pawn-12",
    "piece": "pawn",
    "title": "Диагональ к замку",
    "start": "h3",
    "target": "f8",
    "stars": [
      "f6",
      "f7"
    ],
    "guards": [
      "f5",
      "g4"
    ],
    "rocks": [
      "h5"
    ],
    "par": 5,
    "tip": "Иногда пешке выгодно свернуть с прямой. Смотри, где стоят стражи."
  },
  {
    "id": "pawn-13",
    "piece": "pawn",
    "title": "Пешкин зигзаг",
    "start": "g2",
    "target": "g8",
    "stars": [
      "g6",
      "g7",
      "h4"
    ],
    "guards": [
      "g5",
      "h3"
    ],
    "rocks": [
      "b7",
      "d8",
      "f5"
    ],
    "par": 6,
    "tip": "Три звезды не стоят на одной линии. Найди безопасный порядок ходов."
  },
  {
    "id": "pawn-14",
    "piece": "pawn",
    "title": "Босс: последняя линия",
    "start": "c2",
    "target": "e8",
    "stars": [
      "d4",
      "e6",
      "e7"
    ],
    "guards": [
      "d3",
      "e5"
    ],
    "rocks": [
      "b7",
      "c1",
      "f4",
      "g8"
    ],
    "par": 6,
    "boss": true,
    "tip": "Босс ждёт на последней линии. Собери все звёзды и не забудь про стражей."
  },
  {
    "id": "knight-1",
    "piece": "knight",
    "title": "Прыжок за звездой",
    "start": "b1",
    "target": "d6",
    "stars": [
      "c3",
      "e4"
    ],
    "guards": [],
    "rocks": [
      "d4",
      "f3"
    ],
    "par": 3,
    "tip": "Конь ходит буквой «Г» и перепрыгивает через камни."
  },
  {
    "id": "knight-2",
    "piece": "knight",
    "title": "Через препятствия",
    "start": "g1",
    "target": "c5",
    "stars": [
      "e2",
      "c3"
    ],
    "guards": [
      "e4"
    ],
    "rocks": [
      "f4",
      "d3"
    ],
    "par": 4,
    "tip": "Страж на пути не помеха: конь прыгает и забирает его."
  },
  {
    "id": "knight-3",
    "piece": "knight",
    "title": "Длинный маршрут",
    "start": "a1",
    "target": "h4",
    "stars": [
      "c2",
      "d4",
      "f5"
    ],
    "guards": [],
    "rocks": [
      "b3",
      "e3"
    ],
    "par": 4,
    "tip": "Считай клетки: две в одну сторону и одна в другую."
  },
  {
    "id": "knight-4",
    "piece": "knight",
    "title": "Обратный путь",
    "start": "h8",
    "target": "e5",
    "stars": [
      "f7",
      "h6",
      "g4"
    ],
    "guards": [],
    "rocks": [
      "f6",
      "e7"
    ],
    "par": 4,
    "tip": "Начни с верхнего угла и собери звёзды по дороге к замку."
  },
  {
    "id": "knight-5",
    "piece": "knight",
    "title": "Ночной марш",
    "start": "d7",
    "target": "c4",
    "stars": [
      "d6",
      "f7"
    ],
    "guards": [
      "d6"
    ],
    "rocks": [
      "f4"
    ],
    "par": 4,
    "tip": "Если путь кажется закрытым, поищи прыжок через препятствие."
  },
  {
    "id": "knight-6",
    "piece": "knight",
    "title": "Вилочка",
    "start": "b3",
    "target": "f5",
    "stars": [
      "e4",
      "g3"
    ],
    "guards": [
      "d2"
    ],
    "rocks": [
      "e3"
    ],
    "par": 4,
    "tip": "Конь ходит буквой «Г»: две клетки в одну сторону и одна в другую."
  },
  {
    "id": "knight-7",
    "piece": "knight",
    "title": "Перекрёсток",
    "start": "a1",
    "target": "c3",
    "stars": [
      "a3",
      "c2"
    ],
    "guards": [],
    "rocks": [
      "e1"
    ],
    "par": 4,
    "tip": "Конь перепрыгивает камни — они ему не мешают."
  },
  {
    "id": "knight-8",
    "piece": "knight",
    "title": "Манёвр",
    "start": "b3",
    "target": "g1",
    "stars": [
      "d2",
      "f3"
    ],
    "guards": [
      "f3"
    ],
    "rocks": [
      "d3"
    ],
    "par": 3,
    "tip": "Посчитай клетки: две прямо и одна вбок."
  },
  {
    "id": "knight-9",
    "piece": "knight",
    "title": "Скачок через край",
    "start": "h4",
    "target": "c2",
    "stars": [
      "e1",
      "g2"
    ],
    "guards": [
      "g2"
    ],
    "rocks": [],
    "par": 3,
    "tip": "Сначала прыгни туда, где звезда, даже если это не по прямой к замку."
  },
  {
    "id": "knight-10",
    "piece": "knight",
    "title": "Буква «Г»",
    "start": "f8",
    "target": "g7",
    "stars": [
      "f6",
      "h5"
    ],
    "guards": [],
    "rocks": [
      "a7",
      "e6",
      "f5"
    ],
    "par": 4,
    "tip": "Если путь кажется закрытым, поищи прыжок через препятствие."
  },
  {
    "id": "knight-11",
    "piece": "knight",
    "title": "Дальний прыжок",
    "start": "g2",
    "target": "d3",
    "stars": [
      "b4",
      "d5"
    ],
    "guards": [],
    "rocks": [],
    "par": 4,
    "tip": "Конь ходит буквой «Г»: две клетки в одну сторону и одна в другую."
  },
  {
    "id": "knight-12",
    "piece": "knight",
    "title": "Обходной путь",
    "start": "a1",
    "target": "b5",
    "stars": [
      "a3",
      "c2"
    ],
    "guards": [],
    "rocks": [],
    "par": 3,
    "tip": "Конь перепрыгивает камни — они ему не мешают."
  },
  {
    "id": "knight-13",
    "piece": "knight",
    "title": "Точный расчёт",
    "start": "g8",
    "target": "c8",
    "stars": [
      "b6",
      "d7",
      "f6"
    ],
    "guards": [],
    "rocks": [
      "d4",
      "e8"
    ],
    "par": 4,
    "tip": "Посчитай клетки: две прямо и одна вбок."
  },
  {
    "id": "knight-14",
    "piece": "knight",
    "title": "Спуск с башни",
    "start": "g8",
    "target": "g1",
    "stars": [
      "f3",
      "g4",
      "h2"
    ],
    "guards": [
      "e6",
      "h6"
    ],
    "rocks": [
      "g5",
      "h1"
    ],
    "par": 5,
    "tip": "Конь прыгает буквой «Г». Найди три звезды по дороге вниз."
  },
  {
    "id": "knight-15",
    "piece": "knight",
    "title": "Прыжки по краю",
    "start": "c6",
    "target": "h6",
    "stars": [
      "a7",
      "c8",
      "e7"
    ],
    "guards": [
      "f5"
    ],
    "rocks": [
      "a2",
      "f1",
      "h8"
    ],
    "par": 5,
    "tip": "Звёзды стоят у края доски. Коню там хватает места для прыжка."
  },
  {
    "id": "knight-16",
    "piece": "knight",
    "title": "Прыжок через центр",
    "start": "e7",
    "target": "d2",
    "stars": [
      "b3",
      "c5",
      "f5"
    ],
    "guards": [
      "g7",
      "h4"
    ],
    "rocks": [
      "a4",
      "b4",
      "g5"
    ],
    "par": 6,
    "tip": "Сначала собери звёзды ближе к центру, а потом прыгай к замку."
  },
  {
    "id": "knight-17",
    "piece": "knight",
    "title": "Босс: конь-разведчик",
    "start": "c3",
    "target": "e4",
    "stars": [
      "c5",
      "d3",
      "d4"
    ],
    "guards": [
      "e2",
      "h2"
    ],
    "rocks": [
      "d7",
      "g6"
    ],
    "par": 7,
    "boss": true,
    "tip": "Босс любит запутанные маршруты. Подумай, в каком порядке собирать звёзды."
  },
  {
    "id": "bishop-1",
    "piece": "bishop",
    "title": "По диагонали",
    "start": "c1",
    "target": "h2",
    "stars": [
      "f4",
      "d6"
    ],
    "guards": [],
    "rocks": [
      "e6",
      "g5"
    ],
    "par": 3,
    "tip": "Слон ходит только по диагонали и не может перепрыгивать камни."
  },
  {
    "id": "bishop-2",
    "piece": "bishop",
    "title": "Два поворота",
    "start": "f1",
    "target": "a6",
    "stars": [
      "c4",
      "b5"
    ],
    "guards": [],
    "rocks": [
      "e3",
      "b6"
    ],
    "par": 3,
    "tip": "Нашёл диагональ — иди по ней, а потом поворачивай на другую."
  },
  {
    "id": "bishop-3",
    "piece": "bishop",
    "title": "Зигзаг",
    "start": "a1",
    "target": "h8",
    "stars": [
      "c3",
      "f6",
      "e5"
    ],
    "guards": [],
    "rocks": [
      "b4",
      "g5"
    ],
    "par": 4,
    "tip": "Слон всегда остаётся на клетках одного цвета."
  },
  {
    "id": "bishop-4",
    "piece": "bishop",
    "title": "Через всю доску",
    "start": "h1",
    "target": "a8",
    "stars": [
      "f3",
      "c6",
      "d5"
    ],
    "guards": [],
    "rocks": [
      "h4",
      "c5"
    ],
    "par": 4,
    "tip": "Планируй повороты заранее: каждая остановка — новая диагональ."
  },
  {
    "id": "bishop-5",
    "piece": "bishop",
    "title": "Окружной путь",
    "start": "a2",
    "target": "c4",
    "stars": [
      "d5",
      "f7"
    ],
    "guards": [
      "e6"
    ],
    "rocks": [
      "h5"
    ],
    "par": 4,
    "tip": "Собери звёзды по пути, а потом выходи на замок."
  },
  {
    "id": "bishop-6",
    "piece": "bishop",
    "title": "Косой ход",
    "start": "b4",
    "target": "g5",
    "stars": [
      "e7",
      "f8",
      "h4"
    ],
    "guards": [
      "f8"
    ],
    "rocks": [
      "b7"
    ],
    "par": 4,
    "tip": "Слон ходит только по диагонали и не перепрыгивает камни."
  },
  {
    "id": "bishop-7",
    "piece": "bishop",
    "title": "Галерея",
    "start": "b1",
    "target": "d5",
    "stars": [
      "d3",
      "e4",
      "h7"
    ],
    "guards": [],
    "rocks": [
      "c6",
      "g5"
    ],
    "par": 4,
    "tip": "Каждая остановка — это новая диагональ. Планируй поворот заранее."
  },
  {
    "id": "bishop-8",
    "piece": "bishop",
    "title": "Два луча",
    "start": "a2",
    "target": "c8",
    "stars": [
      "b3",
      "c4",
      "e6"
    ],
    "guards": [],
    "rocks": [],
    "par": 4,
    "tip": "Слон всегда остаётся на клетках одного цвета."
  },
  {
    "id": "bishop-9",
    "piece": "bishop",
    "title": "Перехват",
    "start": "a3",
    "target": "f6",
    "stars": [
      "c1",
      "g5"
    ],
    "guards": [],
    "rocks": [
      "f5",
      "g7"
    ],
    "par": 3,
    "tip": "Ищи длинную диагональ, чтобы пересечь доску за один ход."
  },
  {
    "id": "bishop-10",
    "piece": "bishop",
    "title": "Свободная диагональ",
    "start": "e7",
    "target": "d6",
    "stars": [
      "c3",
      "f6"
    ],
    "guards": [
      "c3"
    ],
    "rocks": [
      "d2"
    ],
    "par": 4,
    "tip": "Собери звёзды по пути, а потом выходи на замок."
  },
  {
    "id": "bishop-11",
    "piece": "bishop",
    "title": "Тихий уголок",
    "start": "h2",
    "target": "a7",
    "stars": [
      "e3",
      "g1"
    ],
    "guards": [],
    "rocks": [
      "c8"
    ],
    "par": 3,
    "tip": "Слон ходит только по диагонали и не перепрыгивает камни."
  },
  {
    "id": "bishop-12",
    "piece": "bishop",
    "title": "Длинный луч",
    "start": "f5",
    "target": "a8",
    "stars": [
      "b1",
      "e4",
      "g2"
    ],
    "guards": [
      "b1"
    ],
    "rocks": [
      "c7",
      "g6"
    ],
    "par": 4,
    "tip": "Каждая остановка — это новая диагональ. Планируй поворот заранее."
  },
  {
    "id": "bishop-13",
    "piece": "bishop",
    "title": "Поворот у края",
    "start": "g3",
    "target": "b4",
    "stars": [
      "f4",
      "h2"
    ],
    "guards": [],
    "rocks": [],
    "par": 4,
    "tip": "Слон всегда остаётся на клетках одного цвета."
  },
  {
    "id": "bishop-14",
    "piece": "bishop",
    "title": "Спуск по диагонали",
    "start": "h6",
    "target": "e1",
    "stars": [
      "b8",
      "d6",
      "f8"
    ],
    "guards": [
      "g3"
    ],
    "rocks": [
      "e3",
      "h5"
    ],
    "par": 5,
    "tip": "Слон не сворачивает. Найди диагонали, которые соединят все звёзды."
  },
  {
    "id": "bishop-15",
    "piece": "bishop",
    "title": "С дальней звезды",
    "start": "b5",
    "target": "g8",
    "stars": [
      "a2",
      "b3",
      "e8"
    ],
    "guards": [
      "f7"
    ],
    "rocks": [
      "c5",
      "d2"
    ],
    "par": 5,
    "tip": "Иногда путь к замку начинается с дальней звезды."
  },
  {
    "id": "bishop-16",
    "piece": "bishop",
    "title": "Длинная диагональ",
    "start": "d4",
    "target": "h2",
    "stars": [
      "a3",
      "c5",
      "f4"
    ],
    "guards": [
      "a5",
      "b4"
    ],
    "rocks": [
      "d1",
      "d5"
    ],
    "par": 6,
    "tip": "Звёзды лежат на разных диагоналях. Одной линии не хватит."
  },
  {
    "id": "bishop-17",
    "piece": "bishop",
    "title": "Босс: звёздный крест",
    "start": "g4",
    "target": "a8",
    "stars": [
      "c4",
      "f3",
      "h1"
    ],
    "guards": [
      "c6",
      "e2"
    ],
    "rocks": [
      "d2",
      "e3",
      "h4"
    ],
    "par": 7,
    "boss": true,
    "tip": "Босс-слон спрятал звёзды в трёх направлениях. Начни с ближней."
  },
  {
    "id": "rook-1",
    "piece": "rook",
    "title": "Прямая дорога",
    "start": "a1",
    "target": "h4",
    "stars": [
      "a4",
      "f4"
    ],
    "guards": [
      "e4"
    ],
    "rocks": [
      "d2",
      "c7"
    ],
    "par": 4,
    "tip": "Ладья ходит по прямым линиям. Страж на пути — не преграда, а добыча."
  },
  {
    "id": "rook-2",
    "piece": "rook",
    "title": "Поворот налево",
    "start": "h1",
    "target": "d5",
    "stars": [
      "h5",
      "c5"
    ],
    "guards": [],
    "rocks": [
      "e3",
      "f6"
    ],
    "par": 3,
    "tip": "За один ход ладья может пройти сколько угодно клеток по прямой."
  },
  {
    "id": "rook-3",
    "piece": "rook",
    "title": "Три звезды",
    "start": "a1",
    "target": "d8",
    "stars": [
      "a5",
      "h5",
      "h8"
    ],
    "guards": [],
    "rocks": [
      "b3",
      "g6"
    ],
    "par": 4,
    "tip": "Сначала по вертикали, потом по горизонтали — и снова по вертикали."
  },
  {
    "id": "rook-4",
    "piece": "rook",
    "title": "Рамка",
    "start": "a1",
    "target": "h8",
    "stars": [
      "d1",
      "d4",
      "h4"
    ],
    "guards": [],
    "rocks": [
      "c3",
      "e5"
    ],
    "par": 4,
    "tip": "Обойди доску по краю и собери все звёзды."
  },
  {
    "id": "rook-5",
    "piece": "rook",
    "title": "Штурм",
    "start": "c1",
    "target": "b8",
    "stars": [
      "a8",
      "c8"
    ],
    "guards": [],
    "rocks": [
      "a5",
      "h3"
    ],
    "par": 3,
    "tip": "Планируй повороты: один ход — одна линия."
  },
  {
    "id": "rook-6",
    "piece": "rook",
    "title": "Коридор",
    "start": "h1",
    "target": "a3",
    "stars": [
      "e3",
      "h3",
      "h6"
    ],
    "guards": [],
    "rocks": [
      "a7"
    ],
    "par": 4,
    "tip": "Ладья ходит по прямым линиям — горизонтали и вертикали."
  },
  {
    "id": "rook-7",
    "piece": "rook",
    "title": "Горизонталь",
    "start": "f4",
    "target": "a3",
    "stars": [
      "a2",
      "f2"
    ],
    "guards": [
      "a2"
    ],
    "rocks": [
      "a1",
      "g1"
    ],
    "par": 3,
    "tip": "За один ход ладья может пройти сколько угодно клеток по прямой."
  },
  {
    "id": "rook-8",
    "piece": "rook",
    "title": "Вертикаль",
    "start": "a1",
    "target": "e7",
    "stars": [
      "b1",
      "b4",
      "e4"
    ],
    "guards": [
      "b1"
    ],
    "rocks": [
      "c6",
      "e1",
      "h1"
    ],
    "par": 4,
    "tip": "Страж на линии не преграда: ладья забирает его и идёт дальше."
  },
  {
    "id": "rook-9",
    "piece": "rook",
    "title": "Резкий поворот",
    "start": "b4",
    "target": "d7",
    "stars": [
      "a4",
      "d1",
      "d4"
    ],
    "guards": [
      "d1"
    ],
    "rocks": [
      "c6"
    ],
    "par": 4,
    "tip": "Иногда нужно сначала отойти в сторону, чтобы собрать звезду."
  },
  {
    "id": "rook-10",
    "piece": "rook",
    "title": "Линия",
    "start": "e8",
    "target": "b4",
    "stars": [
      "c4",
      "e4"
    ],
    "guards": [],
    "rocks": [
      "f8",
      "h7",
      "h8"
    ],
    "par": 3,
    "tip": "Планируй повороты: один ход — одна линия."
  },
  {
    "id": "rook-11",
    "piece": "rook",
    "title": "Блокпост",
    "start": "f1",
    "target": "g7",
    "stars": [
      "h1",
      "h7"
    ],
    "guards": [
      "h7"
    ],
    "rocks": [
      "a8"
    ],
    "par": 3,
    "tip": "Ладья ходит по прямым линиям — горизонтали и вертикали."
  },
  {
    "id": "rook-12",
    "piece": "rook",
    "title": "Обход",
    "start": "d8",
    "target": "b5",
    "stars": [
      "a5",
      "a8",
      "e8"
    ],
    "guards": [
      "a8"
    ],
    "rocks": [],
    "par": 4,
    "tip": "За один ход ладья может пройти сколько угодно клеток по прямой."
  },
  {
    "id": "rook-13",
    "piece": "rook",
    "title": "Последний рубеж",
    "start": "h8",
    "target": "a2",
    "stars": [
      "e2",
      "e3",
      "e8"
    ],
    "guards": [],
    "rocks": [],
    "par": 4,
    "tip": "Страж на линии не преграда: ладья забирает его и идёт дальше."
  },
  {
    "id": "rook-14",
    "piece": "rook",
    "title": "Башня спускается",
    "start": "h8",
    "target": "e2",
    "stars": [
      "d1",
      "d2",
      "d7"
    ],
    "guards": [
      "h7"
    ],
    "rocks": [
      "c8",
      "e3",
      "e7",
      "g6"
    ],
    "par": 5,
    "tip": "Ладья ходит прямо. Собери звёзды на одной линии, но не забудь свернуть к замку."
  },
  {
    "id": "rook-15",
    "piece": "rook",
    "title": "Обход по другой линии",
    "start": "a6",
    "target": "a1",
    "stars": [
      "a2",
      "c2",
      "c4"
    ],
    "guards": [
      "a4"
    ],
    "rocks": [
      "c8",
      "d8",
      "f2"
    ],
    "par": 5,
    "tip": "Прямая дорога перекрыта? Ладья умеет обходить по другой линии."
  },
  {
    "id": "rook-16",
    "piece": "rook",
    "title": "Шесть поворотов",
    "start": "b2",
    "target": "e6",
    "stars": [
      "a6",
      "d6",
      "h3"
    ],
    "guards": [
      "a7",
      "h2"
    ],
    "rocks": [
      "g7",
      "g8"
    ],
    "par": 6,
    "tip": "Каждый ход ладьи — поворот. Планируй, куда свернёшь на следующем ходу."
  },
  {
    "id": "rook-17",
    "piece": "rook",
    "title": "Босс: королевская башня",
    "start": "h1",
    "target": "d8",
    "stars": [
      "a1",
      "c2",
      "g2"
    ],
    "guards": [
      "f2",
      "g8"
    ],
    "rocks": [
      "e6"
    ],
    "par": 7,
    "boss": true,
    "tip": "Босс проверит, умеешь ли ты менять направление и собирать звёзды по всей доске."
  },
  {
    "id": "queen-1",
    "piece": "queen",
    "title": "Королевский ход",
    "start": "d1",
    "target": "h8",
    "stars": [
      "d4",
      "h4"
    ],
    "guards": [],
    "rocks": [
      "f2",
      "b6"
    ],
    "par": 3,
    "tip": "Ферзь ходит и прямо, и по диагонали — как ладья и слон вместе."
  },
  {
    "id": "queen-2",
    "piece": "queen",
    "title": "Через центр",
    "start": "a1",
    "target": "h1",
    "stars": [
      "a5",
      "e5"
    ],
    "guards": [],
    "rocks": [
      "c3",
      "g4"
    ],
    "par": 4,
    "tip": "Один ход — одна линия. Выбирай, где повернуть."
  },
  {
    "id": "queen-3",
    "piece": "queen",
    "title": "Большое путешествие",
    "start": "h1",
    "target": "a8",
    "stars": [
      "e1",
      "e4",
      "b4"
    ],
    "guards": [],
    "rocks": [
      "f2",
      "d6"
    ],
    "par": 4,
    "tip": "Ферзь может пересечь всю доску за один ход."
  },
  {
    "id": "queen-4",
    "piece": "queen",
    "title": "Быстрый маршрут",
    "start": "d4",
    "target": "h8",
    "stars": [
      "g4",
      "g7"
    ],
    "guards": [],
    "rocks": [
      "e3",
      "f6"
    ],
    "par": 3,
    "tip": "Иногда короткий путь — не самый прямой. Сначала собери звёзды."
  },
  {
    "id": "queen-5",
    "piece": "queen",
    "title": "Мастер ход",
    "start": "g5",
    "target": "g3",
    "stars": [
      "g4",
      "g7",
      "h5"
    ],
    "guards": [],
    "rocks": [
      "e3"
    ],
    "par": 4,
    "tip": "Один ход — одна линия, зато любая."
  },
  {
    "id": "queen-6",
    "piece": "queen",
    "title": "Все направления",
    "start": "d8",
    "target": "a5",
    "stars": [
      "c6",
      "f6"
    ],
    "guards": [],
    "rocks": [
      "c4",
      "d7",
      "f8"
    ],
    "par": 4,
    "tip": "Ферзь ходит и прямо, и по диагонали — как ладья и слон вместе."
  },
  {
    "id": "queen-7",
    "piece": "queen",
    "title": "Клин",
    "start": "h5",
    "target": "c8",
    "stars": [
      "b1",
      "b7",
      "h1"
    ],
    "guards": [
      "b7"
    ],
    "rocks": [],
    "par": 4,
    "tip": "Выбирай линию так, чтобы собрать звезду и не потерять путь к замку."
  },
  {
    "id": "queen-8",
    "piece": "queen",
    "title": "Рейд",
    "start": "a2",
    "target": "h1",
    "stars": [
      "d1",
      "d2",
      "e2"
    ],
    "guards": [
      "e2"
    ],
    "rocks": [
      "b6"
    ],
    "par": 4,
    "tip": "Ферзь может пересечь всю доску за один ход."
  },
  {
    "id": "queen-9",
    "piece": "queen",
    "title": "Дальний бой",
    "start": "g8",
    "target": "h5",
    "stars": [
      "c5",
      "c7"
    ],
    "guards": [
      "c8"
    ],
    "rocks": [],
    "par": 4,
    "tip": "Иногда короткий путь — не самый прямой: сначала звёзды."
  },
  {
    "id": "queen-10",
    "piece": "queen",
    "title": "Финальный рывок",
    "start": "e4",
    "target": "h3",
    "stars": [
      "h1",
      "h7"
    ],
    "guards": [],
    "rocks": [],
    "par": 3,
    "tip": "Один ход — одна линия, зато любая."
  },
  {
    "id": "queen-11",
    "piece": "queen",
    "title": "Королевский марш",
    "start": "a2",
    "target": "f1",
    "stars": [
      "e6",
      "f3",
      "f5"
    ],
    "guards": [],
    "rocks": [
      "b4",
      "c1",
      "d4"
    ],
    "par": 4,
    "tip": "Ферзь ходит и прямо, и по диагонали — как ладья и слон вместе."
  },
  {
    "id": "queen-12",
    "piece": "queen",
    "title": "Центр доски",
    "start": "c7",
    "target": "e5",
    "stars": [
      "d6",
      "e6"
    ],
    "guards": [],
    "rocks": [
      "b1"
    ],
    "par": 3,
    "tip": "Выбирай линию так, чтобы собрать звезду и не потерять путь к замку."
  },
  {
    "id": "queen-13",
    "piece": "queen",
    "title": "Свободный полёт",
    "start": "a4",
    "target": "d5",
    "stars": [
      "c2",
      "c5"
    ],
    "guards": [
      "c5"
    ],
    "rocks": [
      "h4"
    ],
    "par": 3,
    "tip": "Ферзь может пересечь всю доску за один ход."
  },
  {
    "id": "queen-14",
    "piece": "queen",
    "title": "Ферзь на охоте",
    "start": "d8",
    "target": "c1",
    "stars": [
      "d1",
      "g5",
      "h6"
    ],
    "guards": [
      "h5",
      "h8"
    ],
    "rocks": [
      "d2",
      "e1"
    ],
    "par": 5,
    "tip": "Ферзь может идти прямо и по диагонали. Выбирай направление, которое собирает звезду."
  },
  {
    "id": "queen-15",
    "piece": "queen",
    "title": "Звёздный зигзаг",
    "start": "f5",
    "target": "a8",
    "stars": [
      "b8",
      "d7",
      "f8"
    ],
    "guards": [
      "e7"
    ],
    "rocks": [
      "d3",
      "f6"
    ],
    "par": 5,
    "tip": "Не обязательно идти к цели по прямой: звёзды могут лежать в стороне."
  },
  {
    "id": "queen-16",
    "piece": "queen",
    "title": "Большой обход",
    "start": "b3",
    "target": "e2",
    "stars": [
      "c4",
      "e6",
      "g5"
    ],
    "guards": [
      "g8"
    ],
    "rocks": [
      "f8",
      "g6"
    ],
    "par": 6,
    "tip": "Собери три звезды, прежде чем войти в замок."
  },
  {
    "id": "queen-17",
    "piece": "queen",
    "title": "Босс: ферзь-гроссмейстер",
    "start": "d6",
    "target": "g3",
    "stars": [
      "a4",
      "a7",
      "h2"
    ],
    "guards": [
      "a1",
      "a5"
    ],
    "rocks": [
      "b2",
      "d8"
    ],
    "par": 7,
    "boss": true,
    "tip": "Самый длинный маршрут. Думай на два хода вперёд."
  }
];
