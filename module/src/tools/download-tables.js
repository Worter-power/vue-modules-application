import tableDownload from './download-table.js';
import dataDownload from './download-data.js';
import elementTableDownload from './download-element.js';

export default (el, binding) => {
    el.onclick = function () {
        let _options = binding.value;
        el.onblur = function () {
            let hasIcon
            for (let i = 0; i < el.children.length; i++) {
                if (el.children[i].children) {
                    for (let a = 0; a < el.children[i].children.length; a++) {
                        if (el.children[i].children[a].getAttribute('class').indexOf('el-icon') != -1) {
                            el.children[i].children[a].classList.add("el-icon-loading")
                            hasIcon = true
                        }
                    }
                }
            }
            if (!hasIcon) {
                var newItem = document.createElement("I")
                if (el.querySelectorAll("i.el-icon-loading").length == 0) {
                    newItem.innerHTML = '<i class="el-icon-loading"></i>'
                    if(el.children && el.children.length >0 ){
                        el.children[0].insertBefore(newItem, el.children[0].children[0]);
                    }
                }
            }
        }
        // 按钮停止loading
        _options.unloading = () => {
            for (let i = 0; i < el.children.length; i++) {
                if (el.children[i].children) {
                    for (let a = 0; a < el.children[i].children.length; a++) {
                        if (el.children[i].children[a].getAttribute('class') == 'el-icon-loading') {
                            el.children[i].children[a].innerHTML = ""
                        } else {
                            el.children[i].children[a].classList.remove("el-icon-loading")
                        }
                    }
                }
            }
        }
        // 提交下载表格
        _options.submit = (_opt, _html) => {
            var newItem = document.createElement("FORM")
            newItem.setAttribute('class', 'table2xls')
            newItem.setAttribute('method', 'post')
            newItem.setAttribute('style', 'position: absolute;top:-1000px;display:none;')
            newItem.setAttribute('action', window.ShiYue.base + '/api/base/common/table2xls')
            newItem.innerHTML = '<form>'
                + '<input type="hidden" name="title" value="' + (_opt.fileName || '下载') + '"/>'
                + '<textarea name="data" style="display:none">' + _html + '</textarea></form>'
            document.getElementsByTagName('body')[0].insertBefore(newItem, document.getElementsByTagName('body')[0].childNodes[0])
            document.querySelectorAll('.table2xls')[0].submit()
            document.getElementsByTagName('body')[0].removeChild(document.querySelectorAll('.table2xls')[0])
            setTimeout(function () {
                _options.unloading();
            }, 800);
        }
        // 数据表格
        if (_options.data) {
            dataDownload(Object.assign({}, _options, {
                el
            }));
            return false;
        } else {
            if (!_options || (!_options.table && (!_options.refs))) {
                el.onclick = null;
                el.onblur = null;
                return false;
            }
            let _tables = _options.tables,
                _refs = _options.refs;
            if (typeof _tables == 'undefined') {
                _tables = [];
                for (let key in _refs) {
                    if (key && key.indexOf('element-table-download') != -1) {
                        _tables.push(key);
                    }
                }
                _options.tables = _tables;
            }
            if (!_tables) {
                el.onclick = null;
                el.onblur = null;
                return false;
            }
            if (typeof _tables == 'string') {
                _options.tables = [_tables];
                _tables = _options.tables;
            }
            if (!_options.table && Object.prototype.toString.call(_tables) != "[object Array]") {
                el.onclick = null;
                el.onblur = null;
                return false;
            }
            // 非element表格
            if (_options.table) {
                tableDownload(
                    Object.assign({}, _options, {el})
                );
                return false;
            }
            // 默认为element表格下载
            elementTableDownload(
                Object.assign( {}, _options, { el }),
                 _refs, 
                 _tables
            );
        }
    };
}