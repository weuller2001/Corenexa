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