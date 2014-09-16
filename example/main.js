
    function add_border(opts) { 
        $('img').css('border',opts.border+'px black solid') 
    }

    $('#process-btn').click(function() {
        var text = $.textForce($('#textarea-example').val(), {
            autolink_class: 'mylink',
            destiny: '#result',
            imagepreview_width:null,
            imagepreview_class: 'my-image'
        });
        
    })
