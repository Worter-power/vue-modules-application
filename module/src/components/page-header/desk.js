export default {
    directives: {
        // 放置容器指令
        drop: {
            bind(el, binding, vnode) {
                function hasClass(element, cls) {
                    return (" " + element.className + " ").indexOf(" " + cls + " ") > -1;
                }
                let getOffsetTop = function(dom) {
                    if (!hasClass(dom, 'drop')) {
                        getOffsetTop(dom.parentNode);
                    } else {
                        return dom;
                    }
                };

                let drag = {
                    // 初始化 drop
                    init: function() {
                        let me = this;
                        el.addEventListener('dragenter', me.onDragEnter, false);
                        el.addEventListener('dragover', me.onDragOver, false);
                        el.addEventListener('dragleave', me.onDragLeave, false);
                        el.addEventListener('drop', me.onDrop, false);
                    },
                    onDragEnter: function(e) {
                        let me = this;
                        let target = e.target;

                        target.classList.add('over')
                    },
                    onDragLeave: function(e) {
                        let target = e.target;
                        target.classList.remove('over')
                    },
                    onDragOver: function(e) {
                        e.preventDefault();
                        e.stopPropagation();
                    },
                    onDrop: function(e) {
                        e.preventDefault();
                        e.stopPropagation();
                        let data = JSON.parse(e.dataTransfer.getData('Text'));
                        let target = e.target;
                        target.classList.remove('over')
                        let tData = binding.value.row;
                        let argus = {
                            old: data,
                            offsetX: e.offsetX,
                            offsetY: e.offsetY,
                            target: tData
                        };
                        binding.value.set(argus);
                    }
                };
                drag.init()
            }
        },
        move: {
            bind(el, binding, vnode) {
                let drag = {
                    // 初始化
                    init: function() {
                        let me = this;
                        el.addEventListener('dragstart', me.onDragStart, false);
                        el.addEventListener('dragend', me.onDragEend, false);
                    },
                    onDragStart: function(e) {
                        el.classList.add('move')

                        console.log(1)
                        e.dataTransfer.setData('Text', JSON.stringify(binding.value.row));
                        console.log(2)
                    },
                    onDragEend: function(e) {
                        el.classList.remove('move')
                    },
                };
                drag.init()
            },
            update(el, binding, vnode) {
                let drag = {
                    // 初始化
                    init: function() {
                        let me = this;
                        el.addEventListener('dragstart', me.onDragStart, false);
                        el.addEventListener('dragend', me.onDragEend, false);
                    },
                    onDragStart: function(e) {
                        el.classList.add('move')
                        console.log(11)
                        e.dataTransfer.setData('Text', JSON.stringify(binding.value.row));
                        console.log(22)
                    },
                    onDragEend: function(e) {
                        el.classList.remove('move')
                    },
                };
                drag.init()
            }
        }
    },
}