import './common.js'
import './scss/product-page.scss';

function indexOfSmallest(a) {
    return a.reduce(function (lowest, next, index) {
        return next < a[lowest] ? index : lowest;
    }, 0);
}

function indexOfLargest(a) {
    return a.reduce(function (lowest, next, index) {
        return next > a[lowest] ? index : lowest;
    }, 0);
}

function getCurrentSection(elements) {
    const result = elements.map(e => {
        const rect = e.getBoundingClientRect();

        return {
            element: e,
            top: rect.top - tabBarHeight
        };
    });

    // now we have the positions of the divs relative to the window
    // -> top of div is below the window: top == +ve
    // -> top of div touches top of screen: top ==0
    // -> top of div is off-screen (top): top == -ve

    // 1. If all top values +ve, 
    // that means the section with the smallest number should be active (i.e. top-most section)
    if (result.reduce((prev, curr) => prev && (curr.top > 0), true)) {
        const smallest = result[indexOfSmallest(result.map(x => x.top))];
        return smallest.element;
    }

    // 2. If there is a negative value,
    // only consider the negative values for the active div
    // since only those elements are already visible

    // 2.1: we are on the div
    // The div that we are currently "reading" will have the smallest (most positive) negative (or 0) value.
    const negativeTops = result.filter(result => result.top <= 0);
    const smallest = negativeTops[
        indexOfLargest(negativeTops.map(x => x.top))
    ];
    return smallest.element;
}

const elements = [
    document.getElementById('features'),
    document.getElementById('support'),
    document.getElementById('specifications'),
];

const navItems = [
    document.getElementById('featuresNavItem'),
    document.getElementById('supportNavItem'),
    document.getElementById('specificationsNavItem'),
]

const tabBarHeight = $('.tab-bar').height();

document.addEventListener('scroll', function() {
    const currentSection = getCurrentSection(elements);
    
    elements.map((element, index) => {
        if (element === currentSection) {
            navItems[index].classList.add('active');
        } else {
            navItems[index].classList.remove('active');
        }
    })
});