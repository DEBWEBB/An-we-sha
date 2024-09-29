let highestZ = 1;

class Paper {
  holdingPaper = false;
  touchStartX = 0;
  touchStartY = 0;
  touchMoveX = 0;
  touchMoveY = 0;
  prevTouchX = 0;
  prevTouchY = 0;
  velX = 0;
  velY = 0;
  rotation = Math.random() * 30 - 15;
  currentPaperX = 0;
  currentPaperY = 0;
  rotating = false;

  constructor(paper) {
    this.paper = paper;
    this.init();
  }

  // Initialize the paper interactions
  init() {
    this.handleTouchMove();
    this.handleTouchStart();
    this.handleTouchEnd();
    this.handleGestureEvents();
  }

  handleTouchMove() {
    this.paper.addEventListener('touchmove', (e) => {
      e.preventDefault();
      if (!this.rotating) {
        this.touchMoveX = e.touches[0].clientX;
        this.touchMoveY = e.touches[0].clientY;

        this.velX = this.touchMoveX - this.prevTouchX;
        this.velY = this.touchMoveY - this.prevTouchY;
      }

      const dirX = e.touches[0].clientX - this.touchStartX;
      const dirY = e.touches[0].clientY - this.touchStartY;
      const dirLength = Math.sqrt(dirX * dirX + dirY * dirY);
      const dirNormalizedX = dirX / dirLength;
      const dirNormalizedY = dirY / dirLength;

      const angle = Math.atan2(dirNormalizedY, dirNormalizedX);
      let degrees = (360 + Math.round((180 * angle) / Math.PI)) % 360;
      if (this.rotating) {
        this.rotation = degrees;
      }

      if (this.holdingPaper) {
        if (!this.rotating) {
          this.currentPaperX += this.velX;
          this.currentPaperY += this.velY;
        }
        this.prevTouchX = this.touchMoveX;
        this.prevTouchY = this.touchMoveY;

        this.paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
      }
    });
  }

  handleTouchStart() {
    this.paper.addEventListener('touchstart', (e) => {
      if (this.holdingPaper) return;
      this.holdingPaper = true;

      // Hover effect logic here
      this.paper.classList.add('hover-effect');

      this.paper.style.zIndex = highestZ;
      highestZ += 1;

      this.touchStartX = e.touches[0].clientX;
      this.touchStartY = e.touches[0].clientY;
      this.prevTouchX = this.touchStartX;
      this.prevTouchY = this.touchStartY;
    });
  }

  handleTouchEnd() {
    this.paper.addEventListener('touchend', () => {
      this.holdingPaper = false;
      this.rotating = false;

      // Remove hover effect on touchend
      this.paper.classList.remove('hover-effect');
    });
  }

  handleGestureEvents() {
    // Handle two-finger rotation on touch screens
    this.paper.addEventListener('gesturestart', (e) => {
      e.preventDefault();
      this.rotating = true;
    });
    this.paper.addEventListener('gestureend', () => {
      this.rotating = false;
    });
  }
}

// Apply to all .paper elements
const papers = Array.from(document.querySelectorAll('.paper'));
papers.forEach(paper => {
  new Paper(paper);
});
