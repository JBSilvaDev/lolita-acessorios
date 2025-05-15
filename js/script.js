// Configurações da loja
const storeConfig = {
    ownerName: "Seu Nome", // Substitua pelo nome do proprietário
    ownerEmail: "contato@arteencanto.com", // Substitua pelo email de contato
    shopeeLink: "https://shopee.com.br/arte-encanto", // Substitua pelo link da sua loja na Shopee
    socialLinks: {
        instagram: "https://www.instagram.com/seu-perfil", // Substitua pelo link do seu Instagram
        whatsapp: "https://wa.me/seu-numero", // Substitua pelo seu número de WhatsApp (formato internacional)
        pinterest: "https://www.pinterest.com/seu-perfil" // Substitua pelo link do seu Pinterest
    },
    imagesPath: "images/produtos/" // Caminho para a pasta de imagens dos produtos
};

// Elementos do Modal (Popup)
const modal = document.getElementById('productModal');
const modalImage = document.getElementById('modal-image'); // Imagem principal no modal (agora existe novamente)
const modalTitle = document.getElementById('modal-title');
const modalDescription = document.getElementById('modal-description');
const modalPrice = document.getElementById('modal-price');
const modalShopeeLink = document.getElementById('modal-shopee-link');
const closeButton = document.querySelector('.close-button');
// Elemento para a galeria de imagens adicionais no modal
const modalGallery = document.getElementById('modal-gallery');


// Função para carregar e renderizar os produtos
async function loadAndRenderProducts() {
    try {
        // Caminho do arquivo JSON agora inclui a pasta 'data'
        const response = await fetch('data/products.json');
        if (!response.ok) {
            throw new Error(`Erro ao carregar data/products.json: ${response.statusText}`);
        }
        const productsData = await response.json();

        const gallery = document.getElementById('products-gallery');
        gallery.innerHTML = ''; // Limpa a galeria antes de carregar

        // Converte o objeto em array e itera sobre cada produto
        Object.entries(productsData).forEach(([imageName, product]) => {
            const productHTML = `
                <div class="product-card">
                    ${product.badge ? `<span class="custom-badge">${product.badge}</span>` : ''}
                    <img src="${storeConfig.imagesPath}${imageName}" alt="${product.title}" class="product-image" data-image-name="${imageName}">
                    <div class="product-info">
                        <h3 class="product-title">${product.title}</h3>
                        <div class="product-price">${product.price}</div>
                        <p class="product-description">${product.description}</p>
                        <a href="${product.link}" class="shopee-btn" target="_blank">
                            <i class="fas fa-shopping-cart"></i> ${product.badge === 'Sob Encomenda' ? 'Encomendar' : 'Comprar'} na Shopee
                        </a>
                    </div>
                </div>
            `;

            gallery.insertAdjacentHTML('beforeend', productHTML);
        });

        // Adiciona event listeners para as imagens APÓS carregá-las na galeria
        document.querySelectorAll('.product-image').forEach(image => {
            image.addEventListener('click', function() {
                const imageName = this.getAttribute('data-image-name');
                // Busca os dados do produto usando o nome da imagem
                const product = productsData[imageName];
                if (product) {
                    // Define a imagem principal do modal com a imagem do produto clicado
                    modalImage.src = this.src;

                    modalTitle.textContent = product.title;
                    modalDescription.textContent = product.description;
                    modalPrice.textContent = product.price;
                    modalShopeeLink.href = product.link; // Define o link do botão no modal

                    // Limpa a galeria de imagens adicionais anterior
                    modalGallery.innerHTML = '';

                    // Verifica se há imagens adicionais na galeria
                    if (product.galeria && product.galeria.length > 0) {
                        // Itera sobre as imagens adicionais e as adiciona ao contêiner da galeria no modal
                        product.galeria.forEach(extraImageName => {
                            const extraImage = document.createElement('img');
                            extraImage.src = `${storeConfig.imagesPath}${extraImageName}`;
                            extraImage.alt = `Imagem adicional de ${product.title}`;
                            // Adiciona um event listener para cada miniatura
                            extraImage.addEventListener('click', function() {
                                // Ao clicar na miniatura, atualiza a imagem principal do modal
                                modalImage.src = this.src;
                            });
                            modalGallery.appendChild(extraImage);
                        });
                         // Exibe o contêiner da galeria se houver imagens
                        modalGallery.style.display = 'flex'; // Usa flex para exibir as miniaturas horizontalmente
                    } else {
                         // Oculta o contêiner da galeria se não houver imagens
                        modalGallery.style.display = 'none';
                    }


                    // Exibe o modal usando flex para centralizar
                    modal.style.display = 'flex';
                } else {
                    console.error(`Produto não encontrado para a imagem: ${imageName}`);
                }
            });
        });

    } catch (error) {
        console.error('Erro ao carregar os produtos:', error);
        // Exibe uma mensagem de erro amigável na galeria em caso de falha
        document.getElementById('products-gallery').innerHTML = `
            <div class="error-message">
                <p>Não foi possível carregar os produtos no momento. Por favor, verifique o arquivo 'data/products.json' e se as imagens estão na pasta 'images/produtos/'.</p>
                <a href="${storeConfig.shopeeLink}" class="shopee-btn" target="_blank">
                    <i class="fas fa-external-link-alt"></i> Acessar Shopee
                </a>
            </div>
        `;
    }
}

// Função para atualizar informações da loja no rodapé
function updateStoreInfo() {
    // Ano atual
    document.getElementById('current-year').textContent = new Date().getFullYear();

    // Informações do proprietário
    document.getElementById('owner-name').textContent = storeConfig.ownerName;
    document.getElementById('owner-email').textContent = storeConfig.ownerEmail;
    document.getElementById('email-link').href = `mailto:${storeConfig.ownerEmail}`;

    // Links sociais e Shopee
    document.getElementById('shopee-link').href = storeConfig.shopeeLink;
    document.getElementById('instagram-link').href = storeConfig.socialLinks.instagram;
    document.getElementById('whatsapp-link').href = storeConfig.socialLinks.whatsapp;
    document.getElementById('pinterest-link').href = storeConfig.socialLinks.pinterest;

    // Evento para encomendas personalizadas (exemplo de alerta)
    document.getElementById('custom-orders').addEventListener('click', function(e) {
        e.preventDefault(); // Previne o comportamento padrão do link
        // Substitua o alert por um modal ou outra forma de contato se preferir
        alert('Para encomendas personalizadas, por favor, entre em contato pelo WhatsApp ou Instagram!');
    });
}

// Função para fechar o modal
function closeModal() {
    modal.style.display = 'none';
}

// Event listeners para fechar o modal
// Clicar no botão 'x'
closeButton.addEventListener('click', closeModal);

// Clicar fora do conteúdo do modal
window.addEventListener('click', function(event) {
    if (event.target === modal) {
        closeModal();
    }
});

// Inicialização: Carrega produtos e atualiza informações da loja quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    loadAndRenderProducts();
    updateStoreInfo();
});
