//Fuck bitch

const imageAssets = [
  // ad banners
  'assets/ads/furry.png',
  'assets/ads/kirkingmyschmeet.webp',
  'assets/ads/onlyguys.webp',
  'assets/ads/residente.png',
  'assets/ads/sexysolitaire.webp',
  'assets/ads/FakeNews.jpg',
  'assets/ads/jimmyrpe.jpg',
  'assets/ads/hapa.png',
  'assets/ads/feinwashed.webp',
  'assets/ads/yahu_is_our_savior.webp',
  'assets/ads/coolest_ad_ever.webp',
  'assets/ads/french.webp',
  'assets/ads/jimmygay.png',
  'assets/ads/Cocter.png',
  'assets/ads/noahbissofuckinggay.jpg',
  'assets/ads/saucy.png',
  'assets/ads/jimmyisverymean.jpg',
  'assets/thebuol.jpg',

  // core sprites / backgrounds
  'assets/ClaviculusTheWise.jpg',
  'assets/CardSprite.jpg',
  'assets/DealerDown.png',
  'assets/jorkinit.jpg',
  'assets/title.png',
  'assets/leave store.png',

  // backgroundmap
  'assets/vegasstrip.jpg',
  'assets/epsteintemple.jpg',
  'assets/blackingmyjack.jpg',
  'assets/MrNetanyahuNose.png',
  'assets/dump.jpg',
  'assets/oldustytrail.jpg',
  'assets/trashcarrace.png',
  'assets/syndromedown.jpg',
  'assets/carcrash.jpg',
  'assets/totallyfrhibachi.jpg',
  'assets/hibachioutside.png',
  'assets/hiubachigrill.jpg',
  'assets/evilassrapeplace.png',
  'assets/evilassrapeplace2.png',
  'assets/smthsmthracist.jpg',
  'assets/chinatown.jpg',
  'assets/oldmandying.webp',
  'assets/ohlordylord.webp',
  'assets/kindainsensitive.jpg',
  'assets/bar.jpg',
  'assets/landoffireandpainfuckinstupidasscaliforniaiHATEyou.jpg',
  'assets/waawaawoowee.png',
  'assets/ikea.jpg',
  'assets/cumbucket.jpg',
  'assets/ending.jpg',

  // spritemap
  'assets/blank-image.png',
  'assets/NoahsBarmitsvah.png',
  'assets/woowooweewee.png',
  'assets/MrNetanyahu.png',
  'assets/packson.png',
  'assets/homeless.png',
  'assets/angy.png',
  'assets/waiter.png',
  'assets/NoahsFemboyBarmitsvah.png',
  'assets/mynuts.png',
  'assets/poop.png',
  'assets/pookiewookie.png',
  'assets/eatmyasshole.png',
  'assets/asiandude.png',
  'assets/jamalkunpersona4.png',
  'assets/cardboard.png',

  // shop buttons -> 'assets/' + name + '.png'
  ...[
    'clav', 'steroids', 'nord vpn', 'yarmulke',
    'israeli flag body pillow', 'storm cosplay', 'kitty cat :3',
    'hentai game', 'penis curling', 'aderall',
    'mystery sludge', 'leave store'
  ].map((name) => `assets/${name}.png`),
];

const videoAssets = [
  'assets/erika-kirk-kirk.mp4',

  //Soundtrack
  'assets/KRPG2 OFFICIAL SOUNDTRACK DELUXE 1/Blackjack Theme.mp3',
  'assets/KRPG2 OFFICIAL SOUNDTRACK DELUXE 1/Date1 Theme.mp3',
  'assets/KRPG2 OFFICIAL SOUNDTRACK DELUXE 1/Date2 Theme.mp3',
  'assets/KRPG2 OFFICIAL SOUNDTRACK DELUXE 1/Date3 Theme.mp3',
  'assets/KRPG2 OFFICIAL SOUNDTRACK DELUXE 1/Ending Theme.mp3',
  'assets/KRPG2 OFFICIAL SOUNDTRACK DELUXE 1/Init Theme.mp3',
  'assets/KRPG2 OFFICIAL SOUNDTRACK DELUXE 1/Sniff Theme.mp3',
  'assets/KRPG2 OFFICIAL SOUNDTRACK DELUXE 1/Store Theme.mp3',
  'assets/KRPG2 OFFICIAL SOUNDTRACK DELUXE 1/Title Theme.mp3'
];

// de-dupe in case any path appears more than once
const uniqueImageAssets = [...new Set(imageAssets)];
const uniqueVideoAssets = [...new Set(videoAssets)];

const totalAssets = uniqueImageAssets.length + uniqueVideoAssets.length;

const screenEl = document.getElementById('preload-screen');
const barFillEl = document.getElementById('preload-bar-fill');
const statusEl = document.getElementById('preload-status');

let loadedCount = 0;

function updateProgress() {
  loadedCount++;
  const pct = totalAssets === 0 ? 100 : Math.round((loadedCount / totalAssets) * 100);
  if (barFillEl) barFillEl.style.width = pct + '%';
  if (statusEl) statusEl.textContent = `${loadedCount} / ${totalAssets} assets loaded`;
}

function loadImage(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      updateProgress();
      resolve(img);
    };
    img.onerror = () => {
      console.warn('Failed to preload image:', src);
      updateProgress();
      resolve(null);
    };
    img.src = src;
  });
}

function loadVideo(src) {
  return new Promise((resolve) => {
    const vid = document.createElement('video');
    vid.preload = 'auto';
    vid.oncanplaythrough = () => {
      updateProgress();
      resolve(vid);
    };
    vid.onerror = () => {
      console.warn('Failed to preload video:', src);
      updateProgress();
      resolve(null);
    };
    vid.src = src;
    vid.load();
  });
}

function hideLoadingScreen() {
  if (!screenEl) return;
  screenEl.classList.add('hidden');
  setTimeout(() => {
    screenEl.style.display = 'none';
  }, 450); // matches CSS transition duration
}

async function preloadAll() {
  if (statusEl) statusEl.textContent = `0 / ${totalAssets} assets loaded`;

  const imagePromises = uniqueImageAssets.map(loadImage);
  const videoPromises = uniqueVideoAssets.map(loadVideo);

  await Promise.all([...imagePromises, ...videoPromises]);

  hideLoadingScreen();
  // let the rest of the app know assets are ready, in case game.js
  // wants to wait for this instead of / in addition to the visual cue
  window.dispatchEvent(new CustomEvent('assets-preloaded'));
}

preloadAll();