document.addEventListener('DOMContentLoaded', function() {
    const tilesContainer = document.querySelector('.ag-courses_box');
    let dragSrcEl = null;
    let ghostEl = null;

    function handleDragStart(e) {
        dragSrcEl = this;
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', '');

        // Suppress the default drag image
        const emptyImg = new Image();
        emptyImg.src =
            'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';
        e.dataTransfer.setDragImage(emptyImg, 0, 0);

        // Create a ghost element
        ghostEl = this.cloneNode(true);
        ghostEl.style.position = 'fixed';
        ghostEl.style.pointerEvents = 'none';
        ghostEl.style.width = `${this.offsetWidth}px`;
        ghostEl.style.height = `${this.offsetHeight}px`;
        ghostEl.style.transform = 'scale(0.5)';
        ghostEl.style.transformOrigin = 'top left';
        ghostEl.style.opacity = '0.8';
        ghostEl.style.zIndex = '1000';
        document.body.appendChild(ghostEl);

        // Hide the original tile
        this.style.opacity = '0';

        // Position the ghost element at the cursor
        updateGhostPosition(e);
    }

    function updateGhostPosition(e) {
        const scale = 0.5; // Scale factor

        // Position the ghost element under the cursor
        ghostEl.style.left = `${e.clientX + 10}px`;
        ghostEl.style.top = `${e.clientY + 10}px`;
    }

    function handleDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';

        // Update ghost position
        updateGhostPosition(e);

        let target = e.target;
        // Traverse up to the .ag-courses_item
        while (
            target &&
            !target.classList.contains('ag-courses_item') &&
            target !== tilesContainer
            ) {
            target = target.parentNode;
        }

        if (!target || target === dragSrcEl) return;

        const rect = target.getBoundingClientRect();
        const mouseX = e.clientX;
        const targetMidX = rect.left + rect.width / 2;

        // Rearrange the tiles in the DOM without animation
        if (mouseX < targetMidX) {
            tilesContainer.insertBefore(dragSrcEl, target);
        } else {
            tilesContainer.insertBefore(dragSrcEl, target.nextSibling);
        }
    }

    function handleDrop(e) {
        e.preventDefault();
        e.stopPropagation();

        // Show the original tile
        dragSrcEl.style.opacity = '1';

        // Remove ghost element
        if (ghostEl) {
            document.body.removeChild(ghostEl);
            ghostEl = null;
        }

        saveOrder();
        return false;
    }

    function handleDragEnd() {
        // Show the original tile
        if (dragSrcEl) {
            dragSrcEl.style.opacity = '1';
        }

        // Remove ghost element
        if (ghostEl) {
            document.body.removeChild(ghostEl);
            ghostEl = null;
        }
    }

    function addDragAndDropHandlers(elem) {
        elem.addEventListener('dragstart', handleDragStart, false);
        elem.addEventListener('dragover', handleDragOver, false);
        elem.addEventListener('dragenter', e => e.preventDefault(), false);
        elem.addEventListener('dragend', handleDragEnd, false);
        elem.addEventListener('drop', handleDrop, false);
    }

    function saveOrder() {
        const tiles = tilesContainer.querySelectorAll('.ag-courses_item');
        const tileOrder = Array.from(tiles).map(tile =>
            tile.getAttribute('data-id')
        );
        localStorage.setItem('tileOrder', JSON.stringify(tileOrder));
    }

    function loadOrder() {
        const tileOrder = JSON.parse(localStorage.getItem('tileOrder'));
        if (tileOrder) {
            tileOrder.forEach(id => {
                const tile = tilesContainer.querySelector(
                    `.ag-courses_item[data-id="${id}"]`
                );
                if (tile) {
                    tilesContainer.appendChild(tile);
                }
            });
        }
    }

    // Initialize tiles
    const tiles = tilesContainer.querySelectorAll('.ag-courses_item');
    tiles.forEach(function(tile) {
        addDragAndDropHandlers(tile);
    });

    // Load saved order on page load
    loadOrder();
});
