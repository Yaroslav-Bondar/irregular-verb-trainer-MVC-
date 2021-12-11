const trainer = document.querySelector('.trainer');
const statistics = document.querySelector('.statistics');
const header = document.querySelector('.header');
function setHeight(a, b, width) {
    if(window.innerWidth <= width) {
        a.style.height = b.offsetHeight + 'px';
    }
    else {
        a.style.height = ''; 
    }
}
function setTop(a, b, width) {
    if(window.innerWidth <= width) {
        a.style.top = b.offsetHeight + 'px';
    }
    else {
        a.style.top = '';
    }
}
setTop(statistics, header, 565);
setHeight(statistics, trainer, 565)
window.addEventListener('resize', ()=> {
    setTop(statistics, header, 565);
    setHeight(statistics, trainer, 565);
});
// if(window.innerWidth <= 565) {
//     setHeight(statistics, trainer);
// }    