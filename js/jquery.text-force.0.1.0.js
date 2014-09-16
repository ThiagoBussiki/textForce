(function($) {
	$.textForce = function(text, options) {
		var settings = $.extend({
			autolink: true, // search link text and insert a <a href> tag
			autolink_class: null, // css class for <a> tag
			autolink_blank: true, // target=_blank
			imagepreview: true,   // show image preview
			imagepreview_width: 280,  // fix width image
			imagepreview_class: null, // css class for <img> tag
			replace_breakline:true,   // convert \n and \r to <p> and <br />
			youtube_show_thumb: true, // get a thumbnail from youtube url
			youtube_icon: 'youtube_icon', // 
            youtube_link_class: 'youtube_feed',
            allowed_shortcode: ['pipi','add_border'] // funcions shortcodes allowed

		}, options || {});
		var urlRegex =/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
		var imageRegex =  /\.(gif|png|jpe?g)$/i;
		var youtubeRegex = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
		var r = text;
		var getautolink_image = function(text, css_link_class) {			
			var result = text.replace(urlRegex, function(url) {			
				var css_string_link = settings.imagepreview_class ? "class='"+settings.imagepreview_class +"'":"";
				var blank_string = settings.autolink_blank ? "target='_blank'":"";
				var css_string_image = settings.imagepreview_class ? "class='"+settings.imagepreview_class +"'":"";
                var css_string_youtube = settings.youtube_icon ? "<span class='"+settings.youtube_icon+"'></span>":"";
                var css_string_link_youtube = settings.youtube_link_class ? "class='"+settings.youtube_link_class +"'":"";
				var width_string = settings.imagepreview_width ? "width='"+settings.imagepreview_width+"'":"";
				var url_img = null;
				if (imageRegex.test(url) && settings.imagepreview)
					return  "<a href='" + url + "' "+css_string_link+" "+blank_string+">" + "<img src='" + url + "' "+css_string_image+" "+width_string+" />" +"</a>";
				else if (youtubeRegex.test(url) && settings.youtube_show_thumb)
					return "<a href='" + url + "' "+css_string_link_youtube+" "+blank_string+">"+css_string_youtube+"<img src='http://img.youtube.com/vi/"+RegExp.$1+"/mqdefault.jpg' "+width_string+"/></a>"					
				else
					return "<a href='" + url + "' "+css_string_link_youtube+" "+blank_string+">" + url + "</a>";  
            });
			return result;
		}
		var replace_breakline = function(text) {
			if (text && typeof text==='string') {				
				text = text.replace(/\n{2}/g, '&nbsp;</p><p>');
				text = text.replace(/\n/g, '&nbsp;<br />');
				return '<p>'+text+'</p>';
			} else {
				return text;
			}
		}        
		var shortcode = function(text) {
            if (settings.allowed_shortcode && settings.allowed_shortcode.length>0) {
                $.each(settings.allowed_shortcode, function(idx, obj) {
                    if (window[obj] && typeof window[obj]==="function") {
                        var shortcodes = settings.allowed_shortcode.join("|");
                        var regex      = "(.?)\\[("+shortcodes+")\\b(.*?)(?:(\\/))?\\](?:(.+?)\\[\\/\\2\\])?(.?)";
                        var split_bits = new RegExp(regex,'igm'),                
                            bits = split_bits.exec(text);                                       
                        if (bits && settings.allowed_shortcode.indexOf(bits[2].trim())!==-1) {
                            var fn = bits[2].trim();
                            var split_arguments = /([a-zA-Z]+)="([^"]+)+"/gi
                            var arguments = split_arguments.exec( bits[3] );    
                            var regex_params = /(\w+)\s*=\s*"([^"]*)"(?:\s|$)|(\w+)\s*=\s*\'([^\']*)\'(?:\s|$)|(\w+)\s*=\s*([^\s\'"]+)(?:\s|$)|"([^"]*)"(?:\s|$)|(\S+)(?:\s|$)/g
                            var params = bits[3].match(regex_params);
                            var opt = {};
                            for (var i = 0; i < params.length; i++) {
                                var p = params[i].split('=');
                                var attr = p[0],
                                    value = p[1].substr(0,1) == '"' ? p[1].replace(/"/g,"") : parseInt(p[1])
                                opt[attr] = value;
                            }
                            if (window[fn] && typeof window[fn]==="function")
                                window[fn](opt);	
                        }
                    }
                });
            }
            return r.replace(/\[.*\]/ig,'');
        }				
		if (settings.autolink) r = getautolink_image(r,settings.autolink_class, settings.autolink_blank, settings.imagepreview_class, settings.imagepreview_width);
		if (settings.replace_breakline) r = replace_breakline(r);
        $(settings.destiny).html(r.replace(/\[.*\]/ig,'')); // executa o shortcode e remove do texto
		shortcode(r); // shortcode execute after all
		return r;
	}

})(jQuery);