document.addEventListener('DOMContentLoaded', () => {
    const categoriasContainer = document.getElementById('categorias');
    const listaRecetasContainer = document.getElementById('lista-recetas');
    const categoriaTitulo = document.getElementById('categoria-titulo');

    fetch('https://www.themealdb.com/api/json/v1/1/categories.php')
        .then(response => response.json())
        .then(data => {
            data.categories.forEach(categoria => {
                const card = document.createElement('div');
                card.classList.add('card');
                card.innerHTML = `
                    <h3>${categoria.strCategory}</h3>
                    <p>${categoria.strCategoryDescription}</p>
                    <img src="${categoria.strCategoryThumb}" alt="${categoria.strCategory}">
                `;
                card.addEventListener('click', () => mostrarRecetas(categoria.strCategory));
                categoriasContainer.appendChild(card);
            });
        })
        .catch(error => console.error('Error al obtener categorías:', error));

    function mostrarRecetas(nombreCategoria) {
        fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${nombreCategoria}`)
            .then(response => response.json())
            .then(data => {
                categoriaTitulo.textContent = `Recetas de ${nombreCategoria}`;
                categoriasContainer.style.display = 'none';
                listaRecetasContainer.style.display = 'block';
                listaRecetasContainer.innerHTML = '';
                data.meals.forEach(receta => {
                    const recetaCard = document.createElement('div');
                    recetaCard.classList.add('receta');
                    recetaCard.innerHTML = `
                        <h3>${receta.strMeal}</h3>
                        <p>${receta.strInstructions}</p>
                        <img src="${receta.strMealThumb}" alt="${receta.strMeal}">
                        <button onclick="mostrarDetalles('${receta.idMeal}')">Ver Detalles</button>
                    `;
                    listaRecetasContainer.appendChild(recetaCard);
                });
            })
            .catch(error => console.error(`Error al obtener recetas de ${nombreCategoria}:`, error));
    }

    window.mostrarDetalles = function (idReceta) {
        fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${idReceta}`)
            .then(response => response.json())
            .then(data => {
                const receta = data.meals[0];
                alert(`
                    Detalles de ${receta.strMeal}:
                    - Categoría: ${receta.strCategory}
                    - Ingredientes: ${receta.strIngredient1}, ${receta.strIngredient2}, ...
                    - Cantidades: ${receta.strMeasure1}, ${receta.strMeasure2}, ...
                `);
            })
            .catch(error => console.error(`Error al obtener detalles de la receta ${idReceta}:`, error));
    };
});
