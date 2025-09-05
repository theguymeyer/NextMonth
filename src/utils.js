import Papa from 'papaparse'

export const store = {
  load() {
    return JSON.parse(localStorage.getItem('nextmonth_settings') || '{}')
  },
  save(s) {
    localStorage.setItem('nextmonth_settings', JSON.stringify(s))
  }
}

export function uid() {
  return Math.random().toString(36).slice(2)
}

export const monthOptions = (() => {
  const now = new Date()
  const arr = []
  for (let i = 0; i < 18; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    arr.push({
      label: d.toLocaleString(undefined, { month: 'long', year: 'numeric' }),
      value: d.toISOString().slice(0, 7)
    })
  }
  return arr
})()

export function parseCsv(file, callback) {
  Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    complete: (res) => callback(res.data)
  })
}
