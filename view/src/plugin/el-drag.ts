function mousedown(event: MouseEvent, node: string | HTMLElement) {
    event.stopPropagation();
    const el: HTMLElement = typeof (node) === 'string' ? document.querySelector(`#${node}`) as HTMLElement  : node
    el.style.zIndex = Math.round(new Date() as any / 1000).toString()
    const leftDifference = event.pageX - el.getBoundingClientRect().left;
    const topDifference = event.pageY - el.getBoundingClientRect().top;
    function mousemove(event: MouseEvent) {
        const top = event.pageY - topDifference;
        const left = event.pageX - leftDifference;
        el.style.transition = "none";
        el.style.left = (left <= 0 ? -4 : left) + "px";
        el.style.top = (top <= 0 ? -4 : top) + "px";
    }
    function mouseup() {
        document.removeEventListener("mousemove", mousemove);
        document.removeEventListener("mouseup", mouseup);
    }
    document.addEventListener("mousemove", mousemove);
    document.addEventListener("mouseup", mouseup);
}


export default mousedown