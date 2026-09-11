// --------------------------------------------------
// ABRIR CAMPO DE BUSCA
// --------------------------------------------------

function abrirBusca() {

    const botao = document.getElementById("botaoBusca");

    const campo = document.getElementById("cidade");


    botao.style.display = "none";

    campo.style.display = "block";

    campo.focus();

}


// ENTER PARA PESQUISAR

function teclaEnter(event) {

    if (event.key === "Enter") {

        buscarCidade();

    }

}


// --------------------------------------------------
// INTERPRETAR CLIMA
// --------------------------------------------------

function interpretarClima(codigo) {


    // CÉU LIMPO

    if (codigo === 0) {

        return {

            descricao: "Céu limpo",

            icone: "sun",

            fundo: "sol.png"

        };

    }


    // PARCIALMENTE NUBLADO

    if (codigo >= 1 && codigo <= 3) {

        return {

            descricao: "Parcialmente nublado",

            icone: "cloud-sun",

            fundo: "sol.png"

        };

    }


    // NEBLINA

    if (codigo >= 45 && codigo <= 48) {

        return {

            descricao: "Neblina",

            icone: "cloud",

            fundo: "nublado.png"

        };

    }


    // CHUVA

    if (codigo >= 51 && codigo <= 67) {

        return {

            descricao: "Chuva",

            icone: "cloud-rain",

            fundo: "chuva.png"

        };

    }


    // NEVE

    if (codigo >= 71 && codigo <= 77) {

        return {

            descricao: "Neve",

            icone: "snowflake",

            fundo: "neve.png"

        };

    }


    // PANCADAS DE CHUVA

    if (codigo >= 80 && codigo <= 82) {

        return {

            descricao: "Pancadas de chuva",

            icone: "cloud-rain",

            fundo: "chuva.png"

        };

    }


    // PANCADAS DE NEVE

    if (codigo >= 85 && codigo <= 86) {

        return {

            descricao: "Pancadas de neve",

            icone: "snowflake",

            fundo: "neve.png"

        };

    }


    // TEMPESTADE

    if (codigo >= 95) {

        return {

            descricao: "Tempestade",

            icone: "cloud-lightning",

            fundo: "chuva.png"

        };

    }


    return {

        descricao: "Condição desconhecida",

        icone: "cloud",

        fundo: "nublado.png"

    };

}


// --------------------------------------------------
// BUSCAR CIDADE
// --------------------------------------------------

async function buscarCidade() {

    try {


        // --------------------------------------------------
        // PEGAR NOME DA CIDADE
        // --------------------------------------------------

        const nomeCidade =
            document.getElementById("cidade").value.trim();


        if (nomeCidade === "") {

            alert("Digite uma cidade.");

            return;

        }


        // --------------------------------------------------
        // API LOCALIZAÇÃO
        // --------------------------------------------------

        const resposta = await fetch(

            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(nomeCidade)}&count=1&language=pt&format=json`

        );


        const dados = await resposta.json();


        console.log("Dados da cidade:", dados);


        if (!dados.results || dados.results.length === 0) {

            alert("Cidade não encontrada.");

            return;

        }


        const cidade = dados.results[0];


        const latitude = cidade.latitude;

        const longitude = cidade.longitude;


        console.log("Cidade:", cidade.name);

        console.log("Latitude:", latitude);

        console.log("Longitude:", longitude);


        // --------------------------------------------------
        // API CLIMA
        // --------------------------------------------------

        const urlClima =

            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code`;


        const respostaClima =

            await fetch(urlClima);


        const dadosClima =

            await respostaClima.json();


        console.log("Dados do clima:", dadosClima);


        const temperatura =

            dadosClima.current.temperature_2m;


        const humidade =

            dadosClima.current.relative_humidity_2m;


        const vento =

            dadosClima.current.wind_speed_10m;


        const codigoTempo =

            dadosClima.current.weather_code;

        console.log("Codigo Tempo: ", codigoTempo)


        // --------------------------------------------------
        // INTERPRETAR CLIMA
        // --------------------------------------------------

        const clima =

            interpretarClima(codigoTempo);


        console.log("Clima:", clima);


        // --------------------------------------------------
        // ALTERAR FUNDO
        // --------------------------------------------------

        document.body.style.backgroundImage =

            `url("imagens/${clima.fundo}")`;


        document.body.style.backgroundSize = "cover";

        document.body.style.backgroundPosition = "center";

        document.body.style.backgroundRepeat = "no-repeat";

        document.body.style.backgroundAttachment = "fixed";


        // --------------------------------------------------
        // MOSTRAR CLIMA
        // --------------------------------------------------

        document.getElementById("clima").innerHTML = `

            <i
                data-lucide="${clima.icone}"
                class="icone-clima"
            ></i>


            <h2>
                ${cidade.name}
            </h2>


            <p class="descricao">
                ${clima.descricao}
            </p>


            <div class="informacao-clima">

                <i data-lucide="thermometer"></i>

                <span>
                    Temperatura:
                    <strong>
                        ${temperatura}°C
                    </strong>
                </span>

            </div>


            <div class="informacao-clima">

                <i data-lucide="droplets"></i>

                <span>
                    Umidade:
                    <strong>
                        ${humidade}%
                    </strong>
                </span>

            </div>


            <div class="informacao-clima">

                <i data-lucide="wind"></i>

                <span>
                    Vento:
                    <strong>
                        ${vento} km/h
                    </strong>
                </span>

            </div>

        `;


        // --------------------------------------------------
        // API NOTÍCIAS
        // --------------------------------------------------

        const urlNoticia =

            `https://gnews.io/api/v4/search?q=${encodeURIComponent(nomeCidade)}&lang=pt&max=3&apikey=787e717164c0ef27d5fb107b205bb692`;


        const respostaNoticia =

            await fetch(urlNoticia);


        const dadosNoticia =

            await respostaNoticia.json();


        console.log("Dados das notícias:", dadosNoticia);


        // --------------------------------------------------
        // ÁREA DE NOTÍCIAS
        // --------------------------------------------------

        const cardNoticias =

            document.getElementById("noticias");


        // --------------------------------------------------
        // VERIFICAR NOTÍCIAS
        // --------------------------------------------------

        if (
            !dadosNoticia.articles ||
            dadosNoticia.articles.length === 0
        ) {

            cardNoticias.innerHTML = `

                <div class="titulo-noticias">

                    <img
                        src="imagens/noticias.svg"
                        class="icone-noticias"
                    >

                    <h2>
                        Notícias
                    </h2>

                </div>


                <div class="noticias-lista">

                    <p>
                        Nenhuma notícia encontrada.
                    </p>

                </div>

            `;

            lucide.createIcons();

            return;

        }


        // --------------------------------------------------
        // PEGAR AS 3 NOTÍCIAS
        // --------------------------------------------------

        const noticias =

            dadosNoticia.articles.slice(0, 3);


        // --------------------------------------------------
        // MONTAR AS NOTÍCIAS
        // --------------------------------------------------

        let htmlNoticias = `

            <div class="titulo-noticias">

                <img
                    src="imagens/noticias.svg"
                    class="icone-noticias"
                >

                <h2>
                    Notícias
                </h2>

            </div>


            <div class="noticias-lista">

        `;


        noticias.forEach(function(noticia) {


            // Imagem padrão caso a notícia não tenha imagem

            const imagem =

                noticia.image ||

                "imagens/noticias.svg";


            htmlNoticias += `

                <div class="noticia">

                    <img
                        src="${imagem}"
                        alt="Imagem da notícia"
                    >


                    <div class="conteudo-noticia">

                        <h3>
                            ${noticia.title}
                        </h3>


                        <p>
                            ${noticia.description || "Sem resumo disponível."}
                        </p>


                        <a
                            href="${noticia.url}"
                            target="_blank"
                        >
                            Ler notícia →
                        </a>

                    </div>

                </div>

            `;

        });


        htmlNoticias += `

            </div>

        `;


        cardNoticias.innerHTML = htmlNoticias;


        // --------------------------------------------------
        // ATIVAR ÍCONES LUCIDE
        // --------------------------------------------------

        lucide.createIcons();


    }

    catch (erro) {

        console.error("Erro:", erro);

        alert(
            "Ocorreu um erro ao buscar os dados."
        );

    }

}


// --------------------------------------------------
// ATIVAR LUPA INICIAL
// --------------------------------------------------

lucide.createIcons();