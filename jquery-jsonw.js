/**
 * Crossdomain fileuploader plugin 1.0.1
 * @requires jquery >= 1.5
 *
 * Copyright (c) 2011 Filatov Dmitry (dfilatov@yandex-team.ru)
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 */

(function($) {

$.ajaxPrefilter(function(opts) {
	if(opts.files && opts.files.length) {
		opts.dataTypes = [];
		return 'jsonw';
	}
});

var cnt = 1;

$.ajaxTransport('jsonw', function(opts, origOpts) {
	var iframe;
	return {
		send : function(_, completeCallback) {
			var id = '__target_' + (cnt++),
				form = $('<form/>')
					.css('display', 'none')
					.attr({
						action   : opts.url,
						method   : 'post',
						target   : id,
						enctype  : 'multipart/form-data',
						encoding : 'multipart/form-data'
					});

			iframe = $('<iframe name="' + id + '"/>')
				.css('display', 'none')
				.load(function() {
					var frameWin = iframe[0].contentWindow ||
							(iframe[0].contentDocument && iframe[0].contentDocument.window);

					iframe
						.unbind()
						.load(function() {
							var status = 503, statusText = 'ERROR', text;
							if(frameWin.name != id) {
								text = frameWin.name;
								status = 200;
								statusText = 'OK';
							}
							iframe.remove();
							completeCallback(status, statusText, { jsonw : $.parseJSON(text) });
						});

					frameWin.location = 'about:blank';
				})
				.appendTo('body');

			$.each($.extend({ _jsonw : 1 }, origOpts.data), function(name, val) {
				form.append($('<input/>').attr({ type  : 'hidden', name  : name, value : val }));
			});

			opts.files && $.each(opts.files, function(_, file) {
				form.append(file.replaceWith(file.clone(true, true)));
			});

			form
				.appendTo('body')
				.submit()
				.remove();

		},

		abort : function() {
			iframe && iframe
				.unbind()
				.attr('src', 'javascript:false');
		}
	}
});

})(jQuery);