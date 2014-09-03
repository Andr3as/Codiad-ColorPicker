/*
 *  Copyright (c) Codiad & Kent Safranski (codiad.com), distributed
 *  as-is and without warranty under the MIT License. See
 *  [root]/license.txt for more. This information must remain intact.
 */

(function(global, $){

    var codiad = global.codiad,
        scripts= document.getElementsByTagName('script'),
        path = scripts[scripts.length-1].src.split('?')[0],
        curpath = path.split('/').slice(0, -1).join('/')+'/';


    $(function() {    
        codiad.colorPicker.init();
    });

    codiad.colorPicker = {
        
        path: curpath,

        init: function() {
            var _this = this;

            $.loadScript(this.path+"color_parser.js");
            $.loadScript(this.path+"jquery.colorpicker.js");

            amplify.subscribe('active.onOpen', function(path){
                if (_this.isAtEnd(path, '.css')) {
                    var session = codiad.editor.getActive().getSession();
                    session.addEventListener('change', function(e){
                        _this.updateGutter();
                    });
                    session.addEventListener('changeScrollTop', function(top){
                        _this.updateGutter();
                        setTimeout(_this.updateGutter, 500);
                    });
                }
            });
            
            amplify.subscribe('active.onFocus', function(path){
                $('.ace_gutter-cell').css('background-color', '');
                if (_this.isAtEnd(path, '.css')) {
                    _this.updateGutter();
                }
            });

        },

        open: function() {

            codiad.modal.load(400, this.path+'dialog.php');

        },

        insert: function(type) {
            var color = '';
            if (type == 'rgb') {
                color = $('.colorpicker_rgb_r input')
                    .val() + ',' + $('.colorpicker_rgb_g input')
                    .val() + ',' + $('.colorpicker_rgb_b input')
                    .val();
                if (returnRGBWrapper === false) {
                    insert = (color);
                } else {
                    insert = ('rgb(' + color + ')');
                }
            } else {
                color = $('.colorpicker_hex input')
                    .val();
                if (sellength == 3 || sellength == 6) {
                    if (seltest) {
                        insert = color;
                    } else {
                        insert = '#' + color;
                    }
                } else {
                    insert = '#' + color;
                }
            }

            codiad.active.insertText(insert);
            codiad.modal.unload();

        },

        updateGutter: function() {
            $('.ace_gutter-cell').css('background-color', '');
            var editor  = codiad.editor.getActive();
            var content = codiad.editor.getContent().split("\n");
            var start   = editor.getFirstVisibleRow();
            var end     = editor.getLastVisibleRow();
            var tagPos, startPos, endPos;
            var value    = "";
            var element;
            if (end >= content.length) {
                return false;
            }
            for (var i = start; i < end; i++) {
                tagPos = content[i].indexOf("color");
                if (tagPos != -1) {
                    startPos = content[i].indexOf(":");
                    if (tagPos < startPos) {
                        endPos = content[i].indexOf(";");
                        value = content[i].substring(startPos + 1, endPos);
                        element = $('.ace_gutter-cell')[i-start];
                        $(element).css('background-color', value);
                    }
                }
            }
        },

        isAtEnd: function(string, needle) {
            if (string.lastIndexOf(needle) + needle.length == string.length) {
                return true;
            } else {
                return false;
            }
        }

    };

})(this, jQuery);