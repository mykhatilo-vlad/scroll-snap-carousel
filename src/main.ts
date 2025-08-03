import './style.css';

class ScrollSnapSlider extends HTMLElement {
  itemsWrapper: HTMLElement | null = null;
  items: HTMLCollection | null = null;
  itemsLength: number = 0;
  arrowsWrapper: HTMLElement | null = null;
  arrowPrev: HTMLElement | null = null;
  arrowNext: HTMLElement | null = null;

  currentIndex: number = 0;

  constructor() {
    super();
  }

  connectedCallback() {
    this.itemsWrapper = this.querySelector('[is="slider-items"]');
    this.arrowsWrapper = this.querySelector('[is="slider-arrows"]');
    this.arrowPrev = this.querySelector('[is="slider-prev"]');
    this.arrowNext = this.querySelector('[is="slider-next"]');

    this.renderItems();

    this.arrowPrev?.addEventListener('click', this.slidePrev);
    this.arrowNext?.addEventListener('click', this.slideNext);
  }

  disconnectedCallback() {

  }

  renderItems = () => {
    if (this.itemsWrapper) {
      const items = Array.from({ length: 10 }, (_, i) => {
        return `<div class="slide-card ">Item ${i + 1}</div>`;
      });

      this.itemsWrapper.innerHTML = items.join('');
      this.items = this.itemsWrapper.children;
      this.itemsLength = this.items.length;
    }
  }

  slidePrev = () => {
    if (this.isScrolledToEnd()) {
      this.findClosestToStart();
    }

    this.currentIndex = this.currentIndex > 0 ? --this.currentIndex : (this.itemsLength - 1);
    this.slideTo(this.currentIndex);
  }

  slideNext = () => {
    if (this.isScrolledToEnd()) {
      this.currentIndex = this.itemsLength - 1;
    }

    this.currentIndex = this.currentIndex < (this.itemsLength - 1) ? ++this.currentIndex : 0;
    this.slideTo(this.currentIndex);
  }

  slideTo = (index: number) => {

    if (this.items) {
      const item = this.items[index];
      item?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'start'
      });
    }
  }

  findClosestToStart = () => {
    if (!this.itemsWrapper || !this.items) return;

    const scrollledLeft = this.itemsWrapper.scrollLeft;
    let closestIndex = this.itemsLength - 1;

    for (let i = this.itemsLength - 1; i >= 0; i--) {
      const item = this.items.item(i) as HTMLElement;
      const itemLeft = item.offsetLeft;

      if (itemLeft >= scrollledLeft) {
        closestIndex = i;
      } else {
        break;
      }
    }

    this.currentIndex = closestIndex;
  }

  isScrolledToEnd = () => {
    if (!this.itemsWrapper) return false;
    return this.itemsWrapper.scrollWidth === this.itemsWrapper.scrollLeft + this.itemsWrapper.clientWidth;
  }
}

customElements.define('scroll-snap-slider', ScrollSnapSlider);


