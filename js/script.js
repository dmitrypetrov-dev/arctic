const headerScroll = () => {
	const header = document.querySelector('.header');
	if (window.pageYOffset > 80) {
		header.classList.add('fixed');
	} else {
		header.classList.remove('fixed');
	}
};

window.addEventListener('scroll', headerScroll);

const menu = document.querySelector('.menu-burger'),
	menuBody = document.querySelector('.menu__body');

menu.addEventListener('click', () => {
	menu.classList.toggle('active');
	menuBody.classList.toggle('active');
	if (menuBody.classList.contains('active')) {
		document.body.style.overflowY = 'hidden';
	} else {
		document.body.style.overflowY = 'visible';
	}
});

function testWebP(callback) {

	var webP = new Image();
	webP.onload = webP.onerror = function () {
		callback(webP.height == 2);
	};
	webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
}

testWebP(function (support) {

	if (support == true) {
		document.querySelector('body').classList.add('webp');
	} else {
		document.querySelector('body').classList.add('no-webp');
	}
});

let isMobile = { Android: function () { return navigator.userAgent.match(/Android/i); }, BlackBerry: function () { return navigator.userAgent.match(/BlackBerry/i); }, iOS: function () { return navigator.userAgent.match(/iPhone|iPad|iPod/i); }, Opera: function () { return navigator.userAgent.match(/Opera Mini/i); }, Windows: function () { return navigator.userAgent.match(/IEMobile/i); }, any: function () { return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows()); } };

const paralaxAreas = document.querySelectorAll('.paralax-area');

if (!isMobile.any()) {
	if (paralaxAreas.length > 0) {
		for (paralaxArea of paralaxAreas) {
			const paralaxItem = document.querySelectorAll('.paralax-item');
			paralaxArea.addEventListener('mousemove', (e) => {
				const x = e.pageX / window.innerWidth,
					y = e.pageY / window.innerHeight;
				paralaxItem.forEach(item => {
					item.style.transform = 'translate(-' + x * 12 + 'px, -' + y * 12 + 'px)';
				});
			});
			paralaxArea.addEventListener('mouseenter', (e) => {
				paralaxItem.forEach(item => {
					item.style.transition = 'none';
				});
			});
			paralaxArea.addEventListener('mouseleave', (e) => {
				paralaxItem.forEach(item => {
					item.style.transform = 'translate(0,0)';
					item.style.transition = 'all 0.3s ease-in-out';
				});
			});
		}
	}
}

const animItems = document.querySelectorAll('.anim-items');

if (animItems.length > 0) {
	const animOnScroll = () => {
		for (animItem of animItems) {
			const animItemHeight = animItem.offsetHeight;
			const animItemOffset = offset(animItem).top;
			const animStart = 7;

			let animItemPoint = window.innerHeight - animItemHeight / animStart;

			if (animItemHeight > window.innerHeight) {
				animItemPoint = window.innerHeight - window.innerHeight / animStart;
			}

			if ((pageYOffset > animItemOffset - animItemPoint) && pageYOffset < (animItemOffset + animItemHeight)) {
				animItem.classList.add('active');
			} else {
				if (!animItem.classList.contains('anim-no-hide')) {
					animItem.classList.remove('active');
				}
			}
		}

		function offset(el) {
			const rect = el.getBoundingClientRect(),
				scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
				scrollTop = window.pageYOffset || document.documentElement.scrollTop;
			return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
		}
	};

	window.addEventListener('scroll', animOnScroll);

	setTimeout(() => {
		animOnScroll();
	}, 300);

}

if (document.querySelectorAll('.slider-partners').length > 0) {
	$(function () {
		$('.slider-partners').slick({
			arrows: false,
			dots: false,
			autoplay: true,
			variableWidth: true,
			centerMode: true,
			slidesToShow: 5,
			responsive: [
				{
					breakpoint: 769,
					settings: {
						centerMode: true,
						slidesToShow: 5,
					}
				},
				{
					breakpoint: 376,
					settings: {
						centerMode: true,
						centerPadding: '-40px',
						slidesToShow: 1,
					}
				},
			]
		});
	});
}

//================================================Adaptive js================================================================

(function () {
	let originalPositions = [];
	let daElements = document.querySelectorAll('[data-da]');
	let daElementsArray = [];
	let daMatchMedia = [];
	//Заполняем массивы
	if (daElements.length > 0) {
		let number = 0;
		for (let index = 0; index < daElements.length; index++) {
			const daElement = daElements[index];
			const daMove = daElement.getAttribute('data-da');
			if (daMove != '') {
				const daArray = daMove.split(',');
				const daPlace = daArray[1] ? daArray[1].trim() : 'last';
				const daBreakpoint = daArray[2] ? daArray[2].trim() : '767';
				const daType = daArray[3] === 'min' ? daArray[3].trim() : 'max';
				const daDestination = document.querySelector('.' + daArray[0].trim())
				if (daArray.length > 0 && daDestination) {
					daElement.setAttribute('data-da-index', number);
					//Заполняем массив первоначальных позиций
					originalPositions[number] = {
						"parent": daElement.parentNode,
						"index": indexInParent(daElement)
					};
					//Заполняем массив элементов 
					daElementsArray[number] = {
						"element": daElement,
						"destination": document.querySelector('.' + daArray[0].trim()),
						"place": daPlace,
						"breakpoint": daBreakpoint,
						"type": daType
					}
					number++;
				}
			}
		}
		dynamicAdaptSort(daElementsArray);

		//Создаем события в точке брейкпоинта
		for (let index = 0; index < daElementsArray.length; index++) {
			const el = daElementsArray[index];
			const daBreakpoint = el.breakpoint;
			const daType = el.type;

			daMatchMedia.push(window.matchMedia("(" + daType + "-width: " + daBreakpoint + "px)"));
			daMatchMedia[index].addListener(dynamicAdapt);
		}
	}
	//Основная функция
	function dynamicAdapt(e) {
		for (let index = 0; index < daElementsArray.length; index++) {
			const el = daElementsArray[index];
			const daElement = el.element;
			const daDestination = el.destination;
			const daPlace = el.place;
			const daBreakpoint = el.breakpoint;
			const daClassname = "_dynamic_adapt_" + daBreakpoint;

			if (daMatchMedia[index].matches) {
				//Перебрасываем элементы
				if (!daElement.classList.contains(daClassname)) {
					let actualIndex = indexOfElements(daDestination)[daPlace];
					if (daPlace === 'first') {
						actualIndex = indexOfElements(daDestination)[0];
					} else if (daPlace === 'last') {
						actualIndex = indexOfElements(daDestination)[indexOfElements(daDestination).length];
					}
					daDestination.insertBefore(daElement, daDestination.children[actualIndex]);
					daElement.classList.add(daClassname);
				}
			} else {
				//Возвращаем на место
				if (daElement.classList.contains(daClassname)) {
					dynamicAdaptBack(daElement);
					daElement.classList.remove(daClassname);
				}
			}
		}
		customAdapt();
	}

	//Вызов основной функции
	dynamicAdapt();

	//Функция возврата на место
	function dynamicAdaptBack(el) {
		const daIndex = el.getAttribute('data-da-index');
		const originalPlace = originalPositions[daIndex];
		const parentPlace = originalPlace['parent'];
		const indexPlace = originalPlace['index'];
		const actualIndex = indexOfElements(parentPlace, true)[indexPlace];
		parentPlace.insertBefore(el, parentPlace.children[actualIndex]);
	}
	//Функция получения индекса внутри родителя
	function indexInParent(el) {
		var children = Array.prototype.slice.call(el.parentNode.children);
		return children.indexOf(el);
	}
	//Функция получения массива индексов элементов внутри родителя 
	function indexOfElements(parent, back) {
		const children = parent.children;
		const childrenArray = [];
		for (let i = 0; i < children.length; i++) {
			const childrenElement = children[i];
			if (back) {
				childrenArray.push(i);
			} else {
				//Исключая перенесенный элемент
				if (childrenElement.getAttribute('data-da') == null) {
					childrenArray.push(i);
				}
			}
		}
		return childrenArray;
	}
	//Сортировка объекта
	function dynamicAdaptSort(arr) {
		arr.sort(function (a, b) {
			if (a.breakpoint > b.breakpoint) { return -1 } else { return 1 }
		});
		arr.sort(function (a, b) {
			if (a.place > b.place) { return 1 } else { return -1 }
		});
	}
	//Дополнительные сценарии адаптации
	function customAdapt() {
		//const viewport_width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
	}
}());

//======================================================Select===============================================================
if (document.querySelectorAll('.select').length > 0) {
	const select = function () {
		const selectHeader = document.querySelectorAll('.select-header'),
			selectHeaderIcon = document.querySelectorAll('.select-header__icon'),
			selectItem = document.querySelectorAll('.select-body__item');
	
		const selectToggle = function (e) {
			this.parentElement.classList.toggle('active');
		};
	
		const selectToggleArrow = function (e) {
			document.querySelectorAll('.select').forEach(item => {
				item.addEventListener('click', (e) => {
					if (item.classList.contains('active')) {
						selectHeader.forEach(item => {
							if (item.classList.contains('select active')) {
								item.classList.toggle('active');
							}
						});
					}
					const selectArrow = item.querySelector('.select-header__icon');
					selectArrow.classList.toggle('active');
				});
			});
		};
	
		const selectChoose = function () {
			const text = this.innerHTML,
				select = this.closest('.select'),
				currentText = this.closest('.select').querySelector('.select-header__current');
	
			currentText.innerHTML = text;
			select.classList.remove('active');
			document.querySelector('.select-header__icon').classList.remove('active');
		};
	
		if (document.querySelector('.select')) {
			document.addEventListener('click', (e) => {
				if (!e.target.closest('.select')) {
					document.querySelector('.select').classList.remove('active');
					document.querySelector('.select-header__icon').classList.remove('active');
				}
			});
		}
	
		selectHeader.forEach(item => {
			item.addEventListener('click', selectToggle);
		});
	
		selectToggleArrow();
	
		selectItem.forEach(item => {
			item.addEventListener('click', selectChoose);
		});
	};
	
	select();
}

const popupLinks = document.querySelectorAll('.popup-link'),
      body = document.querySelector('body'),
      lockPadding = document.querySelectorAll('.lock-padding'), // для фиксированных обьектов
      timeout = 800;

let unlock = true;

if (popupLinks.length > 0) {
    popupLinks.forEach(item => {
        item.addEventListener('click', function (e) {
            const popupName = item.getAttribute('href').replace('#', ''),
                  currentPopup = document.getElementById(popupName);
            popupOpen(currentPopup);
            e.preventDefault();
        });
    });
}

const popupCloseIcon = document.querySelectorAll('.close-popup');

if (popupCloseIcon.length > 0) {
    popupCloseIcon.forEach(item => {
        item.addEventListener('click', function(e) {
            popupClose(item.closest('.popup'));
            e.preventDefault();
        });
    });
}

function popupOpen(currentPopup) {
    if (currentPopup && unlock) {
        const popupActive = document.querySelector('.popup.active');
        if (popupActive) {
            popupClose(popupActive, false);
        } else {
            bodyLock();
        }
        currentPopup.classList.add('active');
        currentPopup.addEventListener('click', function (e) {
            if (!e.target.closest('.popup__content')) {
                popupClose(e.target.closest('.popup'));
            }
        });
    }
}

function popupClose(popupActive, doUnLock = true) {
    if (unlock) {
        popupActive.classList.remove('active');
        if (doUnLock) {
            bodyUnLock();
        }
    }
}

function bodyLock() {
    const lockPaddingValue = window.innerWidth - document.querySelector('body').offsetWidth + 'px';
    if (lockPadding.langth > 0) {
        lockPadding.forEach(item => {
            item.style.paddingRight = lockPaddingValue;
        });
    }
    body.style.paddingRight = lockPaddingValue;
    body.classList.add('lock'); // в css добавить body.lock overflow: hidden; 
    
    unlock = false;
    setTimeout(function () {
        unlock = true;
    }, timeout);
}

function bodyUnLock() {
    setTimeout(function () {
        if (lockPadding.length > 0) {
            lockPadding.forEach(item => {
                item.style.paddingRight = '0px';
            });
        }
        body.style.paddingRight = '0px';
        body.classList.remove('lock');
    }, timeout);

    unlock = false;
    setTimeout(function () {
        unlock = true;
    }, timeout);
}

document.addEventListener('keydown', (e) => {
    if (e.which === 27) {
        const popupActive = document.querySelector('.popup.active');
        popupClose(popupActive);
    }
});

(function () {
    //проверяем поддержку
    if (Element.prototype.closest) {
        // реализуем
        Element.prototype.closest = function (css) {
            var node = this;
            while (node) {
                if (node.matches(css)) return node;
                else node = node.parentElement;
            }
            return null;
        };
    }
})();
(function () {
    if (Element.prototype.matches) {
        Element.prototype.matches = Element.prototype.matchesSelector ||
        Element.prototype.webkitMatchesSelector ||
        Element.prototype.mozMatchesSelector ||
        Element.prototype.msMatchesSelector;
    }
})();