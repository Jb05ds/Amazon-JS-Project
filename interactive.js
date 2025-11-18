const DropDownSearch = () => {
    const items = document.querySelector('.dropMenu')
    items.style.display = 
    items.style.display === 'block' ? 'none' : 'block';
}

document.querySelector('.js-search-button-all').addEventListener('click', DropDownSearch)