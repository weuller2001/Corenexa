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

/* --- Lógica de Envio de Formulário (AJAX com Redirecionamento) --- */
const form = document.getElementById("my-form");

if (form) {
    
    async function handleSubmit(event) {
        event.preventDefault(); // Impede o site de mudar de página imediatamente
        
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
                // --- SUCESSO ---
                status.innerHTML = "Obrigado! Mensagem enviada. Redirecionando...";
                status.classList.add('success'); // Fica verde
                form.reset(); // Limpa os campos

                // AGUARDA 2 SEGUNDOS E REDIRECIONA
                setTimeout(() => {
                    // Certifique-se que o arquivo pageObrigado.html existe na mesma pasta
                    window.location.href = "pageObrigado.html"; 
                }, 2000);

            } else {
                // --- ERRO ---
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
            // --- ERRO DE CONEXÃO ---
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

/* --- LÓGICA PARA ABRIR O MENU NO CELULAR (AO CLICAR NO NOME) --- */
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

        // Opcional: Fechar o menu se clicar fora dele
        document.addEventListener('click', function(e) {
            if (!parentItem.contains(e.target)) {
                parentItem.classList.remove('active');
            }
        });
    }
});

/* --- LÓGICA DO SLIDER DE BACKUP (Data Protection) --- */

// Esta função é chamada diretamente pelo oninput no HTML
function updateStorage(val) {
    const display = document.getElementById('storageDisplay');
    const btnText = document.getElementById('btnTextStorage');
    const btnLink = document.getElementById('btnCustomStorage');
    
    // Verifica se os elementos existem antes de tentar alterar (Evita erro em outras páginas)
    if (display && btnText && btnLink) {
        
        let formattedVal = "";
        let linkVal = "";

        if (val >= 1000) {
            // Se for maior que 1000, converte para TB
            let tbVal = (val / 1000).toFixed(1);
            
            // Remove o .0 se for redondo (ex: 2.0 vira 2)
            if(tbVal.endsWith('.0')) {
                tbVal = tbVal.replace('.0', '');
            }
            
            formattedVal = tbVal + " TB";
            linkVal = tbVal + "TB";
        } else {
            formattedVal = val + " GB";
            linkVal = val + "GB";
        }

        // Atualiza o visual
        display.innerText = formattedVal;
        btnText.innerText = formattedVal;
        
        // Atualiza o link do botão para já chegar no contato com o valor certo
        btnLink.href = `pageContato.html?plano=BackupPersonalizado&gb=${linkVal}`;
    }
}