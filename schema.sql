
CREATE TABLE IF NOT EXISTS shift_requests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  shift_date TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('available','off')),
  start_time TEXT NOT NULL DEFAULT '',
  end_time TEXT NOT NULL DEFAULT '',
  note TEXT NOT NULL DEFAULT '',
  updated_at TEXT NOT NULL DEFAULT (datetime('now', '+9 hours')),
  UNIQUE(name, shift_date)
);

CREATE INDEX IF NOT EXISTS idx_shift_requests_date
ON shift_requests(shift_date);

CREATE INDEX IF NOT EXISTS idx_shift_requests_month
ON shift_requests(substr(shift_date,1,7));


CREATE TABLE IF NOT EXISTS actual_shifts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  shift_date TEXT NOT NULL,
  assigned INTEGER NOT NULL DEFAULT 0,
  start_time TEXT NOT NULL DEFAULT '',
  end_time TEXT NOT NULL DEFAULT '',
  admin_note TEXT NOT NULL DEFAULT '',
  updated_at TEXT NOT NULL DEFAULT (datetime('now', '+9 hours')),
  UNIQUE(name, shift_date)
);

CREATE INDEX IF NOT EXISTS idx_actual_shifts_date
ON actual_shifts(shift_date);
