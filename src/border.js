var borderLayout = function (root, onStateChanged) {
    var dragging;
    var area = {
        north: {element: root.querySelector('.north')},
        south: {element: root.querySelector('.south')},
        west: {element: root.querySelector('.west')},
        east: {element: root.querySelector('.east')},
        center: {element: root.querySelector('.center')}
    };
    setInitSize('north', root.offsetHeight);
    setInitSize('south', root.offsetHeight);
    setInitSize('west', root.offsetWidth);
    setInitSize('east', root.offsetWidth);
    redraw();
    addDrag('north', 'bottom', {left: '0', bottom: '0', width: '100%', cursor: 'ns-resize'}, function (e) {
        return this.origSize + e.clientY - this.origY;
    });
    addDrag('south', 'top', {left: '0', top: '0', width: '100%', cursor: 'ns-resize'}, function (e) {
        return this.origSize - e.clientY + this.origY;
    });
    addDrag('west', 'right', {right: '0', top: '0', height: '100%', cursor: 'ew-resize'}, function (e) {
        return this.origSize + e.clientX - this.origX;
    });
    addDrag('east', 'left', {left: '0', top: '0', height: '100%', cursor: 'ew-resize'}, function (e) {
        return this.origSize - e.clientX + this.origX;
    });
    root.addEventListener('mousemove', function (e) {
        if (dragging) {
            var target = area[dragging.target];
            target.size = Math.min(target.maxSize, Math.max(target.minSize, dragging.size(e)));
            redraw();
        }
    });
    root.addEventListener('mouseup', function (e) {
        dragEnded(onStateChanged);
    });
    root.addEventListener('mouseout', function (e) {
        if (e.target === root) {
            dragEnded(onStateChanged);
        }
    });

    return {
        resize: resize,
        maximize: maximize,
        minimize: minimize,
        hide: hide
    };

    function resize(size) {
        for (var prop in size) {
            area[prop].size = size[prop];
        }
        redraw();
    }

    function maximize(name) {
        setSize(name, area[name].maxSize);
    }

    function minimize(name) {
        setSize(name, area[name].minSize);
    }

    function hide(name) {
        setSize(name, 0);
    }

    function setSize(name, size) {
        area[name].size = size;
        redraw();
    }

    function setInitSize(name, parent) {
        var elem = area[name].element;
        if (elem) {
            area[name].size = unitToPx(elem.getAttribute('size') || '20%', parent);
            area[name].minSize = unitToPx(elem.getAttribute('min-size') || '5px', parent);
            area[name].maxSize = unitToPx(elem.getAttribute('max-size') || '40%', parent);
        }
    }

    function unitToPx(value, parent) {
        if (endsWith(value, 'px')) {
            return parseInt(value);
        }
        if (endsWith(value, '%')) {
            return parseInt(value) / 100 * parent;
        }
    }

    function endsWith(s, end) {
        return s.substring(s.length - end.length) === end;
    }

    function redraw() {
        setSizeAttr('north', {height: 'north'});
        setSizeAttr('south', {height: 'south'});
        setSizeAttr('west', {width: 'west', paddingTop: 'north', paddingBottom: 'south'});
        setSizeAttr('east', {width: 'east', paddingTop: 'north', paddingBottom: 'south'});
        setSizeAttr('center', {paddingTop: 'north', paddingLeft: 'west', paddingBottom: 'south', paddingRight: 'east'});
    }

    function setSizeAttr(target, value) {
        var elem = area[target].element;
        if (elem) {
            for (var prop in value) {
                elem.style[prop] = area[value[prop]].size + 'px';
            }
        }
    }

    function getSize(target, attr) {
        var elem = area[target].element;
        return elem && parseInt(elem[attr]);
    }

    function addDrag(name, dragSide, style, sizeFn) {
        var target = area[name].element;
        if (target && target.classList.contains('resizable')) {
            var drag = document.createElement('div');
            drag.className = 'drag';
            Object.assign(drag.style, style);
            target.appendChild(drag);
            var borderWidth = parseInt(getComputedStyle(drag)['border-width']);
            target.querySelector('.content').style['border' + capital(dragSide)] = 2 * borderWidth + 'px solid transparent';
            drag.addEventListener('mousedown', function (e) {
                dragging = {
                    target: name,
                    origX: e.clientX,
                    origY: e.clientY,
                    origSize: area[name].size
                };
                dragging.size = sizeFn.bind(dragging);
            });
        }
    }

    function capital(s) {
        return s.charAt(0).toUpperCase() + s.substring(1);
    }

    function dragEnded(listener) {
        if (dragging) {
            if (listener) {
                listener({
                    north: getSize('north', 'offsetHeight'),
                    south: getSize('south', 'offsetHeight'),
                    west: getSize('west', 'offsetWidth'),
                    east: getSize('east', 'offsetWidth')
                });
            }
            dragging = null;
        }
    }
};
