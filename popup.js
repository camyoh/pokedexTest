document.addEventListener('DOMContentLoaded', async () => {
    const pokemonImage = document.getElementById('pokemonImage');
    const optionsContainer = document.getElementById("names");
    const approvedIcon = document.getElementById('approvedIcon');
    const rejectedIcon = document.getElementById('rejectedIcon');
        
    let pokemonNames = [];
    let animation = new Animation;
    let pokemon = ""

    const getRandomPK = async () => {
        showLoader();
        approvedIcon.style.display = "none";
        rejectedIcon.style.display = "none";

        const shuffled = shuffleArray(pokemonNames);
        let selectedNamesWithNumber = shuffled.slice(0, 4);
        let selectedNames = selectedNamesWithNumber.map(name => name.slice(3));
        pokemon = selectedNames[0];
        const shuffledNames = shuffleArray(selectedNames);

        shuffledNames.forEach((name, index) => {
            const option = document.getElementById(`option${index}`);
            option.innerHTML = name;
        });
        
        const url = `https://getimgurl-pkmapi-v1.herokuapp.com/pkm/${selectedNamesWithNumber[0]}`;

        let response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Something get wrong`);
        }
        let data = await response.json();
        pokemonImage.src = `https://${data.pokemonUrl}`;
        await pokemonImage.decode();
        stopLoader();
    }

    const showLoader = () => {
        pokemonImage.src = "./icon.png";
        pokemonImage.style.width = "100px";
        animation = pokemonImage.animate([
            { transform: "rotate(0deg)" },
            { transform: "rotate(360deg)" }
        ], {
            duration: 1000,
            iterations: Infinity
        });
    }

    const stopLoader = () => {
        animation.cancel();
        pokemonImage.style.width = "200px";
    }

    document.getElementById("reload").addEventListener("click", getRandomPK);
    optionsContainer.childNodes.forEach(cellName => cellName.addEventListener("click", () => {
        if (cellName.innerHTML == pokemon) {
            approvedIcon.style.display = "block";
        } else {
            rejectedIcon.style.display = "block";
        }
    }))

    const myFetch = async () => {
        let response = await fetch('./names.json');
        if (!response.ok) {
            throw new Error(`No such file`);
        }
        let data = await response.json();
        pokemonNames = data.names;
        getRandomPK();
    }

    function shuffleArray(array) {
        let shuffled = array;
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }


    myFetch();

});
