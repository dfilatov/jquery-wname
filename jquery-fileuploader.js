/**
 * Crossdomain fileuploader plugin 1.0.0
 *
 * Copyright (c) 2011 Filatov Dmitry (dfilatov@yandex-team.ru)
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 */

(function($) {

var cnt = 1;

$.fileUpload = function(url, settings) {

	var id = '__target_' + (cnt++),
		iframe = $('<iframe name="' + id + '"/>')
			.css('display', 'none')
			.load(function() {
				var frameWin = iframe[0].contentWindow ||
						(iframe[0].contentDocument && iframe[0].contentDocument.window);

				iframe
					.unbind()
					.load(function() {
						var resp, callback = 'error';
						try {
							(resp = $.parseJSON(frameWin.name)) && (callback = 'success');
						}
						catch(e) {
							resp = { error : 'internal' };
						}
						iframe.remove();
						settings[callback] && settings[callback](resp);
					});

				frameWin.location = 'about:blank';
			})
			.appendTo('body'),
		form = $('<form/>')
			.css('display', 'none')
			.attr({
				action   : url,
				method   : 'post',
				target   : id,
				enctype  : 'multipart/form-data',
				encoding : 'multipart/form-data'
			});

	$.each(settings.data, function(name, val) {
		form.append(val.attr && val.attr('type') == 'file'?
			val.replaceWith(val.clone(true, true)) :
			$('<input/>').attr({ type  : 'hidden', name  : name, value : val }));
	});

	form
		.appendTo('body')
		.submit()
		.remove();

};

})(jQuery);