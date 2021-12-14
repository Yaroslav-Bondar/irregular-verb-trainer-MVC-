const trainer = document.querySelector('.trainer');
const statistics = document.querySelector('.statistics');
const header = document.querySelector('.header');

function setProperty(a, b, width, property) {
    if(window.innerWidth <= width) {
        a.style[`${property}`] = b.offsetHeight + 'px';
    }
    else {
        a.style[`${property}`] = ''; 
    }
}
setProperty(statistics, trainer, 565, 'height');
setProperty(statistics, header, 565, 'top');
window.addEventListener('resize', ()=> {
    setProperty(statistics, trainer, 565, 'height');
    setProperty(statistics, header, 565, 'top');
});
