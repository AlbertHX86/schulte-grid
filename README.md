# Schulte Grid

English | [中文](README.zh-CN.md)

A minimal Schulte grid game that runs in the browser. It has no ads, no sign-up and no dependencies.

**Play online:** https://alberthx86.github.io/schulte-grid/

## How to play

1. Pick a grid size: 3×3 to 7×7. 5×5 is the classic one.
2. Tap **1**. The timer starts.
3. Find and tap the numbers in order, 1, 2, 3 … up to the last one. The number to look for is shown under **Next**. A wrong tap flashes red and does not count.
4. The timer stops when you tap the last number. Your time is saved to **Records**.
5. Press **Reset** for a new shuffled grid.

Tips:

- Keep your eyes on the centre of the grid and try to find numbers with your peripheral vision instead of scanning cell by cell.
- Short sessions work best: a few rounds, once or twice a day.
- Compare yourself with yourself. Look at your trend in **Records**, not a single fast round.

The top right corner switches between light and dark themes and between English and Chinese. By default the page follows your system theme and browser language.

## Records

Each grid size keeps its own records: your best time and your 10 most recent rounds. They are stored in your browser's `localStorage`. Nothing is sent anywhere.

- The same browser on the same device keeps your records, online or offline.
- Records do not sync between browsers or devices.
- Clearing browser data deletes them. You can also press **Clear** to delete the records of the current size.

## Run it locally

The game is three static files, `index.html`, `style.css` and `app.js`, with no build step.

```bash
git clone https://github.com/AlbertHX86/schulte-grid.git
cd schulte-grid
```

Then either open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

Opening the file directly and serving it over `localhost` count as different sites to the browser, so they keep separate records. Pick one and stick with it if you want to compare your times.

## About Schulte grids and the prefrontal cortex

A Schulte table is a grid of shuffled numbers that you find in order. It is named after the German psychiatrist Walter Schulte and has long been used in psychology to measure attention: how fast and how steadily a person can search a visual field.

A round exercises several abilities that rely on the frontal lobes, especially the prefrontal cortex, together with the parietal attention areas:

- **Sustained attention:** staying on task for the whole round.
- **Working memory:** keeping the current target number in mind while you search.
- **Inhibitory control:** ignoring the numbers you have already found and the ones that come later.
- **Visual search and eye movements:** scanning efficiently and using peripheral vision.

Because of this, people use it as a short, low-effort attention exercise, for example as a warm-up before studying or as a break from screens full of notifications.

**Be realistic about what it can do.** Practice reliably makes you faster at Schulte grids. The evidence that the gains carry over to everyday attention or other tasks is limited, and there is no good evidence that it repairs the prefrontal cortex or treats ADHD, brain injury or any other condition. Treat it as a focus exercise, not therapy. If you have concerns about attention or memory, talk to a doctor.

## License

[MIT](LICENSE)
