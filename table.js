let url = './info.json'; // Relative path to your JSON file in the same directory

function createFlexItem(content, hasLink = false) {
    const flexItem = document.createElement('div');
    flexItem.classList.add('flex-item');
    flexItem.textContent = content;

    if (hasLink) {
        flexItem.classList.add('has-link');
    }

    return flexItem;
}

function populateData(data) {
    const container = document.querySelector('.flex-container');

    for (let i = 0; i < data.length; i++) { 
        const rowContainer = document.createElement('div');
        rowContainer.classList.add('row-container');

        const rowContent = document.createElement('div');
        rowContent.classList.add('row-content');

        // Extract each item from the JSON using the correct keys
        const yearItem = createFlexItem(data[i].year);
        const nameItem = createFlexItem(data[i].name);
        const titleItem = createFlexItem(data[i].title, Boolean(data[i].link), true);
        
        // If there's a link associated with the data row, then we will add the 'has-link' class to the category
        const categoryItem = createFlexItem(data[i].category, Boolean(data[i].link));

        // Append items to the row content
        rowContent.appendChild(yearItem);
        rowContent.appendChild(nameItem);
        rowContent.appendChild(titleItem);
        rowContent.appendChild(categoryItem);

        const descriptionDiv = document.createElement('div');
        descriptionDiv.classList.add('description');
        descriptionDiv.textContent = data[i].description;

        rowContainer.appendChild(rowContent);
        rowContainer.appendChild(descriptionDiv);

        // Insert the row container before the sticky footer
        container.insertBefore(rowContainer, document.querySelector('.sticky-footer'));

        if (data[i].link) {
            let finalLink = data[i].link;
            if (!data[i].link.startsWith('http://') && !data[i].link.startsWith('https://')) {
                finalLink = 'http://' + data[i].link;
            }

            titleItem.addEventListener('click', (e) => {
                window.open(finalLink, '_blank');
                e.stopPropagation(); // This prevents the rowContainer click event from firing
            });
        }

        rowContainer.addEventListener('click', (event) => {
            if (event.target !== titleItem) { // So that title link clicks don't expand/collapse the row
                if (rowContainer.classList.contains('expanded')) {
                    rowContainer.classList.remove('expanded');
                } else {
                    rowContainer.classList.add('expanded');
                }
            }
        });
    }
}


function highlightCategory(category) {
    const allRows = document.querySelectorAll('.row-container');
    allRows.forEach(row => {
        const categoryItem = row.querySelector('.flex-item:nth-child(4)');
        if (categoryItem.textContent.trim() === category) {
            row.classList.add('same-category-highlight');
        }
    });
}

function unhighlightCategory(category) {
    const allRows = document.querySelectorAll('.row-container');
    allRows.forEach(row => {
        const categoryItem = row.querySelector('.flex-item:nth-child(4)');
        if (categoryItem.textContent.trim() === category) {
            row.classList.remove('same-category-highlight');
        }
    });
}
function createFlexItem(content, hasLink = false, isTitle = false) {
    const flexItem = document.createElement('div');
    flexItem.classList.add('flex-item');
    flexItem.textContent = content;

    if (hasLink) {
        flexItem.classList.add('has-link');
    }

    if (isTitle) {
        flexItem.classList.add('flex-item-title');
    }

    return flexItem;
}

function setRowEventListeners(data) {
    const allRows = document.querySelectorAll('.row-container');
    allRows.forEach(row => {
        const categoryItem = row.querySelector('.flex-item:nth-child(4)');
        const categoryText = categoryItem.textContent.trim();

        row.addEventListener('mouseenter', () => {
            highlightCategory(categoryText);
        });
        row.addEventListener('mouseleave', () => {
            unhighlightCategory(categoryText);
        });
    });
}

// Reading the JSON file and populating the data
fetch(url)
    .then(response => response.json())
    .then(json => {
        populateData(json.Sheet1); // <-- Access the Sheet1 key here
        // After data is populated, set the event listeners
        setRowEventListeners(json.Sheet1); // <-- Access the Sheet1 key here
    });

    
