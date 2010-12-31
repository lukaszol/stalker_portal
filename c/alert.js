/**
 * Alert.
 * @constructor
 */

function _alert(type){
    
    this.on = false;
    
    this.dom_obj = {};
    
    if (type){
        this.type = type
    }else{
        this.type = 'alert';
    }
    
    this.txt_container = {};
    
    this.hide_timer = 2000;
    this.hide_to;
    
    this.callback = function(){};
    this.cancel_callback = function(){};
    this.confirm_callback = function(){};
    
    this.queue = [];
    
    this.init();
}

_alert.prototype.init = function(){
    try{
        this.dom_obj = create_block_element('mb_info');
        
        var alert_outer = create_block_element('alert_outer', this.dom_obj);
        
        var alert_container = create_block_element(this.type + '_container', alert_outer);
        
        var table = document.createElement('table');
        alert_container.appendChild(table);
        
        var tr = document.createElement('tr');
        table.appendChild(tr);
        
        var td = document.createElement('td');
        td.setClass('mb_info_lt_head');
        tr.appendChild(td);
        
        td = document.createElement('td');
        td.setClass('mb_info_top_head');
        tr.appendChild(td);
        
        td = document.createElement('td');
        td.setClass('mb_info_rt_head');
        tr.appendChild(td);
        
        tr = document.createElement('tr');
        table.appendChild(tr);
        
        td = document.createElement('td');
        td.setClass('mb_info_lb');
        tr.appendChild(td);
        
        td = document.createElement('td');
        td.setClass('mb_info_main');
        tr.appendChild(td);
        
        var icon = create_block_element('ico_'+this.type, td);
        
        this.txt_container = create_inline_element('', td);
        
        td = document.createElement('td');
        td.setClass('mb_info_rb');
        tr.appendChild(td);
        
        this.hide();
    }catch(e){
        _debug(e);
    }
}

_alert.prototype.show = function(txt){
    _debug('_alert.show', txt);
    
    if (this.hide_to){
        window.clearTimeout(this.hide_to);
    }
    
    var txt = txt || 'empty';
    
    this.txt_container.innerHTML = txt;
    
    this.dom_obj.show();
    this.on = true;
    
    if (this.type == 'alert'){
        this.t_hide();
    }
}

_alert.prototype.push = function(msg){
    _debug('_alert.push');
    
    this.queue.push(msg);
    
    _debug('this.queue', this.queue);
    
    this.t_queue_handler();
}

_alert.prototype.queue_handler = function(){
    _debug('_alert.queue_handler');
    
    if (this.on){
        return;
    }
    
    if (this.queue.length > 0){
        
        _debug('this.queue before', this.queue);
        
        var msg = this.queue[0];
        
        _debug('msg', msg);
        _debug('typeof(msg)', typeof(msg));
        
        if (typeof(msg) == 'function'){
            var content = msg.call(window);
            _debug('content', content);

            this.show(content);
        }else if (typeof(msg) == 'string'){
            this.show(msg);
        }
        
        this.queue.splice(0, 1);
        
        _debug('this.queue before', this.queue);
    }
}

_alert.prototype.t_queue_handler = function(){
    _debug('_alert.t_queue_handler');
    
    var self = this;
    
    window.setTimeout(function(){self.queue_handler()}, 2000);
}

_alert.prototype.t_hide = function(){
    _debug('_alert.t_hide');
    
    var self = this;
    
    this.hide_to = window.setTimeout(function(){
        self.hide();
        
    }, this.hide_timer);
}

_alert.prototype.hide = function(){
    _debug('_alert.hide');
    
    this.dom_obj.hide();
    this.on = false;
    
    this.callback && this.callback();
    this.callback = function(){};
    
    this.t_queue_handler();
}

_alert.prototype.set_callback = function(callback){
    _debug('_alert.set_callback');
    
    this.callback = callback;
}

_alert.prototype.set_cancel_callback = function(callback){
    _debug('_alert.set_cancel_callback');
    
    this.cancel_callback = callback;
}

_alert.prototype.set_confirm_callback = function(callback){
    _debug('_alert.set_confirm_callback');
    
    this.confirm_callback = callback;
}

_alert.prototype.bind = function(){
    
    (function(){
        this.hide();
        this.confirm_callback && this.confirm_callback();
        this.confirm_callback = function(){};
    }).priority_bind(key.OK, this);
    
    (function(){
        this.hide();
        this.cancel_callback && this.cancel_callback();
        this.cancel_callback = function(){};
    }).priority_bind(key.EXIT, this);
    
}
