console.log("%c%s", "color: #68838B; font-size: 18px;", "\\\\\\\\\\\\\\\\\\\\//////////");
console.log("%c%s", "color: #68838B; font-size: 18px;", "samuelgregory@me.com");
console.log("%c%s", "color: #68838B; font-size: 18px;", "//////////\\\\\\\\\\\\\\\\\\\\");

function hideShow(divid, content) {

	var target = $('.'+divid);

	if (content) {
		target = target.clone().text(content);
	}
	

	card = target.find('.contact-card');

	target.toggle();

	card.css({
		left: ($(window).width()/2) - (card.outerWidth()/2),
		top: ($(window).height()/2) - (card.outerHeight()/2),
	});

}

var tooltip = $('.tooltip'),
	headerHeight = $('.header').height(),
	touch = ('ontouchstart' in window) || (window.DocumentTouch && document instanceof DocumentTouch),
	theWindow = $(window),
	windowHeight = theWindow.height(),
	theFooter = $('.footer-wrap');

if (touch) $('body').addClass('touch');
		
// Contact-wrapper
$('.references, .contact-wrapper').click(function(e) {
	if (!$(e.target).parents('.contact-card').length) {
		e.preventDefault();
		hideShow('contact-wrapper');
	}
});

$('#workModal').on('show.bs.modal', function (event) {
  var button = $(event.relatedTarget);
  
  $(this).find('.modal-body').text(button.data('content'));
  $(this).find('.modal-header').html('<h4 class="modal-title">' + button.find('img').attr('alt') + '</h4>');
});

theWindow.resize(function() {
	if ($('.contact-card').length) {
		$('.contact-card').css('left', ($(window).width()/2) - ($('.contact-card').outerWidth()/2));
	}
});

// Tooltips
if (!touch) {
	$('.job-list').on('hover', 'a[data-img]', function(e) {
		var target = $(this),
			img = target.data('img');

		if (e.type === 'mouseenter') {
			tooltip.find('img').attr('src', '../images/' + img + '.jpg');
			target.parent().append(tooltip.show());
			
			if ((tooltip.offset().top + tooltip.outerHeight()) > (theWindow.scrollTop() + theWindow.height())) tooltip.css({ 'bottom': 30, 'top': 'auto'})
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

// Navigation
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


$('.show-more').each(function() {
	var body = $(this).find('.more'),
			trigger = $(this).find('.more-trigger');

	trigger.on('click', function(e) {
		if (!$(e.currentTarget).is('h2')) e.preventDefault();
		body.toggleClass('show');
		trigger.toggleClass('body-show');
	});		
});

$('.show-more').each(function() {
	var body = $(this).find('.more'),
			trigger = $(this).find('.more-trigger');

	trigger.on('click', function(e) {
		if (!$(e.currentTarget).is('h2')) e.preventDefault();
		body.toggleClass('show');
		trigger.toggleClass('body-show');
	});		
});

setTimeout(function() {
	document.querySelector('.pro-pic').classList.add('pro-pic--animate');
}, 100);
