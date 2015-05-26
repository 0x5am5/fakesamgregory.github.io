$(function() {

	var tooltip = $('.tooltip'),
		headerHeight = $('.header').height(),
		touch = ('ontouchstart' in window) || (window.DocumentTouch && document instanceof DocumentTouch),
		theWindow = $(window),
		windowHeight = theWindow.height(),
		theFooter = $('.footer-wrap');

	if (touch) $('body').addClass('touch');
			
	$('.references, .contact-wrapper').click(function(e) {
		if (!$(e.target).parents('.contact-card').length) {
			e.preventDefault();
			hideShow('contact-wrapper');
		}
	});

	theWindow.resize(function() {
		if ($('.contact-card').length) {
			$('.contact-card').css('left', ($(window).width()/2) - ($('.contact-card').outerWidth()/2));
		}
	});

	if (!touch) {
		$('.job-list').on('hover', 'a[data-img]', function(e) {
			var target = $(this),
				img = target.data('img');

			if (e.type === 'mouseenter') {
				tooltip.find('img').attr('src', '../images/' + img + '.jpg');
				target.parent().append(tooltip.show());

				if ((tooltip.offset().top + tooltip.height()) > (theWindow.scrollTop() + theWindow.height())) tooltip.css({ 'bottom': 30, 'top': 'auto'})
			}
			else {
				tooltip.removeAttr('style');
				tooltip.find('img').attr('src', '../images/loading.gif');
			}
		});
		var t = setTimeout(function() {
			theFooter.removeClass('show');
		}, 2000);

		$(document).on('mousemove', function(e) {
			if (e.clientY > (windowHeight - 200)) {
					theFooter.addClass('show');
				} else {
					theFooter.removeClass('show');
				}
		});	
	};

	$('.nav-wrap').on('click', 'a', function(e) {
		e.preventDefault();

		var target = $(this),
			id = target.attr('href'),
			localY = $(id).offset().top,
			offset = theWindow.width() < 549 ? 0 : headerHeight;

		$('body').animate({
			scrollTop: localY - offset
		});
	});

	theWindow.on('scroll', function() {
		var currentpos = theWindow.scrollTop(),
			body = $('.section');

		$('.nav-wrap a').removeClass('active');
				
		body.each(function(i) {
			var target = $(this),
				top = target.position().top - (headerHeight + 20),
				bottom = target.offset().top + (target.height() - 150),
				index = target.index();

			if (currentpos > top && currentpos < bottom) {
				$('.nav-wrap li').eq(index).find('a').addClass('active');
			}

		});
	}).trigger('scroll');

	
});

function hideShow(divid) {

	var target = $('.'+divid);

		card = target.find('.contact-card');

		target.toggle();

		card.css({
			left: ($(window).width()/2) - (card.outerWidth()/2),
			top: ($(window).height()/2) - (card.outerHeight()/2),
		});

		// if (card.css('display', 'block')) {
		// 	$('.references').css({
		// 		'background': '#ccc',
		// 		'color': '#fff',
		// 	})
		// } 
		// if (card.css('display', 'none')) {
		// 	console.log('hi')
		// 	$('.references').removeAttr('style');
		// }

		// $('.contact-card ul').css('height', $(window).height() - ( $('.header').outerHeight() + $('.footer-wrap').outerHeight() ))

		if ( card.height > ($(window).height() - ( $('.header').height() + $('.footer-wrap').height() )) ) {
			console.log('hi')
		}
}