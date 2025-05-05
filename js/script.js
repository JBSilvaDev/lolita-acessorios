// Configurações da loja
const storeConfig = {
    ownerName: "Seu Nome",
    ownerEmail: "contato@arteencanto.com",
    shopeeLink: "https://shopee.com.br/arte-encanto",
    socialLinks: {
        instagram: "#",
        whatsapp: "#",
        pinterest: "#"
    },
    imagesPath: "images/" // Caminho para a pasta de imagens
};

// Função para carregar e renderizar os produtos
async function loadAndRenderProducts() {
    try {
        const response = await fetch('data/products.json');
        const productsData = await response.json();
        
        const gallery = document.getElementById('products-gallery');
        gallery.innerHTML = ''; // Limpa a galeria antes de carregar
        
        // Converte o objeto em array e itera sobre cada produto
        Object.entries(productsData).forEach(([imageName, product]) => {
            const productHTML = `
                <div class="product-card">
                    ${product.badge ? `<span class="custom-badge">${product.badge}</span>` : ''}
                    <img src="${storeConfig.imagesPath}${imageName}" alt="${product.title}" class="product-image">
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
    } catch (error) {
        console.error('Erro ao carregar os produtos:', error);
        document.getElementById('products-gallery').innerHTML = `
            <div class="error-message">
                <p>Não foi possível carregar os produtos no momento. Por favor, visite nossa loja na Shopee.</p>
                <a href="${storeConfig.shopeeLink}" class="shopee-btn" target="_blank">
                    <i class="fas fa-external-link-alt"></i> Acessar Shopee
                </a>
            </div>
        `;
    }
}

// Função para atualizar informações da loja
function updateStoreInfo() {
    // Ano atual
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    // Informações do proprietário
    document.getElementById('owner-name').textContent = storeConfig.ownerName;
    document.getElementById('owner-email').textContent = storeConfig.ownerEmail;
    document.getElementById('email-link').href = `mailto:${storeConfig.ownerEmail}`;
    
    // Links
    document.getElementById('shopee-link').href = storeConfig.shopeeLink;
    document.getElementById('instagram-link').href = storeConfig.socialLinks.instagram;
    document.getElementById('whatsapp-link').href = storeConfig.socialLinks.whatsapp;
    document.getElementById('pinterest-link').href = storeConfig.socialLinks.pinterest;
    
    // Evento para encomendas personalizadas
    document.getElementById('custom-orders').addEventListener('click', function(e) {
        e.preventDefault();
        alert('Envie mensagem pelo Shopee ou WhatsApp para encomendas especiais!');
    });
}

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    loadAndRenderProducts();
    updateStoreInfo();
});