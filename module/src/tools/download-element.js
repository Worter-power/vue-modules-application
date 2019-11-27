let _styles = {
    td: 'text-align: center;',
    th: 'text-align: center;font-weight: bold;'
};

/**
 * 解析表格上的download-options属性 （data-download-options可以给表格设置表头，也可以设置下载的文件的文件名）
 */
function parseOptions($table) {
    let _options = {},
        _s = $table.getAttribute('data-download-options') ? $table.getAttribute('data-download-options').replace(/^\s+|\s+$/g, '') : '';
    if (_s) {
        if (_s.substring(0, 1) != '{') {
            _s = '{' + _s + '}';
        }
        _options = (new Function('return ' + _s))();
    }
    return _options;
}

function parseHtml(_refs, _tables) {
    let _html = '';
    for(let i = 0; i < _tables.length; i++ ){
        var id = _tables[i],
            title;
        if (Object.prototype.toString.call(id) == '[object Object]') {
            id = _tables[i].id;
            title = _tables[i].title;
        }
        let _table = _refs[id];
        if (_table && Object.prototype.toString.call(_table) == '[object Array]') {
            _table = _table[0];
        }
        console.log(_table)
        if (!_table || _table.$options._componentTag != 'el-table' || !_table.$el) {
            return true;
        }
        let $el = _table.$el;
        let _options = parseOptions($el);
        if (_options && typeof _options.title != 'undefined') {
            title = _options.title;
        }
        let $body = $el.childNodes[2].getElementsByTagName("tbody")[0].cloneNode(true);
        $body.className = ''
        let $thead = $el.childNodes[1].getElementsByTagName("thead")[0].cloneNode(true);
        $thead.className = ''
        var maxColspan = 0
        // 表头
        for (let r = 0; r < $thead.getElementsByTagName('tr').length; r++) {
            let str = ''
            var colspanNum = 0
            for (let i = 0; i < $thead.getElementsByTagName('tr')[r].childNodes.length; i++) {
                let _node = $thead.getElementsByTagName('tr')[r].childNodes[i],
                    _nodeName = _node.tagName.toLocaleLowerCase();
                _node.setAttribute('colspan', parseInt(_node.getAttribute('colspan') || 1))
                _node.setAttribute('rowspan', parseInt(_node.getAttribute('rowspan') || 1))
                if (_node.className != 'gutter') {
                    str += '<'
                        + _nodeName
                        + ' colspan=' + _node.getAttribute('colspan')
                        + ' rowspan=' + _node.getAttribute('rowspan')
                        + ' style="' + _styles[_nodeName]
                        + '">'
                        + _node.getElementsByTagName('div')[0].innerText
                        + '</' + _nodeName + '>'
                }
                colspanNum += parseInt(_node.getAttribute('colspan') || 1)
            }
            if (colspanNum > maxColspan) {
                maxColspan = colspanNum
            }
            $thead.getElementsByTagName('tr')[r].innerHTML = str
        }
        // 表标题(data-download-options中的title可以设置多级表头，一个可以用字符串传，多级表头使用数组来传)
        if ($thead.getElementsByTagName('tr').length > 0 && title) {
            let _title = title
            if (Object.prototype.toString.call(title) != '[object Array]') {
                _title = [title]
            }
            for (let t = _title.length - 1; t >= 0; t--) {
                var newItem = document.createElement("TR")
                newItem.innerHTML = '<th' + ' colspan=' + maxColspan + ' style="' + _styles.th + '">' + _title[t] + '</th>'
                $thead.insertBefore(newItem, $thead.getElementsByTagName('tr')[0])
            }
        }
        // 表内容
        for (let r = 0; r < $body.getElementsByTagName('tr').length; r++) {
            let str = ''
            for (let i = 0; i < $body.getElementsByTagName('tr')[r].childNodes.length; i++) {
                let _node = $body.getElementsByTagName('tr')[r].childNodes[i],
                    _nodeName = _node.tagName.toLocaleLowerCase();
                    _node.setAttribute('colspan', parseInt(_node.getAttribute('colspan') || 1))
                    _node.setAttribute('rowspan', parseInt(_node.getAttribute('rowspan') || 1))
                if (_node.className && _node.className != 'gutter') {
                    str += '<'
                        + _nodeName
                        + ' colspan=' + _node.getAttribute('colspan')
                        + ' rowspan=' + _node.getAttribute('rowspan')
                        + ' style="' + _styles[_nodeName]
                        + '">'
                        + _node.getElementsByTagName('div')[0].innerText
                        + '</' + _nodeName + '>'
                }
            }
            $body.getElementsByTagName('tr')[r].innerHTML = str
        }

        _html += '<table>'
            + '<thead>' + $thead.innerHTML + '</thead>'
            + '<tbody>' + $body.innerHTML + '</tbody>'
            + '</table>'
    }
    return _html;
}

export default (_opt = {}, _refs, _tables) => {
    // 下载elment表格
    _opt.submit(_opt, parseHtml(_refs, _tables));
}