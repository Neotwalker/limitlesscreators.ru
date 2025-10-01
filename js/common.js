"use strict";

document.addEventListener("DOMContentLoaded", () => {
	// Cookies Banner
	const cookiesBanner = document.querySelector('.cookies');
	const cookiesButton = document.querySelector('.cookies--button');
	if (cookiesBanner && cookiesButton) {
		if (!localStorage.getItem('cookieConsent')) {
			cookiesBanner.classList.add('active');
		}
		cookiesButton.addEventListener('click', () => {
			localStorage.setItem('cookieConsent', 'true');
			cookiesBanner.classList.remove('active');
		});
	}

	// Modal Handling
	function getScrollbarWidth() {
		return window.innerWidth - document.documentElement.clientWidth;
	}

	// Header Scroll and Scroll-to-Top
	const header = document.querySelector('.header');
	const topButton = document.querySelector('.top');
	// Modal
	const modal = document.querySelector('.modal');
	const modalSend = document.querySelector('.modal--send');
	const scrollbarWidth = getScrollbarWidth();
	// Burger Menu
	const burgerMenu = document.querySelector('.burger');
	const headerMenu = document.querySelector('.header--menu');
	const menu = document.querySelector('.header--menu .menu');
	// Header Scroll and Scroll-to-Top
	if (header && topButton) {
		const checkScroll = () => {
			header.classList.toggle('scroll', window.scrollY > 40);
			topButton.classList.toggle('scroll', window.scrollY > 500);
		};
		checkScroll();
		window.addEventListener('load', checkScroll);
		window.addEventListener('scroll', checkScroll);
		topButton.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
	}
	// Burger Menu Functions
	function toggleMenu() {
		const isActive = !headerMenu.classList.contains('open');
		headerMenu.classList.toggle('open');
		burgerMenu.classList.toggle('active');
		menu.classList.toggle('active', isActive);
		if (isActive) {
			document.documentElement.classList.add('overflow');
			if (scrollbarWidth > 0) {
				header.style.paddingRight = `${scrollbarWidth}px`;
				document.body.style.paddingRight = `${scrollbarWidth}px`;
			}
		} else {
			if (!modal?.classList.contains('active')) {
				document.documentElement.classList.remove('overflow');
				header.style.paddingRight = '';
				document.body.style.paddingRight = '';
			}
		}
		if (window.innerWidth <= 1200) {
			document.querySelectorAll('.sub-menu').forEach(subMenu => {
				subMenu.classList.remove('active');
				const parentLi = subMenu.closest('.menu-item-has-children');
				if (parentLi) parentLi.classList.remove('active');
			});
		}
	}
	function closeMenu() {
		burgerMenu.classList.remove('active');
		headerMenu.classList.remove('open');
		menu.classList.remove('active');
		if (!modal?.classList.contains('active')) {
			document.documentElement.classList.remove('overflow');
			header.style.paddingRight = '';
			document.body.style.paddingRight = '';
		}
		if (window.innerWidth <= 1200) {
			document.querySelectorAll('.sub-menu').forEach(subMenu => {
				subMenu.classList.remove('active');
				const parentLi = subMenu.closest('.menu-item-has-children');
				if (parentLi) parentLi.classList.remove('active');
			});
		}
	}
	function toggleSubMenu(subMenu, item) {
		if (window.innerWidth > 1200) {
			subMenu.classList.toggle('active');
			item.classList.toggle('active');
			return;
		}
		const isActive = subMenu.classList.contains('active');
		const parentSubMenu = item.closest('.sub-menu');
		const siblingSubMenus = parentSubMenu
			? parentSubMenu.querySelectorAll('.sub-menu.active')
			: menu.querySelectorAll('.sub-menu.active');
		const siblingItems = parentSubMenu
			? parentSubMenu.querySelectorAll('.menu-item-has-children.active')
			: menu.querySelectorAll('.menu-item-has-children.active');

		siblingSubMenus.forEach(m => {
			m.classList.remove('active');
		});
		siblingItems.forEach(m => {
			m.classList.remove('active');
		});

		subMenu.classList.toggle('active', !isActive);
		item.classList.toggle('active', !isActive);
	}
	if (burgerMenu && headerMenu && menu && header) {
		burgerMenu.addEventListener('click', (e) => {
			e.stopPropagation();
			toggleMenu();
		});
		document.querySelectorAll('.header--menu .menu li a').forEach(link => {
			link.addEventListener('click', (e) => {
				e.stopPropagation();
				console.log('Link clicked:', link.getAttribute('href')); // Для отладки
				if (!link.getAttribute('href').startsWith('#')) {
					window.location.href = link.getAttribute('href');
				} else {
					closeMenu();
				}
			});
		});
		function setupSubMenuHandlers() {
			const menuItems = document.querySelectorAll('.header--menu .menu-item-has-children');
			menuItems.forEach(item => {
				item.removeEventListener('click', handleSubMenuClick);
				if (window.innerWidth <= 1200) {
					item.addEventListener('click', handleSubMenuClick);
				}
			});
		}
		function handleSubMenuClick(e) {
			if (!e.target.closest('a')) {
				e.preventDefault();
				e.stopPropagation();
				const subMenu = this.querySelector('.sub-menu');
				if (subMenu) toggleSubMenu(subMenu, this);
			}
		}
		setupSubMenuHandlers();
		window.addEventListener('resize', () => {
			const subMenus = document.querySelectorAll('.sub-menu.active');
			if (window.innerWidth > 1200) {
				subMenus.forEach(subMenu => {
					subMenu.classList.remove('active');
					const parentLi = subMenu.closest('.menu-item-has-children');
					if (parentLi) parentLi.classList.remove('active');
				});
				menu.classList.remove('active');
			} else {
				if (headerMenu.classList.contains('open')) {
					menu.classList.add('active');
				}
			}
			setupSubMenuHandlers();
		});
	}
	if (modal && header) {
		document.querySelectorAll('.modal--open').forEach(button => {
			button.addEventListener('click', (e) => {
				e.preventDefault();
				document.querySelector('.modal--general')?.classList.add('active');
				document.documentElement.classList.add('overflow');
				if (scrollbarWidth > 0) {
					header.style.paddingRight = `${scrollbarWidth}px`;
					document.body.style.paddingRight = `${scrollbarWidth}px`;
				}
			});
		});
		document.querySelectorAll('.modal--close').forEach(close => {
			close.addEventListener('click', (e) => {
				e.stopPropagation(); // Останавливаем распространение события
				console.log('Closing modal, headerMenu open:', headerMenu?.classList.contains('open')); // Отладка
				modal.classList.remove('active');
				modalSend?.classList.remove('active');
				if (!headerMenu?.classList.contains('open')) {
					document.documentElement.classList.remove('overflow');
					header.style.paddingRight = '';
					document.body.style.paddingRight = '';
				}
			});
		});
	}
	document.addEventListener('click', (e) => {
		// Закрытие модального окна
		if (
			modal?.classList.contains('active') &&
			!e.target.closest('.modal--open') &&
			!e.target.closest('.modal .modal--wrapper') &&
			!e.target.closest('.modal .modal--close')
		) {
			console.log('Click outside modal, headerMenu open:', headerMenu?.classList.contains('open')); // Отладка
			modal.classList.remove('active');
			modalSend?.classList.remove('active');
			if (!headerMenu?.classList.contains('open')) {
				document.documentElement.classList.remove('overflow');
				header.style.paddingRight = '';
				document.body.style.paddingRight = '';
			}
		}

		// Закрытие бургер-меню
		if (
			burgerMenu?.classList.contains('active') &&
			!e.target.closest('.header--menu') &&
			!e.target.closest('.burger') &&
			!e.target.closest('.modal') // Проверяем весь .modal, независимо от .active
		) {
			console.log('Closing burger menu'); // Отладка
			closeMenu();
		}

		// Закрытие подменю при клике вне меню на мобильных устройствах
		if (
			window.innerWidth <= 1200 &&
			headerMenu?.classList.contains('open') &&
			!e.target.closest('.header--menu') &&
			!e.target.closest('.modal') // Проверяем весь .modal, независимо от .active
		) {
			document.querySelectorAll('.sub-menu.active').forEach(subMenu => {
				subMenu.classList.remove('active');
				const parentLi = subMenu.closest('.menu-item-has-children');
				if (parentLi) parentLi.classList.remove('active');
			});
		}
	});

	// Input Name Validation
	const fioInputs = document.querySelectorAll('input[name="fio"], input[name="fio1"]');
	fioInputs.forEach(input => {
		input.addEventListener('keyup', () => {
			input.value = input.value.replace(/http|https|url|www|\.net|\.ru|\.com|[0-9]/gi, '');
		});
	});
	// Phone Input Mask
	const phoneInputs = document.querySelectorAll('.wpcf7-tel');
	const applyPhoneMask = (e) => {
		const el = e.target;
		const clearVal = el.dataset.phoneClear;
		const pattern = el.dataset.phonePattern || '+_(___) ___-__-__';
		const def = pattern.replace(/\D/g, '');
		let val = el.value.replace(/\D/g, '');
		if (clearVal !== 'false' && e.type === 'blur' && val.length < pattern.match(/[\_\d]/g).length) {
				el.value = '';
				return;
		}
		if (def.length >= val.length) val = def;
		let i = 0;
		el.value = pattern.replace(/./g, a => /[_\d]/.test(a) && i < val.length ? val.charAt(i++) : i >= val.length ? '' : a);
	};
	phoneInputs.forEach(input => ['input', 'blur', 'focus'].forEach(ev => input.addEventListener(ev, applyPhoneMask)));
	// Form Checkboxes
	const setupCheckbox = (checkboxId, buttonSelector) => {
		const checkbox = document.getElementById(checkboxId);
		const button = document.querySelector(buttonSelector);
		if (checkbox && button) {
			button.setAttribute('disabled', 'disabled');
			checkbox.addEventListener('change', () => {
				button.toggleAttribute('disabled', !checkbox.checked);
			});
		}
	};
	setupCheckbox('check', '.modal--general button');
	setupCheckbox('check1', '.main--contacts__left form button');
	// Form Submission
	document.querySelectorAll('.wpcf7-form').forEach(form => {
		form.addEventListener('submit', () => {
			document.addEventListener('wpcf7mailsent', (e) => {
				form.querySelector('.cf7sg-response-output')?.style.setProperty('display', 'none');
				document.querySelectorAll('.modal').forEach(m => m.classList.remove('active'));
				if (modalSend) {
					modalSend.classList.add('active');
					setTimeout(() => {
						modalSend.classList.remove('active');
						if (!headerMenu?.classList.contains('open')) {
							document.documentElement.classList.remove('overflow');
							header.style.paddingRight = '';
							document.body.style.paddingRight = '';
						}
					}, 5000);
				}
				form.querySelector('.wpcf7-submit')?.setAttribute('disabled', 'disabled');
				form.reset();
			}, { once: true });
		});
	});

	// Footer Menu (Mobile)
	if (window.innerWidth <= 768) {
		document.querySelectorAll('.footer--menu').forEach((menu, index) => {
			const title = menu.querySelector('.h3');
			const list = menu.querySelector('.menu');
			if (title && list) {
				if (index === 0) {
					menu.classList.add('active');
					list.style.maxHeight = `${list.scrollHeight}px`;
				}
				title.addEventListener('click', () => {
					document.querySelectorAll('.footer--menu').forEach(m => {
						if (m !== menu) {
							m.classList.remove('active');
							m.querySelector('.menu').style.maxHeight = null;
						}
					});
					menu.classList.toggle('active');
					list.style.maxHeight = menu.classList.contains('active') ? `${list.scrollHeight}px` : null;
				});
			}
		});
	}

	// Project Tags
	const tags = document.querySelectorAll('.main--cases__tags .tag');
	const cases = document.querySelectorAll('.main--cases__block');
	if (tags.length && cases.length) {
		tags.forEach(tag => {
			tag.addEventListener('click', () => {
				tags.forEach(t => t.classList.remove('active'));
				tag.classList.add('active');
				const filter = tag.getAttribute('data-filter');
				cases.forEach((block, index) => {
					block.classList.toggle('active', filter === '*' ? index === 0 : block.getAttribute('data-type') === filter);
				});
			});
		});
	}

	// Smooth Height for FAQ
	const smoothHeight = (itemSelector, buttonSelector, contentSelector) => {
		const items = document.querySelectorAll(itemSelector);
		if (!items.length) return;

		const firstItem = items[0];
		const firstButton = firstItem.querySelector(buttonSelector);
		const firstContent = firstItem.querySelector(contentSelector);
		if (firstButton && firstContent) {
			firstItem.classList.add('active');
			firstButton.classList.add('active');
			firstItem.dataset.open = 'true';
			firstContent.style.maxHeight = `${firstContent.scrollHeight}px`;
		}

		// Функция для получения высоты шапки динамически
		const getHeaderHeight = () => {
			const header = document.querySelector('.header'); // Замените на селектор вашей шапки
			return header ? header.offsetHeight : 0;
		};

		items.forEach(item => {
			const button = item.querySelector(buttonSelector);
			const content = item.querySelector(contentSelector);
			if (button && content) {
				button.addEventListener('click', () => {
					const isOpen = item.dataset.open === 'true';
					items.forEach(i => {
						if (i !== item) {
							i.dataset.open = 'false';
							i.classList.remove('active');
							i.querySelector(buttonSelector)?.classList.remove('active');
							i.querySelector(contentSelector).style.maxHeight = '';
						}
					});
					item.dataset.open = isOpen ? 'false' : 'true';
					item.classList.toggle('active', !isOpen);
					button.classList.toggle('active', !isOpen);
					content.style.maxHeight = isOpen ? '' : `${content.scrollHeight}px`;

					// Прокрутка к началу активного блока, если он открыт
					if (!isOpen) {
						setTimeout(() => {
							const rect = item.getBoundingClientRect();
							const isFullyVisible =
								rect.top >= 0 &&
								rect.bottom <= (window.innerHeight || document.documentElement.clientHeight);

							if (!isFullyVisible) {
								const headerHeight = getHeaderHeight();
								const scrollPosition = window.scrollY + rect.top - headerHeight - 10; // Добавляем отступ 10px
								window.scrollTo({
									top: scrollPosition,
									behavior: 'smooth',
								});
							}
						}, 300); // Задержка для завершения анимации открытия
					}
				});

				window.addEventListener('resize', () => {
					if (item.dataset.open === 'true' && parseInt(content.style.maxHeight) !== content.scrollHeight) {
						content.style.maxHeight = `${content.scrollHeight}px`;
					}
				});
			}
		});
	};
	smoothHeight('.main--faq__item', '.main--faq__item--button', '.main--faq__item--answer');

	// анимации при появлении
	const headitems = document.querySelectorAll(".main--header__info");
	const headobserver = new IntersectionObserver((entries) => {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
				entry.target.classList.add("visible");
			}
		});
	}, {
		threshold: 0.2 // 20% блока должно быть видно, чтобы активировать
	});
	headitems.forEach(item => headobserver.observe(item));

	const advitems = document.querySelectorAll(".main--adv__wrapper .item, .main--adv .h2, .main--services .h2, .main--services .subtitle, .main--services__wrapper");
	const advobserver = new IntersectionObserver((entries) => {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
				entry.target.classList.add("visible");
			} else {
				entry.target.classList.remove("visible");
			}
		});
	}, {
		threshold: 0.2 // 20% блока должно быть видно, чтобы активировать
	});
	advitems.forEach(item => advobserver.observe(item));

	const compitems = document.querySelectorAll(".main--companies");
	const compobserver = new IntersectionObserver(entries => {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
				entry.target.classList.add("visible");
			} else {
				entry.target.classList.remove("visible");
			}
		});
	}, { threshold: 0.2 });
	compitems.forEach(item => compobserver.observe(item));

});