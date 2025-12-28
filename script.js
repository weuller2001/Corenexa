/* Arquivo: script.js */

// --- LÓGICA DO CARROSSEL (SLIDESHOW) ---
const slides = document.querySelectorAll('.hero-img .slide');

// A "proteção": Só roda o código do carrossel se houver slides na página
if (slides.length > 0) {
    let currentSlide = 0;
    const slideInterval = 4000;

    function nextSlide() {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }

    setInterval(nextSlide, slideInterval);
}


// --- LÓGICA DO MENU MOBILE ---
const mobileMenuIcon = document.querySelector('.mobile-menu-icon');
const navLinks = document.querySelector('.nav-links');

// A proteção: Só tenta adicionar o clique se o botão existir
if (mobileMenuIcon && navLinks) {
    mobileMenuIcon.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
}

/* --- Lógica de Envio de Formulário (AJAX) --- */
const form = document.getElementById("my-form");

if (form) {
    
    async function handleSubmit(event) {
        event.preventDefault(); // Impede o site de mudar de página
        
        const status = document.getElementById("my-form-status");
        const data = new FormData(event.target);
        
        // Envia os dados para o Formspree em segundo plano
        fetch(event.target.action, {
            method: form.method,
            body: data,
            headers: {
                'Accept': 'application/json'
            }
        }).then(response => {
            if (response.ok) {
                // Sucesso!
                status.innerHTML = "Obrigado! Sua mensagem foi enviada com sucesso.";
                status.classList.add('success'); // Fica verde
                form.reset(); // Limpa os campos
            } else {
                // Erro do servidor
                response.json().then(data => {
                    if (Object.hasOwn(data, 'errors')) {
                        status.innerHTML = data["errors"].map(error => error["message"]).join(", ");
                    } else {
                        status.innerHTML = "Oops! Ocorreu um erro ao enviar.";
                    }
                    status.classList.add('error'); // Fica vermelho
                })
            }
        }).catch(error => {
            // Erro de conexão
            status.innerHTML = "Oops! Houve um problema na conexão.";
            status.classList.add('error');
        });
    }

    form.addEventListener("submit", handleSubmit);
}

/* --- PREENCHIMENTO AUTOMÁTICO DO PLANO (Página de Contato) --- */

// 1. Verifica se estamos na página que tem o campo de mensagem
const mensagemField = document.getElementById('mensagem');

if (mensagemField) {
    // 2. Lê a URL do navegador para achar o "?plano=..."
    const urlParams = new URLSearchParams(window.location.search);
    const planoSelecionado = urlParams.get('plano');

    // 3. Se tiver um plano na URL, preenche o texto
    if (planoSelecionado) {
        // Formata o texto (ex: Transforma "Intermediario" em "Intermediário")
        let nomePlano = planoSelecionado;
        if(planoSelecionado === 'Basico') nomePlano = 'Básico';
        if(planoSelecionado === 'Intermediario') nomePlano = 'Intermediário';
        
        // Escreve no campo de texto
        mensagemField.value = `Olá! Gostaria de solicitar um orçamento para o Plano ${nomePlano}.\n\nAguardo contato.`;
    }
}
document.addEventListener("DOMContentLoaded", function() {
    // Seleciona o link "Serviços"
    const menuServicos = document.querySelector('.dropdown-link');
    // Seleciona o pai (LI) que contém o submenu
    const parentItem = document.querySelector('.dropdown-item');

    if (menuServicos && parentItem) {
        menuServicos.addEventListener('click', function(e) {
            // Verifica se é celular (largura menor ou igual a 768px)
            if (window.innerWidth <= 768) {
                e.preventDefault(); // 1. IMPEDE de ir para a página pageServicos.html
                parentItem.classList.toggle('active'); // 2. Abre ou fecha o menu
            }
        });
    }
    
    // Opcional: Fechar o menu se clicar fora dele
    document.addEventListener('click', function(e) {
        if (!parentItem.contains(e.target)) {
            parentItem.classList.remove('active');
        }
    });
});