const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const interactionArea = document.getElementById('interactionArea');
const invitationBox = document.querySelector('.invitation-box');
const noButton = document.getElementById('noButton');
const yesButton = document.getElementById('yesButton');
const gifOverlay = document.getElementById('gifOverlay');
const overlayGif = gifOverlay.querySelector('img');
const danceScreen = document.getElementById('danceScreen');
const danceGifsContainer = document.getElementById('danceGifs');
const birthdayScreen = document.getElementById('birthdayScreen');
const birthdayCollage = document.getElementById('birthdayCollage');
const shadiAudio = document.getElementById('shadiAudio');
const cryAudio = document.getElementById('cryAudio');
const laughAudio = document.getElementById('laughAudio');
const umaruCryAudio = document.getElementById('umaruCryAudio');
const dangAudio = document.getElementById('dangAudio');
const closingAudio = document.getElementById('closingAudio');
const noButtonGifs = ['1a.gif', '1b.gif', '1c.gif', '1d.gif', '1e.gif'];
const allAudioTracks = [shadiAudio, cryAudio, laughAudio, umaruCryAudio, dangAudio, closingAudio];
const danceGifs = ['dance1.gif', 'dance2.gif', 'dance3.gif', 'dance4.gif', 'dance5.gif'];
const birthdayPhotos = Array.from({ length: 29 }, (_, index) => `janu${index + 1}.jpg`);
let shuffledNoButtonGifs = [];
let lastNoButtonGif = '';
let shuffledBirthdayPhotos = [];
let lastBirthdayPhoto = '';
let birthdayCollageInterval;
let danceTransitionTimeout;
const birthdayTiles = [];
const birthdayFadeDuration = 2000;
let dodgesRemaining = 2 + Math.floor(Math.random() * 2);

const blossoms = [];
const blossomColors = ['#f4b8cc', '#f8c7d6', '#f3d1dc', '#eaa8c0', '#f5c3b4'];
const maxBlossoms = 12;
let lastBlossomAt = 0;
let nextBlossomDelay = 0;

function resizeCanvas() {
  const pixelRatio = window.devicePixelRatio || 1;
  canvas.width = Math.round(window.innerWidth * pixelRatio);
  canvas.height = Math.round(window.innerHeight * pixelRatio);
  ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
}

function createBlossom() {
  blossoms.push({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    size: 52 + Math.random() * 58,
    rotation: Math.random() * Math.PI * 2,
    widthRatio: 0.3 + Math.random() * 0.12,
    color: blossomColors[Math.floor(Math.random() * blossomColors.length)],
    bornAt: performance.now(),
    lifetime: 6000 + Math.random() * 3000
  });

  if (blossoms.length > maxBlossoms) {
    blossoms.shift();
  }
}

function drawBlossom(blossom, now) {
  const age = now - blossom.bornAt;
  const bloomProgress = Math.min(1, age / 1100);
  const fadeOut = Math.min(1, (blossom.lifetime - age) / 1100);
  const bloomScale = 1 - Math.pow(1 - bloomProgress, 3);
  const alpha = Math.max(0, Math.min(bloomProgress, fadeOut));
  const petalLength = blossom.size * 0.58 * bloomScale;
  const petalWidth = petalLength * blossom.widthRatio;

  ctx.save();
  ctx.translate(blossom.x, blossom.y);
  ctx.rotate(blossom.rotation);
  ctx.globalAlpha = alpha;

  for (let i = 0; i < 5; i++) {
    ctx.save();
    ctx.rotate((Math.PI * 2 * i) / 5);
    const gradient = ctx.createLinearGradient(-petalWidth, 0, petalWidth, petalLength);
    gradient.addColorStop(0, '#fff0f4');
    gradient.addColorStop(0.48, blossom.color);
    gradient.addColorStop(1, '#d78da9');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(-petalWidth * 0.6, petalLength * 0.22, -petalWidth * 0.95, petalLength * 0.73, -petalWidth * 0.42, petalLength * 0.88);
    ctx.quadraticCurveTo(-petalWidth * 0.12, petalLength * 0.98, 0, petalLength * 0.83);
    ctx.quadraticCurveTo(petalWidth * 0.12, petalLength * 0.98, petalWidth * 0.42, petalLength * 0.88);
    ctx.bezierCurveTo(petalWidth * 0.95, petalLength * 0.73, petalWidth * 0.6, petalLength * 0.22, 0, 0);
    ctx.fill();
    ctx.strokeStyle = 'rgba(150, 72, 103, 0.22)';
    ctx.lineWidth = Math.max(0.6, blossom.size * 0.008);
    ctx.stroke();
    ctx.restore();
  }

  ctx.fillStyle = '#b9745d';
  ctx.beginPath();
  ctx.arc(0, 0, Math.max(2, blossom.size * 0.045 * bloomScale), 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = 'rgba(255, 235, 190, 0.8)';
  ctx.fillStyle = 'rgba(255, 226, 166, 0.9)';
  ctx.lineWidth = Math.max(0.7, blossom.size * 0.009);
  for (let i = 0; i < 7; i++) {
    const angle = (Math.PI * 2 * i) / 7 + blossom.rotation;
    const startX = Math.cos(angle) * blossom.size * 0.035 * bloomScale;
    const startY = Math.sin(angle) * blossom.size * 0.035 * bloomScale;
    const endX = Math.cos(angle) * blossom.size * 0.15 * bloomScale;
    const endY = Math.sin(angle) * blossom.size * 0.15 * bloomScale;
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(endX, endY, Math.max(1, blossom.size * 0.013 * bloomScale), 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function animateBlossoms(now) {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

  if (now - lastBlossomAt >= nextBlossomDelay) {
    createBlossom();
    lastBlossomAt = now;
    nextBlossomDelay = 700 + Math.random() * 1100;
  }

  for (let i = blossoms.length - 1; i >= 0; i--) {
    if (now - blossoms[i].bornAt >= blossoms[i].lifetime) {
      blossoms.splice(i, 1);
    } else {
      drawBlossom(blossoms[i], now);
    }
  }

  window.requestAnimationFrame(animateBlossoms);
}

function placeNoButtonInItsSlot() {
  const areaBounds = interactionArea.getBoundingClientRect();
  const slotBounds = invitationBox.querySelector('.button-placeholder').getBoundingClientRect();
  noButton.style.left = `${slotBounds.left - areaBounds.left}px`;
  noButton.style.top = `${slotBounds.top - areaBounds.top}px`;
}

function moveNoButton() {
  const padding = 4;
  const maxLeft = interactionArea.clientWidth - noButton.offsetWidth - padding;
  const maxTop = interactionArea.clientHeight - noButton.offsetHeight - padding;
  const nextLeft = padding + Math.random() * Math.max(0, maxLeft - padding);
  const nextTop = padding + Math.random() * Math.max(0, maxTop - padding);

  noButton.style.left = `${nextLeft}px`;
  noButton.style.top = `${nextTop}px`;
}

function nextNoButtonGif() {
  if (shuffledNoButtonGifs.length === 0) {
    shuffledNoButtonGifs = [...noButtonGifs];

    for (let i = shuffledNoButtonGifs.length - 1; i > 0; i--) {
      const swapIndex = Math.floor(Math.random() * (i + 1));
      [shuffledNoButtonGifs[i], shuffledNoButtonGifs[swapIndex]] =
        [shuffledNoButtonGifs[swapIndex], shuffledNoButtonGifs[i]];
    }

    if (shuffledNoButtonGifs[0] === lastNoButtonGif) {
      [shuffledNoButtonGifs[0], shuffledNoButtonGifs[1]] =
        [shuffledNoButtonGifs[1], shuffledNoButtonGifs[0]];
    }
  }

  lastNoButtonGif = shuffledNoButtonGifs.pop();
  return lastNoButtonGif;
}

let overlayTimeout;
function hideGifOverlay() {
  window.clearTimeout(overlayTimeout);
  gifOverlay.classList.remove('is-visible');
  gifOverlay.setAttribute('aria-hidden', 'true');
  for (const sound of allAudioTracks) {
    sound.pause();
    sound.currentTime = 0;
  }
  dodgesRemaining = 2 + Math.floor(Math.random() * 2);
}

function showDanceScreen() {
  window.clearTimeout(danceTransitionTimeout);
  closingAudio.pause();
  closingAudio.currentTime = 0;
  closingAudio.loop = true;
  danceGifsContainer.replaceChildren();
  const danceTiles = danceGifs.map((src) => {
    const tile = document.createElement('img');
    tile.className = 'dance-tile';
    tile.src = src;
    tile.alt = '';
    danceGifsContainer.appendChild(tile);
    return tile;
  });
  danceScreen.classList.add('is-active');
  danceScreen.setAttribute('aria-hidden', 'false');
  positionDanceGifs(danceTiles);

  danceTransitionTimeout = window.setTimeout(advanceDanceSequence, 6000);
  closingAudio.play().catch((error) => {
    console.error('Could not play the closing audio:', error);
  });
}

function advanceDanceSequence() {
  window.clearTimeout(danceTransitionTimeout);
  danceScreen.classList.remove('is-active');
  danceScreen.setAttribute('aria-hidden', 'true');
  birthdayScreen.classList.add('is-active');
  birthdayScreen.setAttribute('aria-hidden', 'false');
  startBirthdayCollage();
}

function positionDanceGifs(tiles) {
  const screenWidth = danceGifsContainer.clientWidth;
  const screenHeight = danceGifsContainer.clientHeight;
  const screenBounds = danceGifsContainer.getBoundingClientRect();
  const contentBounds = document.querySelector('.dance-content').getBoundingClientRect();
  const protectedArea = {
    left: contentBounds.left - screenBounds.left - 12,
    top: contentBounds.top - screenBounds.top - 12,
    right: contentBounds.right - screenBounds.left + 12,
    bottom: contentBounds.bottom - screenBounds.top + 12
  };
  const positions = [];

  for (const tile of tiles) {
    const width = tile.offsetWidth;
    const height = tile.offsetHeight;
    let position;

    for (let attempt = 0; attempt < 1000; attempt++) {
      const candidate = {
        left: Math.random() * Math.max(0, screenWidth - width),
        top: Math.random() * Math.max(0, screenHeight - height),
        width,
        height
      };
      const clearOfMainGif =
        candidate.left + width <= protectedArea.left ||
        candidate.left >= protectedArea.right ||
        candidate.top + height <= protectedArea.top ||
        candidate.top >= protectedArea.bottom;
      const separated = positions.every((placed) =>
        candidate.left + candidate.width + 12 <= placed.left ||
        placed.left + placed.width + 12 <= candidate.left ||
        candidate.top + candidate.height + 12 <= placed.top ||
        placed.top + placed.height + 12 <= candidate.top
      );

      if (clearOfMainGif && separated) {
        position = candidate;
        break;
      }
    }

    if (!position) {
      position = {
        left: screenWidth / 2 - width / 2,
        top: Math.max(0, protectedArea.top - height - 12),
        width,
        height
      };
    }

    tile.style.left = `${position.left}px`;
    tile.style.top = `${position.top}px`;
    positions.push(position);
  }
}

function nextBirthdayPhoto() {
  if (shuffledBirthdayPhotos.length === 0) {
    shuffledBirthdayPhotos = [...birthdayPhotos];

    for (let i = shuffledBirthdayPhotos.length - 1; i > 0; i--) {
      const swapIndex = Math.floor(Math.random() * (i + 1));
      [shuffledBirthdayPhotos[i], shuffledBirthdayPhotos[swapIndex]] =
        [shuffledBirthdayPhotos[swapIndex], shuffledBirthdayPhotos[i]];
    }

    if (shuffledBirthdayPhotos[0] === lastBirthdayPhoto) {
      [shuffledBirthdayPhotos[0], shuffledBirthdayPhotos[1]] =
        [shuffledBirthdayPhotos[1], shuffledBirthdayPhotos[0]];
    }
  }

  lastBirthdayPhoto = shuffledBirthdayPhotos.pop();
  return lastBirthdayPhoto;
}

function startBirthdayCollage() {
  birthdayCollage.replaceChildren();
  birthdayTiles.length = 0;
  window.clearInterval(birthdayCollageInterval);

  for (let i = 0; i < 5; i++) {
    const photo = document.createElement('img');
    photo.className = 'birthday-tile';
    photo.alt = '';
    birthdayCollage.appendChild(photo);
    birthdayTiles.push(photo);
    setBirthdayTilePhoto(photo);
  }

  randomizeBirthdayTilePositions();
  window.requestAnimationFrame(() => {
    birthdayTiles.forEach((tile) => tile.classList.add('is-visible'));
  });
  birthdayCollageInterval = window.setInterval(updateBirthdayCollage, 7000);
}

function setBirthdayTilePhoto(tile) {
  tile.src = nextBirthdayPhoto();
}

function randomizeBirthdayTilePositions() {
  const collageWidth = birthdayCollage.clientWidth;
  const collageHeight = birthdayCollage.clientHeight;
  const gap = 32;
  const positions = [];

  for (const tile of birthdayTiles) {
    const width = tile.offsetWidth;
    const height = tile.offsetHeight;
    let position;

    for (let attempt = 0; attempt < 300; attempt++) {
      const candidate = {
        left: Math.random() * Math.max(0, collageWidth - width),
        top: Math.random() * Math.max(0, collageHeight - height),
        width,
        height
      };
      const hasClearance = positions.every((placed) =>
        candidate.left + candidate.width + gap <= placed.left ||
        placed.left + placed.width + gap <= candidate.left ||
        candidate.top + candidate.height + gap <= placed.top ||
        placed.top + placed.height + gap <= candidate.top
      );

      if (hasClearance) {
        position = candidate;
        break;
      }
    }

    if (!position) {
      const columns = collageWidth < 600 ? 2 : 3;
      const rows = Math.ceil(birthdayTiles.length / columns);
      const cellWidth = collageWidth / columns;
      const cellHeight = collageHeight / rows;
      const index = positions.length;
      position = {
        left: Math.max(0, (index % columns) * cellWidth + (cellWidth - width) / 2),
        top: Math.max(0, Math.floor(index / columns) * cellHeight + (cellHeight - height) / 2),
        width,
        height
      };
    }

    tile.style.left = `${position.left}px`;
    tile.style.top = `${position.top}px`;
    positions.push(position);
  }
}

function updateBirthdayCollage() {
  birthdayTiles.forEach((tile) => tile.classList.remove('is-visible'));

  window.setTimeout(() => {
    birthdayTiles.forEach(setBirthdayTilePhoto);
    randomizeBirthdayTilePositions();
    window.requestAnimationFrame(() => {
      birthdayTiles.forEach((tile) => tile.classList.add('is-visible'));
    });
  }, birthdayFadeDuration);
}

function showGif(src, duration = 3000, audio = null, syncToAudioEnd = true) {
  window.clearTimeout(overlayTimeout);
  for (const sound of allAudioTracks) {
    sound.pause();
    sound.currentTime = 0;
  }

  overlayGif.src = src;
  gifOverlay.classList.add('is-visible');
  gifOverlay.setAttribute('aria-hidden', 'false');

  if (audio) {
    audio.currentTime = 0;
    audio.play().catch((error) => {
      console.error('Could not play the celebration audio:', error);
      if (audio === shadiAudio) {
        hideGifOverlay();
        showDanceScreen();
      } else {
        hideGifOverlay();
      }
    });
    if (syncToAudioEnd) return;
  }

  overlayTimeout = window.setTimeout(() => {
    hideGifOverlay();
  }, duration);
}

shadiAudio.addEventListener('ended', () => {
  hideGifOverlay();
  showDanceScreen();
});
cryAudio.addEventListener('ended', hideGifOverlay);
umaruCryAudio.addEventListener('ended', hideGifOverlay);
dangAudio.addEventListener('ended', hideGifOverlay);

noButton.addEventListener('pointerenter', () => {
  if (dodgesRemaining > 0) {
    dodgesRemaining--;
    moveNoButton();
  }
});

noButton.addEventListener('click', () => {
  const gif = nextNoButtonGif();
  if (gif === '1a.gif') {
    showGif(gif, 3000, laughAudio, false);
  } else if (gif === '1c.gif') {
    showGif(gif, undefined, dangAudio);
  } else if (gif === '1e.gif') {
    showGif(gif, undefined, umaruCryAudio);
  } else {
    showGif(gif, undefined, cryAudio);
  }
});

yesButton.addEventListener('click', () => {
  showGif('shadi.gif', undefined, shadiAudio);
});

resizeCanvas();
placeNoButtonInItsSlot();
window.addEventListener('resize', () => {
  resizeCanvas();
  placeNoButtonInItsSlot();
});
window.requestAnimationFrame(animateBlossoms);