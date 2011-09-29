jQuery-jsonw plugin
===================
What's this?
------------
It's window.name-based transport for jQuery.Ajax with crossdomain file's uploading support

How use?
------------
	$.ajax(
		'http://your-upload-url/',
		{
			files   : $('input[type=file]'),
			success : function(data) {
				// files loaded
			},
			// another usual ajax options
		});

On success response must put answer in window.name as json. Response's example:

	<script type="text/javascript">window.name='{"status":"ok","size":1024}';</script>

