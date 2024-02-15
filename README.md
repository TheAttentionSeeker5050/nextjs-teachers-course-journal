# Course Grid Project

## Api folder structure

pages
  api
    lesson
      ...
    unit (future sprints)
      ...
    course
      [courseId]
        add.js
        edit.js
        delete.js
  course
    [courseId]
      index.js (Nick, display the course content, simmilar to the courses tiles view)
      add.js (Ola)
      edit.js (Ola)
      delete.js (Ola)
  lesson
    ...
  unit
    ...


.
└── pages/
    ├── api/
    │   ├── lesson/
    │   │   └── ...
    │   ├── unit (future sprints)/
    │   │   └── ...
    │   └── course/
    │       ├── add.js
    │       ├── edit.js
    │       └── delete.js
    └── course/
        ├── index.js (Nick, display the course content, simmilar to the courses tiles view)
        ├── add.js (Ola)
        ├── edit.js (Ola)
        ├── delete.js (Ola)
        ├── lesson/
        │   └── ...
        └── unit/
            └── ...
